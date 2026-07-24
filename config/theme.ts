import colors from '../content/colors.json';

export const theme = {
  colors,
  fonts: {
    display: 'var(--font-display)',
    body: 'var(--font-body)',
    mono: 'var(--font-mono)',
  },
};

export type Theme = typeof theme;
