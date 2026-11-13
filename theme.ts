export const colors = {
  primary: '#5b8cff',
  primaryDark: '#254db3',
  primaryBorder: '#7aa2ff',
  background: '#0b1020',
  backgroundCard: '#111a2f',
  backgroundSoft: '#0d1527',
  backgroundPill: '#162544',
  backgroundSelected: '#101d35',
  text: '#f5f7ff',
  textInverse: '#ffffff',
  textSecondary: '#dfe8ff',
  textSoft: '#b7c5e6',
  textMuted: '#9bb3d9',
  placeholder: '#8fa4c7',
  border: '#203257',
  borderInput: '#2a3d61',
  borderStudent: '#263d68',
  borderSelected: '#88a9ff',
  successBackground: '#123d2e',
  success: '#8ce6bf',
  warningBackground: '#3b3419',
  warning: '#ffda7a',
  dangerBackground: '#3b1d1d',
  danger: '#ff9a9a',
  info: '#8ab4ff',
  weatherHero: '#101f3b',
  weatherBorder: '#304f80',
  weatherMetric: '#0c172c',
};

export type ThemeColors = typeof colors;
export const lightColors: ThemeColors = {
  ...colors,
  primary: '#315fd4', primaryBorder: '#6d92e7',
  background: '#f1f5fc', backgroundCard: '#ffffff', backgroundSoft: '#f6f8fd',
  backgroundPill: '#e5edff', backgroundSelected: '#edf3ff',
  text: '#182844', textSecondary: '#263b5c', textSoft: '#455b7a', textMuted: '#526783',
  placeholder: '#627796', border: '#d6dfef', borderInput: '#bacbe2', borderStudent: '#c2d1e8', borderSelected: '#315fd4',
  successBackground: '#e0f4ea', success: '#166344', warningBackground: '#fff1cb', warning: '#805700',
  dangerBackground: '#fde9e9', danger: '#a52b36', info: '#254db3',
  weatherHero: '#e9f0ff', weatherBorder: '#b9cbea', weatherMetric: '#ffffff',
};

export const spacing = {
  xs: 4,
  compact: 6,
  sm: 8,
  control: 10,
  mdCompact: 12,
  input: 14,
  md: 16,
  card: 18,
  lg: 24,
  xl: 32,
  bottom: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export default {
  colors,
  spacing,
  radius,
};
