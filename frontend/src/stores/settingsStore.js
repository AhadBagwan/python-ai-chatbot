import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const newTheme = get().theme === "dark" ? "light" : "dark";
        set({ theme: newTheme });
      },

      // Model selection
      model: "gemini-2.0-flash",
      setModel: (model) => set({ model }),

      // Explanation mode
      explanationMode: "normal",
      setExplanationMode: (mode) => set({ explanationMode: mode }),

      // Sound
      soundEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      // TTS Voice Selection
      selectedVoice: "",
      setSelectedVoice: (voiceURI) => set({ selectedVoice: voiceURI }),

      // Auto scroll
      autoScroll: true,
      setAutoScroll: (enabled) => set({ autoScroll: enabled }),
      toggleAutoScroll: () => set((state) => ({ autoScroll: !state.autoScroll })),

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "ahadnova-settings",
      partialize: (state) => ({
        theme: state.theme,
        model: state.model,
        explanationMode: state.explanationMode,
        soundEnabled: state.soundEnabled,
        selectedVoice: state.selectedVoice,
        autoScroll: state.autoScroll,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

export default useSettingsStore;
