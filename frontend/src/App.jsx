import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import ChatWindow from "./components/chat/ChatWindow";
import useSettingsStore from "./stores/settingsStore";
import useThemeStore from "./stores/themeStore";
import "./index.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useSettingsStore();
  const { themePreset } = useThemeStore();

  useEffect(() => {
    // Mode class (dark vs light)
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }

    // Dynamic Theme Preset attribute
    document.documentElement.setAttribute("data-theme-preset", themePreset || "indigo");
  }, [theme, themePreset]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="app-container">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className="main-content">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="chat-area">
            <ChatWindow />
          </main>
        </div>

        {/* Unified Design System Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--bg-sidebar)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-medium)",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 500,
              padding: "8px 16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            },
          }}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;
