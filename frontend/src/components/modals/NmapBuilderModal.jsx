import React, { useState } from "react";
import { X, Terminal, Copy, Check, Shield, Zap, Info } from "lucide-react";
import { chatAPI } from "../../lib/api";
import toast from "react-hot-toast";

const SCAN_PROFILES = [
  { id: "stealth", name: "TCP SYN Stealth Scan (-sS)", desc: "Half-open stealth scan without completing TCP handshakes" },
  { id: "version", name: "Service Versioning (-sV)", desc: "Inspect open ports to determine exact application versions" },
  { id: "intense", name: "Intense OS & Script Scan (-A)", desc: "Aggressive OS fingerprinting, traceroute & default NSE scripts" },
  { id: "udp", name: "UDP Service Scan (-sU)", desc: "Discover open UDP services (DNS, SNMP, NTP, DHCP)" },
  { id: "vuln", name: "Vulnerability Scan (--script=vuln)", desc: "Run Nmap Scripting Engine (NSE) vulnerability detection scripts" },
];

export default function NmapBuilderModal({ onClose }) {
  const [target, setTarget] = useState("192.168.1.1");
  const [scanType, setScanType] = useState("stealth");
  const [customPorts, setCustomPorts] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [nmapResult, setNmapResult] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const handleGenerate = async () => {
    if (!target.trim()) {
      toast.error("Please enter a target IP, CIDR subnet, or hostname.");
      return;
    }

    setIsGenerating(true);
    try {
      const data = await chatAPI.generateNmap(target, scanType, customPorts);
      setNmapResult(data);
      toast.success("Nmap command generated!");
    } catch (err) {
      console.error(err);
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCommand = async () => {
    if (!nmapResult?.command) return;
    await navigator.clipboard.writeText(nmapResult.command);
    setCopiedCmd(true);
    toast.success("Nmap command copied to clipboard!");
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Nmap & Network Command Builder</h2>
              <p className="text-xs text-[var(--text-secondary)]">Interactive syntax generator with flag breakdown and NSE script explanations</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-pill-base btn-pill-icon"
            title="Close Nmap Builder"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Target (IP / Subnet / Domain):</label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="192.168.1.1 or 10.0.0.0/24"
                  className="input-field !font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Custom Ports (Optional):</label>
                <input
                  type="text"
                  value={customPorts}
                  onChange={(e) => setCustomPorts(e.target.value)}
                  placeholder="80,443,8080 or 1-65535"
                  className="input-field !font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Scan Profile:</label>
              <select
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                className="select-field text-xs"
              >
                {SCAN_PROFILES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
                    {p.name} - {p.desc}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !target.trim()}
              className="btn-pill-base btn-pill-primary w-full !h-10 text-xs font-semibold"
            >
              {isGenerating ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Building Nmap Command Syntax...</span>
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4" />
                  <span>Generate Nmap Command & Flag Breakdown</span>
                </>
              )}
            </button>
          </div>

          {/* Results View */}
          {nmapResult && (
            <div className="space-y-4 pt-3 border-t border-[var(--border-subtle)]">
              {/* Command Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Generated Syntax</span>
                  <button
                    onClick={copyCommand}
                    className="btn-pill-base btn-pill-secondary !h-7 !px-2.5 !text-[11px]"
                  >
                    {copiedCmd ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3 text-[var(--text-muted)]" />}
                    <span>{copiedCmd ? "Copied!" : "Copy Command"}</span>
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-medium)] text-xs font-mono text-[#818cf8] overflow-x-auto font-bold">
                  <code>{nmapResult.command}</code>
                </pre>
              </div>

              {/* Explanation */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-1.5">
                <p className="text-xs text-[var(--text-primary)] font-medium">{nmapResult.explanation}</p>
              </div>

              {/* Flag Breakdown */}
              {nmapResult.breakdown?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Command Flag Breakdown</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {nmapResult.breakdown.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-start gap-2">
                        <span className="text-[#818cf8] font-mono font-bold text-xs shrink-0">{item.flag}</span>
                        <span className="text-[var(--text-secondary)] text-[11px]">{item.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Note */}
              <div className="p-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/25 flex items-start gap-2 text-xs text-[#fbbf24]">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{nmapResult.safety_note}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between shrink-0 px-5">
          <span className="text-xs text-[var(--text-muted)] font-mono">Network Utility Engine</span>
          <span className="badge-pill badge-indigo">
            Nmap v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
