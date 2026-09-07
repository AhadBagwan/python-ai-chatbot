import { create } from "zustand";
import { persist } from "zustand/middleware";

export const THEME_PRESETS = [
  {
    id: "indigo",
    name: "Claude Indigo",
    accentColor: "#6366f1",
    badge: "Default",
    description: "Refined dark indigo & calm warm light workspace",
  },
  {
    id: "emerald",
    name: "Cyber Matrix",
    accentColor: "#10b981",
    badge: "Cyber",
    description: "Matrix neon green & soft mint security theme",
  },
  {
    id: "nord",
    name: "Nordic Frost",
    accentColor: "#38bdf8",
    badge: "Cool",
    description: "Arctic navy slate & ice blue developer theme",
  },
  {
    id: "amber",
    name: "Solarized Warm",
    accentColor: "#f59e0b",
    badge: "Warm",
    description: "Deep coffee amber & warm cream reading theme",
  },
  {
    id: "rose",
    name: "Neon Synthwave",
    accentColor: "#f43f5e",
    badge: "Vibrant",
    description: "High-contrast magenta rose & soft pink quartz",
  },
  {
    id: "oled",
    name: "Midnight OLED",
    accentColor: "#a855f7",
    badge: "Pure Black",
    description: "Pitch black true OLED & clean studio white",
  },
  {
    id: "violet",
    name: "Amethyst Purple",
    accentColor: "#8b5cf6",
    badge: "Royal",
    description: "Deep amethyst obsidian & soft lavender lilac",
  },
  {
    id: "monochrome",
    name: "Vercel Mono",
    accentColor: "#e4e4e7",
    badge: "Minimal",
    description: "Pure monochrome slate & minimalist light",
  },
];

// Deprecated fallback object map for compatibility
export const CHAT_THEMES = THEME_PRESETS.reduce((acc, t) => {
  acc[t.id.toUpperCase()] = {
    id: t.id,
    name: t.name,
    accentColor: t.accentColor,
  };
  return acc;
}, {});

const useThemeStore = create(
  persist(
    (set) => ({
      themePreset: "indigo",
      setThemePreset: (presetId) => set({ themePreset: presetId }),
      // Backwards compatibility alias
      outputTheme: "indigo",
      setOutputTheme: (presetId) => set({ themePreset: presetId, outputTheme: presetId }),
    }),
    {
      name: "ahadnova-theme-preset-store",
    }
  )
);

export default useThemeStore;
