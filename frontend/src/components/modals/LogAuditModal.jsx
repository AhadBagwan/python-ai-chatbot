import React, { useState } from "react";
import { X, FileText, AlertTriangle, ShieldAlert, Terminal, Check, Copy, Activity } from "lucide-react";
import { chatAPI } from "../../lib/api";
import toast from "react-hot-toast";

const LOG_TYPES = [
  { id: "syslog", name: "Linux Syslog / auth.log" },
  { id: "nginx", name: "Nginx Access / Error Log" },
  { id: "apache", name: "Apache HTTP Server Log" },
  { id: "firewall", name: "iptables / UFW Firewall Log" },
];

const SEVERITY_BADGES = {
  CRITICAL: "badge-pill badge-rose",
  HIGH: "badge-pill badge-amber",
  MEDIUM: "badge-pill badge-sky",
  LOW: "badge-pill badge-indigo",
};

export default function LogAuditModal({ onClose }) {
  const [logContent, setLogContent] = useState("");
  const [logType, setLogType] = useState("syslog");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const handleAnalyze = async () => {
    if (!logContent.trim()) {
      toast.error("Please enter or paste log data to analyze.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await chatAPI.analyzeLog(logContent, logType);
      setAuditResult(data);
      toast.success("Log intrusion analysis complete!");
    } catch (err) {
      console.error(err);
      toast.error("Log analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="modal-box max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Log & Intrusion Detection Analyzer</h2>
              <p className="text-xs text-[var(--text-secondary)]">SIEM log analysis for brute-force attacks, SQL injection attempts, and rate anomalies</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-pill-base btn-pill-icon"
            title="Close Log Analyzer"
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
                <Terminal className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>Log Output Data:</span>
              </label>

              <select
                value={logType}
                onChange={(e) => setLogType(e.target.value)}
                className="select-field !w-auto !py-1 !px-2.5 !text-xs"
              >
                {LOG_TYPES.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">{t.name}</option>
                ))}
              </select>
            </div>

            <textarea
              value={logContent}
              onChange={(e) => setLogContent(e.target.value)}
              placeholder="Paste log output here (e.g. Failed password for root from 192.168.1.100 port 45220 ssh2...)"
              rows={6}
              className="input-field !font-mono !text-xs leading-relaxed resize-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !logContent.trim()}
              className="btn-pill-base btn-pill-primary w-full !h-10 text-xs font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Analyzing Log Patterns & Threat Indicators...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Execute SIEM Log Intrusion Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Results View */}
          {auditResult && (
            <div className="space-y-4 pt-3 border-t border-[var(--border-subtle)]">
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">SIEM Threat Summary</span>
                    <span className={SEVERITY_BADGES[auditResult.threat_level] || SEVERITY_BADGES.MEDIUM}>
                      {auditResult.threat_level} THREAT
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {auditResult.summary}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-[#fbbf24] font-mono">{auditResult.threat_score}/100</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono uppercase">Threat Score</div>
                </div>
              </div>

              {/* Anomalies List */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Detected Threat Anomalies ({auditResult.anomalies.length})</span>
                </h3>

                {auditResult.anomalies.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/25 text-center text-xs text-[#34d399] font-medium">
                    No intrusion patterns or malicious log events detected.
                  </div>
                ) : (
                  auditResult.anomalies.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--text-primary)]">{item.type}</span>
                          {item.source_ip && (
                            <span className="badge-pill badge-indigo font-mono">
                              IP: {item.source_ip}
                            </span>
                          )}
                          {item.count && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                              Count: {item.count}
                            </span>
                          )}
                        </div>
                        <span className={SEVERITY_BADGES[item.severity] || SEVERITY_BADGES.MEDIUM}>
                          {item.severity}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.details}</p>
                      
                      <div className="pt-2 border-t border-[var(--border-subtle)] text-xs text-[#34d399] font-medium">
                        <strong>Remediation:</strong> {item.remediation}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Recommendations */}
              {auditResult.recommendations?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                  <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Hardening Recommendations</h4>
                  <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-1">
                    {auditResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between shrink-0 px-5">
          <span className="text-xs text-[var(--text-muted)] font-mono">SIEM Operations Center</span>
          <span className="badge-pill badge-amber">
            Log AI v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
