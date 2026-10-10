import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-0)',
        secondary: 'var(--bg-2)',
        surface: 'var(--bg-1)',
        primary: 'rgb(75 255 46 / <alpha-value>)',
        primaryDark: 'var(--accent-dim)',
        accent: 'var(--accent)',
        text: 'var(--text-1)',
        textSecondary: 'var(--text-2)',
        muted: 'var(--text-3)',
        border: 'var(--line)',
        borderMuted: 'var(--line)',
        neon: {
          green: 'var(--accent)',
          bright: 'var(--lime-400)',
          glow: 'var(--accent-glow)',
        },
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
        pixel: 'var(--font-pixel)',
      },
      boxShadow: {
        'neon-glow': 'var(--glow-soft)',
        'neon-card': '0 0 0 1px rgb(75 255 46 / 0.12), 0 12px 32px -18px var(--accent-glow)',
      },
      maxWidth: {
        page: 'var(--container)',
      },
    },
  },
  plugins: [],
};

export default config;
