// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0E0E11",
        neon: {
          green: "#00FF66",
          bright: "#22C55E",
          glow: "rgba(0, 255, 102, 0.35)",
        },
        borderMuted: "rgba(255, 255, 255, 0.08)",
      },
      boxShadow: {
        "neon-glow": "0 0 25px rgba(0, 255, 102, 0.4)",
        "neon-card": "0 0 15px rgba(0, 255, 102, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
