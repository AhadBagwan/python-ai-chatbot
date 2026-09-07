import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X, Mic, MicOff, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function ChatInput({ 
  onSend, 
  onSendMessage, 
  isLoading, 
  disabled, 
  injectedPrompt, 
  clearInjectedPrompt 
}) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [docAttachment, setDocAttachment] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = onSend || onSendMessage;
  const isBusy = isLoading || disabled;

  useEffect(() => {
    if (injectedPrompt) {
      setMessage(injectedPrompt);
      if (clearInjectedPrompt) clearInjectedPrompt();
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [injectedPrompt, clearInjectedPrompt]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if ((!message.trim() && !image && !docAttachment) || isBusy) return;

    let fullMessage = message.trim();
    if (docAttachment) {
      const docHeader = `📄 **Attached File (${docAttachment.name})**:\n\`\`\`\n${docAttachment.content}\n\`\`\``;
      fullMessage = fullMessage ? `${fullMessage}\n\n${docHeader}` : docHeader;
    }

    if (handleSend) {
      handleSend(fullMessage, image);
    }
    setMessage("");
    setImage(null);
    setDocAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "70px";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Document file must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result || "";
      setDocAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        content: text,
      });
      toast.success(`Attached ${file.name}`);
    };
    reader.onerror = () => {
      toast.error("Failed to read document file");
    };
    reader.readAsText(file);
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Voice dictation not supported in this browser");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setMessage((prev) => prev + (prev ? " " : "") + transcript);
    };
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Voice recognition error");
    };

    recognition.start();
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 pb-4 pt-2 shrink-0">
      {/* Floating Composer Box */}
      <div className="relative rounded-2xl bg-[var(--bg-composer)] border border-[var(--border-subtle)] focus-within:border-[#6366f1]/50 focus-within:ring-1 focus-within:ring-[#6366f1]/30 transition-all shadow-lg overflow-hidden flex flex-col min-h-[110px]">
        {/* Attachment Image Preview Thumbnail */}
        {image && (
          <div className="px-4 pt-3 relative inline-block">
            <div className="relative inline-block">
              <img src={image} alt="Upload preview" className="h-16 rounded-xl border border-[var(--border-medium)] shadow-sm object-cover" />
              <button
                onClick={() => setImage(null)}
                title="Remove image attachment"
                aria-label="Remove image attachment"
                className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors shadow-sm cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Attachment Document Badge */}
        {docAttachment && (
          <div className="px-4 pt-3 relative inline-block">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-medium)] text-xs text-[var(--text-primary)] shadow-sm">
              <FileText className="w-4 h-4 text-[#818cf8]" />
              <div className="flex flex-col">
                <span className="font-semibold text-xs truncate max-w-[220px]">{docAttachment.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{docAttachment.size}</span>
              </div>
              <button
                onClick={() => setDocAttachment(null)}
                title="Remove document attachment"
                aria-label="Remove document attachment"
                className="p-1 rounded-full text-[var(--text-muted)] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors ml-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.max(70, Math.min(e.target.scrollHeight, 220))}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Message AhadNova AI..."
          className="w-full px-4 pt-3.5 pb-2 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-normal leading-relaxed focus:outline-none resize-none flex-1"
          style={{ minHeight: "70px" }}
        />

        {/* Bottom Toolbar */}
        <div className="px-3 pb-2.5 pt-1 flex items-center justify-between border-t border-[var(--border-subtle)] bg-transparent">
          {/* Left Controls - Attachment Button */}
          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt,.json,.md,.log,.yaml,.yml,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach image or document file (.pdf, .txt, .json, .md, .log, .yaml)"
              aria-label="Attach file"
              className="btn-pill-base btn-pill-icon"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          {/* Right Controls - Microphone & Send Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleVoice}
              title={isRecording ? "Stop voice recording" : "Voice dictation"}
              aria-label="Voice dictation"
              className={`btn-pill-base ${
                isRecording
                  ? "btn-pill-security animate-pulse"
                  : "btn-pill-icon"
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              title="Send message (Enter)"
              aria-label="Send message"
              disabled={isBusy || (!message.trim() && !image && !docAttachment)}
              className="btn-pill-base btn-pill-primary !w-8 !h-8 !p-0"
            >
              <Send className={`w-3.5 h-3.5 ${isBusy ? "animate-pulse" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[var(--text-muted)] text-center mt-2 font-normal">
        AhadNova AI is specialized in Networking, Cybersecurity, and Software Architecture.
      </p>
    </div>
  );
}
