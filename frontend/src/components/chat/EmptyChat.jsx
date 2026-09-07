import React from "react";
import { Sparkles, ArrowUpRight } from "lucide-react";

const ACTION_VERBS = [
  { label: "Explain", prompt: "Explain how the TCP 3-way handshake works step by step." },
  { label: "Troubleshoot", prompt: "Troubleshoot high latency and BGP route leaks in a multi-homed network." },
  { label: "Design", prompt: "Design a Zero Trust Network Architecture for a cloud enterprise." },
  { label: "Review", prompt: "Review a Python FastAPI backend for OWASP Top 10 security vulnerabilities." },
  { label: "Compare", prompt: "Compare TLS 1.2 vs TLS 1.3 performance, latency, and cipher suites." },
  { label: "Secure", prompt: "How do I harden an Nginx reverse proxy against DDoS attacks?" },
];

export default function EmptyChat({ onSelectPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-[800px] mx-auto w-full text-center my-auto animate-fadeIn">
      {/* ✦ Brand Icon */}
      <div className="w-9 h-9 rounded-2xl bg-[#6366f1]/15 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8] mb-3 shadow-xs">
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Main App Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-1">
        AhadNova AI
      </h1>

      <p className="text-xs sm:text-sm font-medium text-[#818cf8] mb-4">
        Your technical AI engineering assistant
      </p>

      {/* Contextual Guidance */}
      <div className="max-w-md mb-6 space-y-1.5">
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Ask a question, describe a problem, or paste code, logs, configurations, or architecture details.
        </p>
        <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
          You can ask AhadNova AI to <span className="text-[var(--text-primary)] font-semibold">explain</span>, <span className="text-[var(--text-primary)] font-semibold">troubleshoot</span>, <span className="text-[var(--text-primary)] font-semibold">design</span>, <span className="text-[var(--text-primary)] font-semibold">review</span>, <span className="text-[var(--text-primary)] font-semibold">compare</span>, or <span className="text-[var(--text-primary)] font-semibold">secure</span> a system.
        </p>
      </div>

      {/* Action Mode Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
        {ACTION_VERBS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="btn-pill-base btn-pill-secondary group"
            title={`Prompt: ${item.prompt}`}
          >
            <span>{item.label}</span>
            <ArrowUpRight className="w-3 h-3 text-[#71717a] group-hover:text-[#818cf8] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
