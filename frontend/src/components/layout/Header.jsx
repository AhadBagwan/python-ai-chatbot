import React, { useState } from "react";
import { Menu, Settings, ShieldAlert, Wrench, Award, Info, Palette, Sun, Moon } from "lucide-react";
import SettingsModal from "../modals/SettingsModal";
import SecurityAuditModal from "../modals/SecurityAuditModal";
import CyberUtilsModal from "../modals/CyberUtilsModal";
import QuizHubModal from "../modals/QuizHubModal";
import AboutModal from "../modals/AboutModal";
import useSettingsStore from "../../stores/settingsStore";
import useThemeStore, { THEME_PRESETS } from "../../stores/themeStore";
import useChatStore from "../../stores/chatStore";

export default function Header({ onMenuClick }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showUtilsModal, setShowUtilsModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const { model, explanationMode, setModel, theme, toggleTheme } = useSettingsStore();
  const { themePreset, setThemePreset } = useThemeStore();
  const { getActiveChat } = useChatStore();

  const activeChat = getActiveChat();
  const title = activeChat?.title || "New Conversation";

  return (
    <>
      <header className="h-[56px] px-4 sm:px-6 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] shrink-0 transition-colors">
        {/* Left - Menu Toggle & Active Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Toggle Sidebar"
            title="Toggle Sidebar Navigation"
            className="btn-pill-base btn-pill-icon lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-[320px]">
              {title}
            </span>
          </div>
        </div>

        {/* Right - Unified Top Navigation Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Model Selector Pill */}
          <div className="btn-pill-base btn-pill-secondary !px-2.5">
            <span className="w-2 h-2 rounded-full bg-[#6366f1] shrink-0" />
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent text-xs text-[var(--text-primary)] font-medium focus:outline-none cursor-pointer pr-0.5"
              title="Select AI Model Engine"
            >
              <option value="gemini-2.0-flash" className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">Gemini 2.0 Flash</option>
              <option value="gemini-1.5-pro" className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">Gemini 1.5 Pro</option>
              <option value="gemini-1.5-flash" className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">Gemini 1.5 Flash</option>
            </select>
            <span className="text-[10px] font-mono font-semibold uppercase text-[#818cf8] bg-[#6366f1]/15 px-1.5 py-0.5 rounded-full hidden sm:inline ml-0.5">
              {explanationMode}
            </span>
          </div>

          {/* Secondary Action: Quiz Hub */}
          <button
            onClick={() => setShowQuizModal(true)}
            className="btn-pill-base btn-pill-secondary hidden lg:inline-flex"
            title="Interactive Exam & Practice Quiz Hub"
          >
            <Award className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>Quiz Hub</span>
          </button>

          {/* Secondary Action: Cyber Tools */}
          <button
            onClick={() => setShowUtilsModal(true)}
            className="btn-pill-base btn-pill-secondary hidden lg:inline-flex"
            title="Open Network Subnet CIDR Calculator & JWT Decoder"
          >
            <Wrench className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Cyber Tools</span>
          </button>

          {/* Danger / Security Action: Security Audit */}
          <button
            onClick={() => setShowAuditModal(true)}
            className="btn-pill-base btn-pill-security"
            title="Scan code snippets for OWASP & CWE security vulnerabilities"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Security Audit</span>
          </button>

          {/* Dedicated Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Mode"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="btn-pill-base btn-pill-secondary !px-2.5 text-xs"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span className="hidden sm:inline text-xs">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#818cf8]" />
                <span className="hidden sm:inline text-xs">Dark</span>
              </>
            )}
          </button>

          {/* Multi-Theme Selector Pill */}
          <div className="btn-pill-base btn-pill-secondary hidden xl:inline-flex !px-2.5">
            <Palette className="w-3.5 h-3.5 text-[#818cf8]" />
            <select
              value={themePreset || "indigo"}
              onChange={(e) => setThemePreset(e.target.value)}
              className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer font-medium"
              title="Select Visual Theme Palette"
            >
              {THEME_PRESETS.map((t) => (
                <option key={t.id} value={t.id} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tertiary Icon Buttons: Information & Settings */}
          <button
            onClick={() => setShowAboutModal(true)}
            aria-label="About AhadNova AI"
            title="About AhadNova AI & Developer Profile"
            className="btn-pill-base btn-pill-icon"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSettings(true)}
            aria-label="Open Settings"
            title="Open Settings"
            className="btn-pill-base btn-pill-icon"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAuditModal && <SecurityAuditModal onClose={() => setShowAuditModal(false)} />}
      {showUtilsModal && <CyberUtilsModal onClose={() => setShowUtilsModal(false)} />}
      {showQuizModal && <QuizHubModal onClose={() => setShowQuizModal(false)} />}
      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
    </>
  );
}
