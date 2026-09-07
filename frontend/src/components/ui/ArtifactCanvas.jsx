import React, { useState } from "react";
import { X, Code, Eye, Copy, Check, Sparkles } from "lucide-react";
import MermaidRenderer from "./MermaidRenderer";
import toast from "react-hot-toast";

export default function ArtifactCanvas({ artifact, onClose }) {
  const [activeTab, setActiveTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  if (!artifact) return null;

  const { title, type, content, language } = artifact;

  const copyContent = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Artifact copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] md:w-[600px] bg-[var(--bg-sidebar)] border-l border-[var(--border-medium)] shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[#6366f1]/20 text-[#818cf8] flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-[var(--text-primary)] truncate">{title || "Artifact Canvas"}</h3>
        </div>

        <div className="flex items-center gap-1">
          {/* Tab Switcher */}
          <div className="flex items-center p-0.5 bg-[var(--bg-sidebar)] rounded-full border border-[var(--border-subtle)]">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                activeTab === "preview" ? "bg-[var(--accent-indigo)] text-white" : "text-[var(--text-secondary)]"
              }`}
            >
              <Eye className="w-3 h-3 inline mr-1" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                activeTab === "code" ? "bg-[var(--accent-indigo)] text-white" : "text-[var(--text-secondary)]"
              }`}
            >
              <Code className="w-3 h-3 inline mr-1" />
              Source
            </button>
          </div>

          <button
            onClick={copyContent}
            className="btn-pill-base btn-pill-icon !w-7 !h-7"
            title="Copy Artifact Source"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="btn-pill-base btn-pill-icon !w-7 !h-7"
            title="Close Canvas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content View Area */}
      <div className="flex-1 overflow-auto p-4 bg-[var(--bg-app)]">
        {activeTab === "preview" ? (
          type === "mermaid" ? (
            <div className="p-4 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-subtle)] overflow-x-auto">
              <MermaidRenderer chart={content} />
            </div>
          ) : type === "html" ? (
            <iframe
              title="Artifact HTML Preview"
              srcDoc={content}
              className="w-full h-full min-h-[500px] border-0 rounded-xl bg-white"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="p-4 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono whitespace-pre-wrap leading-relaxed">
              {content}
            </div>
          )
        ) : (
          <pre className="p-4 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-medium)] text-xs font-mono text-[var(--text-primary)] overflow-x-auto">
            <code>{content}</code>
          </pre>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-sidebar)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
        <span>Artifact Type: {type || language || "text"}</span>
        <span className="badge-pill badge-indigo">Interactive Canvas</span>
      </div>
    </div>
  );
}
