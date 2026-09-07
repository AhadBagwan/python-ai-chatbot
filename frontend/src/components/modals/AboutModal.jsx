import React from "react";
import { X, Sparkles, Globe, Cpu, Terminal, ExternalLink, CheckCircle2 } from "lucide-react";

// Custom SVG Brand Icons for guaranteed compatibility
const LinkedInIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#0077b5]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#818cf8]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
  </svg>
);

export default function AboutModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">About AhadNova AI</h2>
              <p className="text-xs text-[var(--text-secondary)]">Intelligent Technical Assistant & Security Engineering Suite</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-pill-base btn-pill-icon"
            title="Close About Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Developer Profile & Social Links */}
          <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#818cf8]" />
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Developer Profile & Links</h3>
              </div>
              <span className="badge-pill badge-indigo">
                Author & Creator
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Connect with the developer behind AhadNova AI across social platforms, view portfolio projects, or inspect the source codebase.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/ahadbagwan/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-base btn-pill-secondary flex items-center justify-between !h-9 !px-3"
              >
                <div className="flex items-center gap-2">
                  <LinkedInIcon />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">LinkedIn</span>
                </div>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>

              {/* Portfolio */}
              <a
                href="https://ahadbagwan.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-base btn-pill-secondary flex items-center justify-between !h-9 !px-3"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#34d399]" />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">Portfolio</span>
                </div>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/AhadBagwan"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-base btn-pill-secondary flex items-center justify-between !h-9 !px-3"
              >
                <div className="flex items-center gap-2">
                  <GitHubIcon />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">GitHub</span>
                </div>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>
            </div>
          </div>

          {/* Platform Capability Overview */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Platform Capabilities & Built-in Modules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#818cf8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-primary)] block font-semibold">SAST Code Security Audit</strong>
                  <span className="text-[var(--text-secondary)] text-[11px]">Static vulnerability analysis with OWASP/CWE scoring & remediated patches.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#818cf8] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-primary)] block font-semibold">Live Mermaid Vector Diagrams</strong>
                  <span className="text-[var(--text-secondary)] text-[11px]">Auto-renders protocol handshakes, network flows & microservices topologies.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-primary)] block font-semibold">Cyber & Network Tools</strong>
                  <span className="text-[var(--text-secondary)] text-[11px]">Offline IPv4 CIDR subnetting calculator & JWT claims decoder.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#f87171] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-primary)] block font-semibold">Interactive Exam Quiz Hub</strong>
                  <span className="text-[var(--text-secondary)] text-[11px]">Practice quizzes for Security+, CEH, CCNA & System Design with explanations.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Specs */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <div>
              <span>Backend: </span>
              <span className="text-[#818cf8]">FastAPI + Python 3.12</span>
            </div>
            <div>
              <span>Frontend: </span>
              <span className="text-[#38bdf8]">React 19 + Tailwind</span>
            </div>
            <div>
              <span>AI Engine: </span>
              <span className="text-[#34d399]">Gemini 2.0 Flash</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between shrink-0 px-5">
          <span className="text-xs text-[var(--text-muted)] font-mono">AhadNova AI Engine</span>
          <span className="badge-pill badge-indigo">
            v1.0.0 Production
          </span>
        </div>
      </div>
    </div>
  );
}
