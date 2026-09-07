import React, { useState, useEffect } from "react";
import { X, Moon, Sun, Volume2, VolumeX, Trash2, Sparkles, Cpu, Sliders, CheckCircle2, Shield, Brain, Palette } from "lucide-react";
import useSettingsStore from "../../stores/settingsStore";
import useThemeStore, { THEME_PRESETS } from "../../stores/themeStore";
import useChatStore from "../../stores/chatStore";
import { MODELS, EXPLANATION_MODES } from "../../lib/constants";
import toast from "react-hot-toast";

const MODE_ICON_MAP = {
  Brain,
  Sparkles,
  Shield,
};

export default function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("models");
  const [voices, setVoices] = useState([]);

  const { 
    theme, 
    toggleTheme, 
    soundEnabled, 
    toggleSound, 
    model, 
    setModel, 
    explanationMode, 
    setExplanationMode,
    selectedVoice,
    setSelectedVoice
  } = useSettingsStore();
  const { themePreset, setThemePreset } = useThemeStore();
  const { clearAllChats } = useChatStore();

  useEffect(() => {
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        const avail = window.speechSynthesis.getVoices();
        if (avail.length > 0) setVoices(avail);
      }
    };
    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm("Clear all conversation history? This action cannot be undone.")) {
      clearAllChats();
      toast.success("All chat history cleared");
    }
  };

  return (
    <div className="modal-overlay">
      {/* Backdrop click handler */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Preferences & Control</h2>
              <p className="text-xs text-[#a1a1aa]">Configure AI models, explanation style, voice engines, and system settings</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-pill-base btn-pill-icon"
            title="Close Preferences"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-app)] shrink-0">
          <button
            onClick={() => setActiveTab("models")}
            className={`btn-pill-base ${
              activeTab === "models"
                ? "btn-pill-primary"
                : "btn-pill-secondary"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Model Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("modes")}
            className={`btn-pill-base ${
              activeTab === "modes"
                ? "btn-pill-primary"
                : "btn-pill-secondary"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Explanation Mode</span>
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`btn-pill-base ${
              activeTab === "system"
                ? "btn-pill-primary"
                : "btn-pill-secondary"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>System Preferences</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: AI Model Engine Cards */}
          {activeTab === "models" && (
            <div className="space-y-2.5">
              <p className="text-xs text-[#a1a1aa] mb-1 font-medium">Select active intelligence model for chat queries:</p>
              {MODELS.map((m) => {
                const isSelected = model === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={`
                      p-3.5 rounded-xl cursor-pointer transition-all border flex items-start gap-3
                      ${isSelected
                        ? "bg-[#6366f1]/10 border-[#6366f1]/50 shadow-xs"
                        : "bg-[var(--bg-app)] border-[var(--border-subtle)] hover:bg-[var(--bg-hover)]"
                      }
                    `}
                  >
                    <div className="pt-0.5">
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#818cf8]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.2)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-xs font-bold text-[var(--text-primary)]">{m.name}</h3>
                        <span className="badge-pill badge-indigo">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">
                        {m.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Explanation Mode Selector Cards */}
          {activeTab === "modes" && (
            <div className="space-y-2.5">
              <p className="text-xs text-[#a1a1aa] mb-1 font-medium">Choose how technical answers are structured:</p>
              {EXPLANATION_MODES.map((modeItem) => {
                const isSelected = explanationMode === modeItem.id;
                const ModeIcon = MODE_ICON_MAP[modeItem.icon] || Brain;
                return (
                  <div
                    key={modeItem.id}
                    onClick={() => setExplanationMode(modeItem.id)}
                    className={`
                      p-3.5 rounded-xl cursor-pointer transition-all border flex items-start gap-3
                      ${isSelected
                        ? "bg-[#6366f1]/10 border-[#6366f1]/50 shadow-xs"
                        : "bg-[var(--bg-app)] border-[var(--border-subtle)] hover:bg-[var(--bg-hover)]"
                      }
                    `}
                  >
                    <div className="pt-0.5">
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#818cf8]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.2)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <ModeIcon className="w-3.5 h-3.5 text-[#818cf8]" />
                        <h3 className="text-xs font-bold text-[var(--text-primary)]">{modeItem.name}</h3>
                        <span className="badge-pill badge-sky">
                          {modeItem.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#a1a1aa] leading-relaxed font-normal">
                        {modeItem.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: System Preferences */}
          {activeTab === "system" && (
            <div className="space-y-3">
              {/* Theme Mode Toggle Card */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? <Moon className="w-4 h-4 text-[#818cf8]" /> : <Sun className="w-4 h-4 text-[#fbbf24]" />}
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">Theme Mode</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">Toggle between Dark & Light visual modes</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${theme === "dark" ? "bg-[#6366f1]" : "bg-[#3f3f46]"}`}
                  title="Toggle Light / Dark Mode"
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-5" : ""}`} />
                </button>
              </div>

              {/* Theme Palette Presets Grid */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#818cf8]" />
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">Theme Color Palette (Applies to Light & Dark)</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">Select visual aesthetic preset for the application</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {THEME_PRESETS.map((t) => {
                    const isSelected = (themePreset || "indigo") === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setThemePreset(t.id)}
                        className={`
                          p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2
                          ${isSelected
                            ? "bg-[#6366f1]/15 border-[#6366f1] shadow-xs"
                            : "bg-[var(--bg-sidebar)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: t.accentColor }}
                          />
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#818cf8]" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">{t.name}</p>
                          <span className="text-[9px] text-[var(--text-muted)] font-mono">{t.badge}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TTS Voice Selection Card */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#818cf8]" />
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Text-to-Speech Voice Engine</p>
                      <p className="text-[11px] text-[#71717a]">Choose audio synthesis voice for speech playback</p>
                    </div>
                  </div>
                </div>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="select-field !text-xs font-medium"
                >
                  <option value="" className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">Default System Voice</option>
                  {voices.map((v) => (
                    <option key={v.voiceURI || v.name} value={v.voiceURI || v.name} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sound Toggle Card */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#34d399]" /> : <VolumeX className="w-4 h-4 text-[#71717a]" />}
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">Audio Sound Feedback</p>
                    <p className="text-[11px] text-[#a1a1aa]">Enable keypress audio effects</p>
                  </div>
                </div>
                <button
                  onClick={toggleSound}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${soundEnabled ? "bg-[#10b981]" : "bg-[#3f3f46]"}`}
                  title="Toggle Sound Effects"
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? "translate-x-5" : ""}`} />
                </button>
              </div>

              {/* Developer Profile Links */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-app)] border border-[var(--border-subtle)] space-y-2">
                <p className="text-[11px] font-mono font-semibold text-[#71717a] uppercase tracking-wider">Developer Links</p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.linkedin.com/in/ahadbagwan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-base btn-pill-secondary flex-1"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://ahadbagwan.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-base btn-pill-secondary flex-1"
                  >
                    Portfolio
                  </a>
                  <a
                    href="https://github.com/AhadBagwan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-base btn-pill-secondary flex-1"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              {/* Clear History Danger Action */}
              <div className="pt-1">
                <button
                  onClick={handleClearHistory}
                  className="btn-pill-base btn-pill-security w-full !h-9"
                  title="Purge all chat conversation history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge All Conversation History</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between shrink-0 px-5">
          <span className="text-xs text-[#71717a] font-mono">AhadNova AI Platform</span>
          <span className="badge-pill badge-indigo">
            v1.0.0 Stable
          </span>
        </div>
      </div>
    </div>
  );
}
