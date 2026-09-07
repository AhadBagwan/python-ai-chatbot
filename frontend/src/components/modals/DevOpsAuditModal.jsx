import React, { useState } from "react";
import { X, Box, ShieldCheck, Bug, Check, Copy, Terminal, AlertTriangle, ArrowRight } from "lucide-react";
import { chatAPI } from "../../lib/api";
import toast from "react-hot-toast";

const FILE_TYPES = [
  { id: "dockerfile", name: "Dockerfile Manifest" },
  { id: "k8s", name: "Kubernetes Deployment / Pod YAML" },
];

const SEVERITY_BADGES = {
  CRITICAL: "badge-pill badge-rose",
  HIGH: "badge-pill badge-amber",
  MEDIUM: "badge-pill badge-sky",
  LOW: "badge-pill badge-indigo",
};

export default function DevOpsAuditModal({ onClose }) {
  const [manifestContent, setManifestContent] = useState("");
  const [fileType, setFileType] = useState("dockerfile");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [copiedManifest, setCopiedManifest] = useState(false);

  const handleAudit = async () => {
    if (!manifestContent.trim()) {
      toast.error("Please enter or paste manifest content to audit.");
      return;
    }

    setIsAuditing(true);
    try {
      const data = await chatAPI.auditDevOps(manifestContent, fileType);
      setAuditResult(data);
      toast.success("DevSecOps container audit complete!");
    } catch (err) {
      console.error(err);
      toast.error("DevOps audit failed. Please try again.");
    } finally {
      setIsAuditing(false);
    }
  };

  const copyRemediated = async () => {
    if (!auditResult?.remediated_manifest) return;
    await navigator.clipboard.writeText(auditResult.remediated_manifest);
    setCopiedManifest(true);
    toast.success("Remediated manifest copied!");
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="modal-box max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Docker & Kubernetes Security Inspector</h2>
              <p className="text-xs text-[var(--text-secondary)]">DevSecOps manifest hardening for root execution, unpinned images & security contexts</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-pill-base btn-pill-icon"
            title="Close DevOps Auditor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Container Manifest Content:</span>
              </label>

              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="select-field !w-auto !py-1 !px-2.5 !text-xs"
              >
                {FILE_TYPES.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">{f.name}</option>
                ))}
              </select>
            </div>

            <textarea
              value={manifestContent}
              onChange={(e) => setManifestContent(e.target.value)}
              placeholder="Paste Dockerfile or Kubernetes YAML manifest here..."
              rows={6}
              className="input-field !font-mono !text-xs leading-relaxed resize-none"
            />

            <button
              onClick={handleAudit}
              disabled={isAuditing || !manifestContent.trim()}
              className="btn-pill-base btn-pill-primary w-full !h-10 text-xs font-semibold"
            >
              {isAuditing ? (
                <>
                  <Bug className="w-4 h-4 animate-spin" />
                  <span>Auditing Container Security & CIS Controls...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute DevSecOps Manifest Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Audit Results View */}
          {auditResult && (
            <div className="space-y-4 pt-3 border-t border-[var(--border-subtle)]">
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">DevSecOps Summary</span>
                    <span className="badge-pill badge-sky">
                      SCORE: {auditResult.compliance_score}/100
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {auditResult.summary}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-[#38bdf8] font-mono">{auditResult.compliance_score}%</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono uppercase">Compliance</div>
                </div>
              </div>

              {/* Security Issues List */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Identified Security Issues ({auditResult.security_issues.length})</span>
                </h3>

                {auditResult.security_issues.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/25 text-center text-xs text-[#34d399] font-medium">
                    No security flaws or misconfigurations detected in this manifest!
                  </div>
                ) : (
                  auditResult.security_issues.map((issue, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--text-primary)]">{issue.title}</span>
                          <span className="badge-pill badge-indigo font-mono">
                            {issue.cwe}
                          </span>
                        </div>
                        <span className={SEVERITY_BADGES[issue.severity] || SEVERITY_BADGES.MEDIUM}>
                          {issue.severity}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{issue.description}</p>
                      
                      <div className="pt-2 border-t border-[var(--border-subtle)] text-xs text-[#34d399] font-medium flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span><strong>Remediation:</strong> {issue.fix}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Remediated Code */}
              {auditResult.remediated_manifest && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#34d399] uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Hardened Remediated Manifest</span>
                    </h3>

                    <button
                      onClick={copyRemediated}
                      className="btn-pill-base btn-pill-secondary !h-7 !px-2.5 !text-[11px]"
                    >
                      {copiedManifest ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3 text-[var(--text-muted)]" />}
                      <span>{copiedManifest ? "Copied!" : "Copy Remediated Manifest"}</span>
                    </button>
                  </div>

                  <pre className="p-3.5 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-medium)] text-xs font-mono text-[var(--text-primary)] overflow-x-auto">
                    <code>{auditResult.remediated_manifest}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between shrink-0 px-5">
          <span className="text-xs text-[var(--text-muted)] font-mono">DevSecOps Engine</span>
          <span className="badge-pill badge-sky">
            CIS Hardened
          </span>
        </div>
      </div>
    </div>
  );
}
