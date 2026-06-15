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

export type StylePreset = 'vega' | 'nova' | 'maia' | 'lyra' | 'mira' | 'luma' | 'sera' | 'rhea';

export interface StylePresetConfig {
  label: string;
  description: string;
  headerFont: ThemeFont;
  bodyFont: ThemeFont;
  radius: string;
  shadow: ShadowLevel;
  cardPad: string;
  cardGap: string;
  btnPadY: string;
  btnPadX: string;
  inputPadY: string;
  inputPadX: string;
  badgePadY: string;
  badgePadX: string;
  layoutGap: string;
}

export const STYLE_PRESETS: Record<StylePreset, StylePresetConfig> = {
  vega: {
    label: 'Vega',
    description: 'Default, clean',
    headerFont: 'sans',
    bodyFont: 'sans',
    radius: '0.5rem',
    shadow: 'md',
    cardPad: '1.25rem',
    cardGap: '0.75rem',
    btnPadY: '0.625rem',
    btnPadX: '1.25rem',
    inputPadY: '0.625rem',
    inputPadX: '0.75rem',
    badgePadY: '0.125rem',
    badgePadX: '0.5rem',
    layoutGap: '2.5rem',
  },
  nova: {
    label: 'Nova',
    description: 'Modern, tech-forward',
    headerFont: 'sans',
    bodyFont: 'sans',
    radius: '0.75rem',
    shadow: 'md',
    cardPad: '1.125rem',
    cardGap: '0.625rem',
    btnPadY: '0.5rem',
    btnPadX: '1rem',
    inputPadY: '0.5rem',
    inputPadX: '0.75rem',
    badgePadY: '0.125rem',
    badgePadX: '0.5rem',
    layoutGap: '2rem',
  },
  maia: {
    label: 'Maia',
    description: 'Friendly, rounded',
    headerFont: 'sans',
    bodyFont: 'sans',
    radius: '1.0rem',
    shadow: 'sm',
    cardPad: '1.5rem',
    cardGap: '1rem',
    btnPadY: '0.75rem',
    btnPadX: '1.5rem',
    inputPadY: '0.75rem',
    inputPadX: '1rem',
    badgePadY: '0.1875rem',
    badgePadX: '0.625rem',
    layoutGap: '2.5rem',
  },
  lyra: {
    label: 'Lyra',
    description: 'Monospace, technical',
    headerFont: 'mono',
    bodyFont: 'mono',
    radius: '0px',
    shadow: 'none',
    cardPad: '0.75rem',
    cardGap: '0.375rem',
    btnPadY: '0.375rem',
    btnPadX: '0.75rem',
    inputPadY: '0.375rem',
    inputPadX: '0.5rem',
    badgePadY: '0.0625rem',
    badgePadX: '0.25rem',
    layoutGap: '1.5rem',
  },
  mira: {
    label: 'Mira',
    description: 'Mini, compact',
    headerFont: 'sans',
    bodyFont: 'sans',
    radius: '0.3rem',
    shadow: 'sm',
    cardPad: '0.75rem',
    cardGap: '0.375rem',
    btnPadY: '0.375rem',
    btnPadX: '0.75rem',
    inputPadY: '0.375rem',
    inputPadX: '0.5rem',
    badgePadY: '0.0625rem',
    badgePadX: '0.25rem',
    layoutGap: '1.5rem',
  },
  luma: {
    label: 'Luma',
    description: 'Soft, pill-like',
    headerFont: 'sans',
    bodyFont: 'sans',
    radius: '1.0rem',
    shadow: 'lg',
    cardPad: '1.5rem',
    cardGap: '1rem',
    btnPadY: '0.75rem',
    btnPadX: '1.75rem',
    inputPadY: '0.75rem',
    inputPadX: '1rem',
    badgePadY: '0.1875rem',
    badgePadX: '0.625rem',
    layoutGap: '3rem',
  },
  sera: {
    label: 'Sera',
    description: 'Editorial, typographic',
    headerFont: 'display',
    bodyFont: 'sans',
    radius: '0px',
    shadow: 'none',
    cardPad: '1rem',
    cardGap: '0.5rem',
    btnPadY: '0.5rem',
    btnPadX: '1rem',
    inputPadY: '0.5rem',
    inputPadX: '0.75rem',
    badgePadY: '0.125rem',
    badgePadX: '0.375rem',
    layoutGap: '2rem',
  },
  rhea: {
    label: 'Rhea',
    description: 'Compact Luma',
    headerFont: 'sans',
    bodyFont: 'sans',
    radius: '0.75rem',
    shadow: 'md',
    cardPad: '1rem',
    cardGap: '0.5rem',
    btnPadY: '0.4375rem',
    btnPadX: '1rem',
    inputPadY: '0.5rem',
    inputPadX: '0.75rem',
    badgePadY: '0.0625rem',
    badgePadX: '0.375rem',
    layoutGap: '1.5rem',
  },
};

export const BASE_PALETTES: Record<BaseColor, { light: any; dark: any }> = {
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

export const FONTS = {
  sans: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  display: '"Archivo Black", Impact, sans-serif',
  condensed: '"Bebas Neue", sans-serif',
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  oxanium: '"Oxanium", sans-serif',
};

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
    : '0, 0, 0';
}
