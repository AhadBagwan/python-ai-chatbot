import React, { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import useChatStore from "../../stores/chatStore";
import useSettingsStore from "../../stores/settingsStore";
import { chatAPI } from "../../lib/api";
import toast from "react-hot-toast";

export default function ChatWindow({ injectedPrompt, clearInjectedPrompt }) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const { 
    activeChatId,
    getActiveChat, 
    addMessage, 
    updateLastMessage, 
    createChat,
    isLoading, 
    setLoading 
  } = useChatStore();
  const { explanationMode, model } = useSettingsStore();
  
  // Ensure conversation state exists
  useEffect(() => {
    if (!activeChatId) {
      createChat();
    }
  }, [activeChatId, createChat]);

  const activeChat = getActiveChat();
  const messages = activeChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  const sendMessage = async (content, image = null) => {
    if (!content.trim() && !image) return;

    let chatId = activeChatId;
    if (!chatId) {
      chatId = createChat();
    }

    addMessage(chatId, {
      role: "user",
      content: content.trim(),
      image,
    });
    setLoading(true);

    addMessage(chatId, {
      role: "assistant",
      content: "",
    });

    try {
      if (image) {
        const response = await chatAPI.analyzeImage(content, image);
        updateLastMessage(chatId, response.response || response.analysis);
      } else {
        await chatAPI.streamMessage(
          content,
          messages,
          (chunk) => updateLastMessage(chatId, chunk),
          model,
          explanationMode
        );
      }
    } catch (error) {
      console.error("Error:", error);
      updateLastMessage(chatId, "Sorry, I encountered an error. Please try again.");
      toast.error("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[var(--bg-app)] transition-colors">
      {/* Scrollable Chat / Welcome Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto flex flex-col"
      >
        {messages.length === 0 ? (
          <EmptyChat onSelectPrompt={(promptText) => sendMessage(promptText)} />
        ) : (
          <div className="w-full max-w-[800px] mx-auto py-6 flex-1">
            {messages.map((msg, idx) => (
              <ChatMessage 
                key={idx} 
                message={msg} 
                onRegenerate={
                  idx === messages.length - 1 && msg.role === "assistant"
                    ? () => {
                        const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
                        if (lastUserMsg) sendMessage(lastUserMsg.content, lastUserMsg.image);
                      }
                    : null
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 right-6 p-2 rounded-xl bg-[var(--bg-composer)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-md transition-all z-20"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* Floating Prompt Composer */}
      <ChatInput 
        onSend={sendMessage} 
        disabled={isLoading} 
        injectedPrompt={injectedPrompt} 
        clearInjectedPrompt={clearInjectedPrompt} 
      />
    </div>
  );
}
