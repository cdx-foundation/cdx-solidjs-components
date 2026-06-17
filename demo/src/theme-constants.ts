export type ThemeFont = 'sans' | 'mono' | 'display' | 'condensed' | 'system' | 'oxanium';

export type StylePreset = 'vega' | 'nova' | 'maia' | 'lyra' | 'mira' | 'luma' | 'sera' | 'rhea';

export interface StylePresetConfig {
  label: string;
  description: string;
  headerFont: ThemeFont;
  bodyFont: ThemeFont;
  radius: string;
  shadow: string;
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
    headerFont: 'condensed',
    bodyFont: 'sans',
    radius: '0.75rem',
    shadow: 'lg',
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
    headerFont: 'display',
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
    bodyFont: 'system',
    radius: '0.3rem',
    shadow: 'flat',
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
    bodyFont: 'oxanium',
    radius: '0.75rem',
    shadow: 'xl',
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
    headerFont: 'sans',
    bodyFont: 'condensed',
    radius: '0px',
    shadow: 'neo',
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
    headerFont: 'condensed',
    bodyFont: 'oxanium',
    radius: '1.0rem',
    shadow: 'hard',
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

// ─── Color presets ────────────────────────────────────────────────────────────
// Named schemes that set all 6 neutral colours at once.
// The user can override individual colours after picking a preset.

export interface ColorPreset {
  name: string;
  label: string;
  colors: {
    bg: string;
    panel: string;
    surface: string;
    border: string;
    fg: string;
    muted: string;
  };
  colorsDark: {
    bg: string;
    panel: string;
    surface: string;
    border: string;
    fg: string;
    muted: string;
  };
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'zinc',
    label: 'Zinc',
    colors: {
      bg: '#ffffff',
      panel: '#ffffff',
      surface: '#f4f4f5',
      border: '#e4e4e7',
      fg: '#09090b',
      muted: '#71717a',
    },
    colorsDark: {
      bg: '#09090b',
      panel: '#09090b',
      surface: '#27272a',
      border: '#27272a',
      fg: '#fafafa',
      muted: '#a1a1aa',
    },
  },
  {
    name: 'slate',
    label: 'Slate',
    colors: {
      bg: '#ffffff',
      panel: '#ffffff',
      surface: '#f1f5f9',
      border: '#e2e8f0',
      fg: '#0f172a',
      muted: '#64748b',
    },
    colorsDark: {
      bg: '#020617',
      panel: '#020617',
      surface: '#1e293b',
      border: '#334155',
      fg: '#f8fafc',
      muted: '#94a3b8',
    },
  },
  {
    name: 'stone',
    label: 'Stone',
    colors: {
      bg: '#ffffff',
      panel: '#ffffff',
      surface: '#f5f5f4',
      border: '#e7e5e4',
      fg: '#1c1917',
      muted: '#78716c',
    },
    colorsDark: {
      bg: '#1c1917',
      panel: '#1c1917',
      surface: '#292524',
      border: '#44403c',
      fg: '#fafaf9',
      muted: '#a8a29e',
    },
  },
  {
    name: 'gray',
    label: 'Gray',
    colors: {
      bg: '#ffffff',
      panel: '#ffffff',
      surface: '#f3f4f6',
      border: '#e5e7eb',
      fg: '#111827',
      muted: '#6b7280',
    },
    colorsDark: {
      bg: '#030712',
      panel: '#030712',
      surface: '#1f2937',
      border: '#374151',
      fg: '#f9fafb',
      muted: '#9ca3af',
    },
  },
  {
    name: 'neutral',
    label: 'Neutral',
    colors: {
      bg: '#ffffff',
      panel: '#ffffff',
      surface: '#f5f5f5',
      border: '#e5e5e5',
      fg: '#0a0a0a',
      muted: '#737373',
    },
    colorsDark: {
      bg: '#0a0a0a',
      panel: '#0a0a0a',
      surface: '#262626',
      border: '#404040',
      fg: '#fafafa',
      muted: '#a3a3a3',
    },
  },
];

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
    : '0, 0, 0';
}
