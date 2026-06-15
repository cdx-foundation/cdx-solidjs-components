export type ThemeFont =
  | 'sans'
  | 'mono'
  | 'display'
  | 'condensed'
  | 'system'
  | 'oxanium';

export type BaseColor =
  | 'zinc'
  | 'slate'
  | 'stone'
  | 'gray'
  | 'neutral';

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'neo' | 'flat' | 'hard';

export type Palette = { bg: string; panel: string; surface: string; border: string; fg: string; muted: string };

export const BASE_PALETTES: Record<BaseColor, { light: Palette; dark: Palette }> = {
  zinc: {
    light: { bg: '#ffffff', panel: '#ffffff', surface: '#f4f4f5', border: '#e4e4e7', fg: '#09090b', muted: '#71717a' },
    dark: { bg: '#09090b', panel: '#09090b', surface: '#27272a', border: '#27272a', fg: '#fafafa', muted: '#a1a1aa' },
  },
  slate: {
    light: { bg: '#ffffff', panel: '#ffffff', surface: '#f1f5f9', border: '#e2e8f0', fg: '#0f172a', muted: '#64748b' },
    dark: { bg: '#020617', panel: '#020617', surface: '#1e293b', border: '#334155', fg: '#f8fafc', muted: '#94a3b8' },
  },
  stone: {
    light: { bg: '#ffffff', panel: '#ffffff', surface: '#f5f5f4', border: '#e7e5e4', fg: '#1c1917', muted: '#78716c' },
    dark: { bg: '#1c1917', panel: '#1c1917', surface: '#292524', border: '#44403c', fg: '#fafaf9', muted: '#a8a29e' },
  },
  gray: {
    light: { bg: '#ffffff', panel: '#ffffff', surface: '#f3f4f6', border: '#e5e7eb', fg: '#111827', muted: '#6b7280' },
    dark: { bg: '#030712', panel: '#030712', surface: '#1f2937', border: '#374151', fg: '#f9fafb', muted: '#9ca3af' },
  },
  neutral: {
    light: { bg: '#ffffff', panel: '#ffffff', surface: '#f5f5f5', border: '#e5e5e5', fg: '#0a0a0a', muted: '#737373' },
    dark: { bg: '#0a0a0a', panel: '#0a0a0a', surface: '#262626', border: '#404040', fg: '#fafafa', muted: '#a3a3a3' },
  },
};

export const SHADOWS: Record<ShadowLevel, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  neo: '2px 2px 0px 0px var(--stroke)',
  flat: '4px 4px 0px 0px var(--stroke)',
  hard: '6px 6px 0px 0px var(--fg-main)',
};

export const FONTS: Record<ThemeFont, string> = {
  sans: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  display: '"Archivo Black", Impact, sans-serif',
  condensed: '"Bebas Neue", sans-serif',
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  oxanium: '"Oxanium", sans-serif',
};
