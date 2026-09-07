import React, { useState } from "react";
import { X, Wrench, Wifi, Key, Calculator } from "lucide-react";
import toast from "react-hot-toast";

export default function CyberUtilsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("cidr");

  // Subnet Calc State
  const [ip, setIp] = useState("192.168.1.1");
  const [cidr, setCidr] = useState("24");
  const [subnetResult, setSubnetResult] = useState(null);

  // JWT Decoder State
  const [jwtInput, setJwtInput] = useState("");
  const [jwtDecoded, setJwtDecoded] = useState(null);

  // Subnet Calculation Logic
  const calculateSubnet = () => {
    try {
      const parts = ip.split(".").map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        toast.error("Invalid IP Address format");
        return;
      }
      const maskBits = parseInt(cidr, 10);
      if (isNaN(maskBits) || maskBits < 0 || maskBits > 32) {
        toast.error("CIDR must be between 0 and 32");
        return;
      }

      const totalHosts = Math.pow(2, 32 - maskBits);
      const usableHosts = maskBits >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

      const maskNum = (0xffffffff << (32 - maskBits)) >>> 0;
      const maskStr = [
        (maskNum >>> 24) & 255,
        (maskNum >>> 16) & 255,
        (maskNum >>> 8) & 255,
        maskNum & 255,
      ].join(".");

      setSubnetResult({
        ip,
        cidr: `/${maskBits}`,
        subnetMask: maskStr,
        totalHosts: totalHosts.toLocaleString(),
        usableHosts: usableHosts.toLocaleString(),
      });
      toast.success("Subnet calculated!");
    } catch {
      toast.error("Error calculating subnet");
    }
  };

  // JWT Decode Logic
  const decodeJwt = () => {
    if (!jwtInput.trim()) return;
    try {
      const parts = jwtInput.split(".");
      if (parts.length !== 3) {
        toast.error("Invalid JWT structure (must have 3 dot-separated parts)");
        return;
      }
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      setJwtDecoded({ header, payload, signature: parts[2].slice(0, 20) + "..." });
      toast.success("JWT decoded safely!");
    } catch {
      toast.error("Failed to decode JWT payload");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Network & Cyber Utility Suite</h2>
              <p className="text-xs text-[var(--text-secondary)]">Client-side tools for Subnetting, CIDR calculations & JWT token analysis</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-pill-base btn-pill-icon"
            title="Close Cyber Tools"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-app)] shrink-0">
          <button
            onClick={() => setActiveTab("cidr")}
            className={`btn-pill-base ${
              activeTab === "cidr"
                ? "btn-pill-primary"
                : "btn-pill-secondary"
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>CIDR Subnet Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab("jwt")}
            className={`btn-pill-base ${
              activeTab === "jwt"
                ? "btn-pill-primary"
                : "btn-pill-secondary"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>JWT Token Inspector</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: CIDR Calculator */}
          {activeTab === "cidr" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">IPv4 Address:</label>
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="192.168.1.1"
                    className="input-field !font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">CIDR Prefix (/):</label>
                  <input
                    type="number"
                    value={cidr}
                    onChange={(e) => setCidr(e.target.value)}
                    placeholder="24"
                    min="0"
                    max="32"
                    className="input-field !font-mono text-xs"
                  />
                </div>
              </div>

              <button
                onClick={calculateSubnet}
                className="btn-pill-base btn-pill-primary w-full !h-10 text-xs font-semibold"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Subnet & Host Bounds</span>
              </button>

              {subnetResult && (
                <div className="p-4 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">Target IP / Prefix:</span>
                    <span className="text-[#38bdf8] font-bold">{subnetResult.ip} {subnetResult.cidr}</span>
                  </div>

                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">Subnet Mask:</span>
                    <span className="text-[var(--text-primary)] font-bold">{subnetResult.subnetMask}</span>
                  </div>

                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">Total IP Pool:</span>
                    <span className="text-[var(--text-primary)] font-bold">{subnetResult.totalHosts} IPs</span>
                  </div>

                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">Usable Host Addresses:</span>
                    <span className="text-[#34d399] font-bold">{subnetResult.usableHosts} Usable</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JWT Decoder */}
          {activeTab === "jwt" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Encoded JWT String:</label>
                <textarea
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  placeholder="Paste encoded JWT token (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                  rows={4}
                  className="input-field !font-mono text-xs leading-relaxed resize-none"
                />
              </div>

              <button
                onClick={decodeJwt}
                className="btn-pill-base btn-pill-primary w-full !h-10 text-xs font-semibold"
              >
                <Key className="w-4 h-4" />
                <span>Decode JWT Payload Offline</span>
              </button>

              {jwtDecoded && (
                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#38bdf8]">Decoded Header:</span>
                    <pre className="p-3 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-medium)] text-[11px] font-mono text-[#38bdf8] overflow-x-auto">
                      {JSON.stringify(jwtDecoded.header, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#34d399]">Decoded Payload Claims:</span>
                    <pre className="p-3 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-medium)] text-[11px] font-mono text-[#34d399] overflow-x-auto">
                      {JSON.stringify(jwtDecoded.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between shrink-0 px-5">
          <span className="text-xs text-[var(--text-muted)] font-mono">Client-Side Utilities</span>
          <span className="badge-pill badge-sky">
            Offline & Safe
          </span>
        </div>
      </div>
    </div>
  );
}
