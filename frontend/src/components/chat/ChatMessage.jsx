import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { User, Sparkles, Copy, Check, RefreshCw, Volume2, VolumeX, FileText } from "lucide-react";
import MermaidRenderer from "../ui/MermaidRenderer";
import useThemeStore from "../../stores/themeStore";
import useSettingsStore from "../../stores/settingsStore";
import { speakText, stopSpeech } from "../../lib/speechUtils";

export default function ChatMessage({ message, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [codeCopiedIndex, setCodeCopiedIndex] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { outputTheme } = useThemeStore();

  const isUser = message.role === "user";

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = async (codeText, idx) => {
    await navigator.clipboard.writeText(codeText);
    setCodeCopiedIndex(idx);
    setTimeout(() => setCodeCopiedIndex(null), 2000);
  };

  return (
    <div className={`py-5 px-4 sm:px-6 flex gap-3 sm:gap-4 max-w-[780px] mx-auto w-full border-b border-[var(--border-subtle)] last:border-0 ${isUser ? "justify-end" : "justify-start"}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#6366f1]/15 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8] mt-0.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Message Content Container */}
      <div className={`flex-1 min-w-0 ${isUser ? "max-w-[85%]" : "w-full"}`}>
        {/* Header Name & Timestamp */}
        <div className={`flex items-center gap-2 mb-1 text-xs ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="font-semibold text-[var(--text-primary)]">
            {isUser ? "You" : "AhadNova AI"}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Attachment Image if present */}
        {message.image && (
          <img 
            src={message.image} 
            alt="Uploaded attachment" 
            className="max-w-sm rounded-xl mb-3 border border-[var(--border-subtle)] shadow-sm" 
          />
        )}

        {/* Message Content */}
        {isUser ? (
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm sm:text-[15px] leading-relaxed shadow-xs">
            <p className="whitespace-pre-wrap font-normal">{message.content}</p>
          </div>
        ) : (
          <div className="markdown-content text-[var(--text-primary)] text-sm sm:text-[15px] leading-relaxed pt-0.5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  const lang = match ? match[1] : "code";

                  if (!inline && lang === "mermaid") {
                    return <MermaidRenderer chart={codeString} />;
                  }

                  return !inline ? (
                    <div className="my-3 rounded-xl overflow-hidden border border-[var(--border-medium)] bg-[var(--bg-sidebar)] shadow-xs">
                      {/* Code Header Bar */}
                      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[var(--bg-app)] border-b border-[var(--border-subtle)]">
                        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#818cf8]">
                          {lang}
                        </span>
                        <button
                          onClick={() => copyCode(codeString, codeString.slice(0, 15))}
                          title="Copy code snippet"
                          className="btn-pill-base btn-pill-secondary !h-6 !px-2 !text-[11px]"
                        >
                          {codeCopiedIndex === codeString.slice(0, 15) ? (
                            <>
                              <Check className="w-3 h-3 text-[#10b981]" />
                              <span className="text-[#10b981]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-[#818cf8]" />
                              <span>Copy code</span>
                            </>
                          )}
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match ? match[1] : "text"}
                        PreTag="div"
                        customStyle={{
                          background: "transparent",
                          padding: "0.85rem 1rem",
                          margin: 0,
                          fontSize: "0.825rem",
                          fontFamily: "'JetBrains Mono', monospace",
                          lineHeight: "1.6",
                        }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content || "..."}
            </ReactMarkdown>
          </div>
        )}

        {/* AI Action Buttons Toolbar */}
        {!isUser && message.content && (
          <div className="flex items-center gap-1.5 mt-3 pt-1">
            <button
              onClick={copyToClipboard}
              className="btn-pill-base btn-pill-secondary !h-7 !px-2.5 !text-[11px]"
              title="Copy answer to clipboard"
            >
              {copied ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3 text-[var(--text-muted)]" />}
              <span className={copied ? "text-[#10b981]" : ""}>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeech();
                  setIsSpeaking(false);
                } else {
                  const { selectedVoice } = useSettingsStore.getState();
                  const success = speakText(
                    message.content,
                    selectedVoice,
                    () => setIsSpeaking(false),
                    () => setIsSpeaking(false)
                  );
                  if (success) setIsSpeaking(true);
                }
              }}
              className={`btn-pill-base ${isSpeaking ? "btn-pill-security animate-pulse" : "btn-pill-secondary"} !h-7 !px-2.5 !text-[11px]`}
              title={isSpeaking ? "Stop audio playback" : "Listen to response (Text-to-Speech)"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3 h-3 text-[#f87171]" />
                  <span className="text-[#f87171]">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-[#818cf8]" />
                  <span>Listen</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const blob = new Blob([message.content], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `ahadnova-explanation-${Date.now()}.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="btn-pill-base btn-pill-secondary !h-7 !px-2.5 !text-[11px]"
              title="Export response as Markdown file"
            >
              <FileText className="w-3 h-3 text-[#818cf8]" />
              <span>Export .md</span>
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="btn-pill-base btn-pill-secondary !h-7 !px-2.5 !text-[11px]"
                title="Regenerate AI response"
              >
                <RefreshCw className="w-3 h-3 text-[var(--text-muted)]" />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] mt-0.5 shadow-xs">
          <User className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
