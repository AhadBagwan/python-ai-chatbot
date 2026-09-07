import React, { useState } from "react";
import { X, ShieldAlert, ShieldCheck, Bug, Check, Copy, Terminal, AlertTriangle, ArrowRight } from "lucide-react";
import { chatAPI } from "../../lib/api";
import toast from "react-hot-toast";

const LANGUAGES = [
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript / Node" },
  { id: "c", name: "C / C++" },
  { id: "sql", name: "SQL Queries" },
  { id: "dockerfile", name: "Dockerfile" },
  { id: "go", name: "Go (Golang)" },
  { id: "java", name: "Java" },
  { id: "php", name: "PHP" },
  { id: "bash", name: "Bash / Shell" },
];

const SEVERITY_BADGES = {
  CRITICAL: "badge-pill badge-rose",
  HIGH: "badge-pill badge-amber",
  MEDIUM: "badge-pill badge-sky",
  LOW: "badge-pill badge-indigo",
};

export default function SecurityAuditModal({ onClose }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [copiedPatch, setCopiedPatch] = useState(false);

  const handleAudit = async () => {
    if (!code.trim()) {
      toast.error("Please enter or paste code to audit.");
      return;
    }

    setIsAuditing(true);
    try {
      const data = await chatAPI.auditCode(code, language);
      setAuditResult(data);
      toast.success("Security audit complete!");
    } catch (err) {
      console.error(err);
      toast.error("Audit failed. Please try again.");
    } finally {
      setIsAuditing(false);
    }
  };

  const copyPatch = async () => {
    if (!auditResult?.patched_code) return;
    await navigator.clipboard.writeText(auditResult.patched_code);
    setCopiedPatch(true);
    toast.success("Patched code copied to clipboard!");
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  const getRiskScoreBadge = (score) => {
    if (score >= 70) return { label: "CRITICAL RISK", class: "badge-pill badge-rose" };
    if (score >= 40) return { label: "MODERATE RISK", class: "badge-pill badge-amber" };
    if (score > 0) return { label: "LOW RISK", class: "badge-pill badge-sky" };
    return { label: "SECURE PASS", class: "badge-pill badge-emerald" };
  };

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="modal-box max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center text-[#f87171]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
                <span>Source Code Security Auditor</span>
                <span className="badge-pill badge-rose">
                  SAST Engine
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">Scan code snippets for OWASP Top 10 vulnerabilities, CWE bugs, and unsafe patterns</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-pill-base btn-pill-icon"
            title="Close Security Auditor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Input Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#f87171]" />
                <span>Source Code Snippet to Analyze:</span>
              </label>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="select-field !w-auto !py-1 !px-2.5 !text-xs"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">{l.name}</option>
                ))}
              </select>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste code snippet here (e.g. SQL query execution, HTTP request handling, JWT verification...)"
              rows={6}
              className="input-field !font-mono !text-xs leading-relaxed resize-none"
            />

            <button
              onClick={handleAudit}
              disabled={isAuditing || !code.trim()}
              className="btn-pill-base btn-pill-security w-full !h-10 text-xs font-semibold"
            >
              {isAuditing ? (
                <>
                  <Bug className="w-4 h-4 animate-spin" />
                  <span>Scanning Code for Vulnerabilities & CWE Risks...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute Static Code Security Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Audit Results View */}
          {auditResult && (
            <div className="space-y-4 pt-3 border-t border-[var(--border-subtle)]">
              {/* Executive Summary & Score Bar */}
              <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Audit Executive Summary</span>
                    <span className={getRiskScoreBadge(auditResult.risk_score).class}>
                      {getRiskScoreBadge(auditResult.risk_score).label}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {auditResult.summary}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-[#f87171] font-mono">{auditResult.risk_score}/100</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono uppercase">Risk Metric</div>
                </div>
              </div>

              {/* Discovered Vulnerabilities List */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Discovered Vulnerabilities ({auditResult.vulnerabilities.length})</span>
                </h3>

                {auditResult.vulnerabilities.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/25 text-center text-xs text-[#34d399] font-medium">
                    No critical security vulnerabilities detected in this code snippet!
                  </div>
                ) : (
                  auditResult.vulnerabilities.map((vuln, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--text-primary)]">{vuln.title}</span>
                          <span className="badge-pill badge-indigo font-mono">
                            {vuln.cwe}
                          </span>
                          {vuln.line_number && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                              Line {vuln.line_number}
                            </span>
                          )}
                        </div>
                        <span className={SEVERITY_BADGES[vuln.severity] || SEVERITY_BADGES.MEDIUM}>
                          {vuln.severity}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{vuln.description}</p>
                      
                      <div className="pt-2 border-t border-[var(--border-subtle)] text-xs text-[#34d399] font-medium flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span><strong>Remediation:</strong> {vuln.remediation}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Remediated Patched Code */}
              {auditResult.patched_code && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#34d399] uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Remediated Secure Code Patch</span>
                    </h3>

                    <button
                      onClick={copyPatch}
                      className="btn-pill-base btn-pill-secondary !h-7 !px-2.5 !text-[11px]"
                    >
                      {copiedPatch ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3 text-[var(--text-muted)]" />}
                      <span>{copiedPatch ? "Copied!" : "Copy Patched Code"}</span>
                    </button>
                  </div>

                  <pre className="p-3.5 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-medium)] text-xs font-mono text-[var(--text-primary)] overflow-x-auto">
                    <code>{auditResult.patched_code}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between shrink-0 px-5">
          <span className="text-xs text-[var(--text-muted)] font-mono">SAST Security Engine</span>
          <span className="badge-pill badge-rose">
            SAST v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
