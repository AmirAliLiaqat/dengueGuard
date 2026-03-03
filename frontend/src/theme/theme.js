const BaseColors = {
  primary: '#00D2FF',      // Electric Blue
  secondary: '#3A7BD5',    // Deep Ocean
  accent: '#FF0072',       // Vibrant Pink
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

export const LightColors = {
  ...BaseColors,
  background: '#F8FAFC',   // Slate Light
  card: '#FFFFFF',         // White
  text: '#0F172A',         // Deep Slate
  textMuted: '#64748B',    // Muted Slate
  glass: 'rgba(0, 0, 0, 0.03)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
};

export const DarkColors = {
  ...BaseColors,
  background: '#0F172A',   // Slate Dark
  card: '#1E293B',         // Subtle Dark
  text: '#F8FAFC',         // Crisp White
  textMuted: '#94A3B8',    // Muted Slate
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

// This will be used as a fallback or default, but components will mostly use the context theme
export const Colors = DarkColors;

export const Typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: 'bold' },
  body: { fontSize: 16 },
  caption: { fontSize: 14 },
};

export const getTheme = (isDark) => {
  const colors = isDark ? DarkColors : LightColors;
  return {
    colors,
    spacing: Spacing,
    typography: {
      h1: { ...Typography.h1, color: colors.text },
      h2: { ...Typography.h2, color: colors.text },
      h3: { ...Typography.h3, color: colors.text },
      body: { ...Typography.body, color: colors.text },
      caption: { ...Typography.caption, color: colors.textMuted },
    },
    isDark
  };
};
