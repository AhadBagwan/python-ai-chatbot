import React from "react";
import { X, BookOpen, ArrowUpRight, Shield, Cpu, Server, Network } from "lucide-react";

const PROMPT_CATEGORIES = [
  {
    category: "Security & Threat Modeling",
    icon: Shield,
    badge: "badge-rose",
    prompts: [
      {
        title: "Zero Trust Network Architecture RFC",
        prompt: "Design a comprehensive Zero Trust Network Architecture (ZTNA) for an enterprise with hybrid multi-cloud infrastructure. Include identity verification, micro-segmentation, and continuous risk monitoring.",
      },
      {
        title: "OWASP Top 10 API Security Checklist",
        prompt: "Provide an OWASP Top 10 API Security compliance checklist for a production REST & GraphQL microservices stack. Detail prevention for Broken Object Level Authorization (BOLA).",
      },
    ],
  },
  {
    category: "Software & System Architecture",
    icon: Cpu,
    badge: "badge-indigo",
    prompts: [
      {
        title: "High-Availability Distributed System RFC",
        prompt: "Design a high-throughput, low-latency distributed event streaming architecture handling 50,000 requests/sec. Compare Kafka vs RabbitMQ with partition fault tolerance.",
      },
      {
        title: "Zero-Downtime Database Migration Plan",
        prompt: "Write a step-by-step zero-downtime database migration plan from PostgreSQL to a distributed SQL cluster using the Expand-Contract (Parallel Write) pattern.",
      },
    ],
  },
  {
    category: "DevOps & Cloud Infrastructure",
    icon: Server,
    badge: "badge-sky",
    prompts: [
      {
        title: "Production Kubernetes Ingress & TLS Setup",
        prompt: "Provide a production-ready Kubernetes Ingress manifest with Cert-Manager TLS termination, rate-limiting annotations, and Nginx reverse proxy hardening.",
      },
      {
        title: "Terraform Multi-Region AWS VPC Module",
        prompt: "Write a modular Terraform configuration to provision a multi-region AWS VPC with public/private subnets, NAT Gateways, Transit Gateway, and VPC Flow Logs.",
      },
    ],
  },
  {
    category: "Network Engineering & Protocols",
    icon: Network,
    badge: "badge-emerald",
    prompts: [
      {
        title: "BGP Route Leak Troubleshooting Guide",
        prompt: "Explain how to diagnose and mitigate BGP route leaks and prefix hijacking using RPKI, BGPsec, and route filtering policies.",
      },
      {
        title: "TLS 1.2 vs TLS 1.3 Deep Dive",
        prompt: "Compare TLS 1.2 vs TLS 1.3 handshake mechanics, 0-RTT resumption security trade-offs, and supported cipher suites.",
      },
    ],
  },
];

export default function PromptLibraryModal({ onClose, onSelectPrompt }) {
  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="modal-box max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Engineering Prompt Template Library</h2>
              <p className="text-xs text-[var(--text-secondary)]">Pre-built, expert-level prompt templates for System Architecture, Security & DevOps</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-pill-base btn-pill-icon"
            title="Close Prompt Library"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {PROMPT_CATEGORIES.map((cat, cIdx) => {
            const Icon = cat.icon;
            return (
              <div key={cIdx} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#818cf8]" />
                  <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">{cat.category}</h3>
                  <span className={`badge-pill ${cat.badge}`}>
                    {cat.prompts.length} Templates
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cat.prompts.map((item, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => {
                        onSelectPrompt(item.prompt);
                        onClose();
                      }}
                      className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--accent-indigo)] hover:bg-[var(--bg-hover)] cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#818cf8] transition-colors">{item.title}</h4>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[#818cf8] transition-colors" />
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-normal">
                        {item.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between shrink-0 px-5">
          <span className="text-xs text-[var(--text-muted)] font-mono">Prompt Engineering Library</span>
          <span className="badge-pill badge-indigo">
            AhadNova Presets
          </span>
        </div>
      </div>
    </div>
  );
}
