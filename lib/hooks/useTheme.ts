import { createPrefersDark } from '@solid-primitives/media';
import { makePersisted } from '@solid-primitives/storage';
import { createEffect, createSignal } from 'solid-js';

export type ThemeFont = 'sans' | 'mono' | 'serif' | 'display' | 'system';
export type BaseColor = 'zinc' | 'slate' | 'stone' | 'pure' | 'crimson' | 'ocean' | 'forest' | 'vintage' | 'oled' | 'brutalist';
export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'neo' | 'flat' | 'hard';

export const BASE_PALETTES: Record<BaseColor, { light: any; dark: any }> = {
  zinc: {
    light: { bg: '#ffffff', panel: '#fafafa', surface: '#f4f4f5', border: '#e4e4e7', fg: '#09090b', muted: '#71717a' },
    dark: { bg: '#09090b', panel: '#121217', surface: '#18181b', border: '#27272a', fg: '#fafafa', muted: '#a1a1aa' }
  },
  slate: {
    light: { bg: '#ffffff', panel: '#f8fafc', surface: '#f1f5f9', border: '#e2e8f0', fg: '#0f172a', muted: '#64748b' },
    dark: { bg: '#020617', panel: '#0f172a', surface: '#1e293b', border: '#334155', fg: '#f8fafc', muted: '#94a3b8' }
  },
  stone: {
    light: { bg: '#ffffff', panel: '#fafaf9', surface: '#f5f5f4', border: '#e7e5e4', fg: '#0c0a09', muted: '#78716c' },
    dark: { bg: '#0c0a09', panel: '#1c1917', surface: '#292524', border: '#44403c', fg: '#fafaf9', muted: '#a8a29e' }
  },
  pure: {
    light: { bg: '#ffffff', panel: '#ffffff', surface: '#ffffff', border: '#f0f0f0', fg: '#171717', muted: '#737373' },
    dark: { bg: '#0a0a0a', panel: '#0a0a0a', surface: '#121212', border: '#1f1f1f', fg: '#ededed', muted: '#a3a3a3' }
  },
  crimson: {
    light: { bg: '#fffafa', panel: '#fff5f5', surface: '#ffffff', border: '#fee2e2', fg: '#450a0a', muted: '#b91c1c' },
    dark: { bg: '#0a0000', panel: '#1a0000', surface: '#2a0000', border: '#450a0a', fg: '#fef2f2', muted: '#ef4444' }
  },
  ocean: {
    light: { bg: '#f0f7ff', panel: '#e0f0ff', surface: '#ffffff', border: '#bae0ff', fg: '#002c4d', muted: '#60a5fa' },
    dark: { bg: '#000d1a', panel: '#001a33', surface: '#00264d', border: '#003d80', fg: '#e6f4ff', muted: '#3b82f6' }
  },
  forest: {
    light: { bg: '#f2fcf5', panel: '#e6f7ed', surface: '#ffffff', border: '#d1f2e2', fg: '#052e16', muted: '#10b981' },
    dark: { bg: '#02120a', panel: '#052e16', surface: '#064e3b', border: '#065f46', fg: '#ecfdf5', muted: '#34d399' }
  },
  vintage: {
    light: { bg: '#fdfcf0', panel: '#f5f2d0', surface: '#fffef5', border: '#e6e2bc', fg: '#422006', muted: '#a16207' },
    dark: { bg: '#1a140a', panel: '#2d2412', surface: '#3e301a', border: '#5c4b2a', fg: '#fefce8', muted: '#ca8a04' }
  },
  oled: {
    light: { bg: '#ffffff', panel: '#fafafa', surface: '#f5f5f5', border: '#e5e5e5', fg: '#000000', muted: '#737373' },
    dark: { bg: '#000000', panel: '#000000', surface: '#090909', border: '#1a1a1a', fg: '#ffffff', muted: '#a3a3a3' }
  },
  brutalist: {
    light: { bg: '#ffffff', panel: '#ffffff', surface: '#ffffff', border: '#000000', fg: '#000000', muted: '#000000' },
    dark: { bg: '#000000', panel: '#000000', surface: '#000000', border: '#ffffff', fg: '#ffffff', muted: '#ffffff' }
  }
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
  hard: '6px 6px 0px 0px var(--fg-main)'
};

const FONTS = {
  sans: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  serif: '"Playfair Display", Georgia, serif',
  display: '"Archivo Black", Impact, sans-serif',
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
}

export function useTheme() {
  const prefersDark = createPrefersDark();

  const [isDark, setIsDark] = makePersisted(createSignal(prefersDark()), { name: 'starling-theme' });
  const [accentColor, setAccentColor] = makePersisted(createSignal('#e11d48'), { name: 'starling-accent' });
  const [radius, setRadius] = makePersisted(createSignal('0.5rem'), { name: 'starling-radius' });
  const [headerFont, setHeaderFont] = makePersisted(createSignal<ThemeFont>('display'), { name: 'starling-header-font' });
  const [bodyFont, setBodyFont] = makePersisted(createSignal<ThemeFont>('sans'), { name: 'starling-body-font' });
  const [baseColor, setBaseColor] = makePersisted(createSignal<BaseColor>('pure'), { name: 'starling-base' });
  const [shadow, setShadow] = makePersisted(createSignal<ShadowLevel>('sm'), { name: 'starling-shadow' });
  const [btnBoxShadow, setBtnBoxShadow] = makePersisted(createSignal<ShadowLevel>('none'), { name: 'starling-btn-shadow' });

  createEffect(() => {
    document.documentElement.classList.toggle('dark', isDark());
    document.documentElement.style.colorScheme = isDark() ? 'dark' : 'light';
  });

  createEffect(() => {
    const root = document.documentElement;
    const palette = BASE_PALETTES[baseColor()][isDark() ? 'dark' : 'light'];
    
    root.style.setProperty('--primary-color', accentColor());
    root.style.setProperty('--primary-rgb', hexToRgb(accentColor()));

    root.style.setProperty('--bg-main', palette.bg);
    root.style.setProperty('--bg-panel', palette.panel);
    root.style.setProperty('--bg-surface', palette.surface);
    
    root.style.setProperty('--fg-main', palette.fg);
    root.style.setProperty('--text-muted', palette.muted);
    
    root.style.setProperty('--border-main', palette.border);
    root.style.setProperty('--stroke', palette.border);
    
    // Auxiliary variables
    const isDarkVal = isDark();
    root.style.setProperty('--ring-main', isDarkVal ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)');
    root.style.setProperty('--glass-border', isDarkVal ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)');
    
    // Shadows
    root.style.setProperty('--shadow-main', SHADOWS[shadow()]);
    root.style.setProperty('--shadow-btn', SHADOWS[btnBoxShadow()]);
    
    const r = radius();
    root.style.setProperty('--radius-card', r);
    root.style.setProperty('--radius-lg', r);
    root.style.setProperty('--radius-btn', `calc(${r} - 0.2rem)`);
    root.style.setProperty('--radius-input', `calc(${r} - 0.1rem)`);
    root.style.setProperty('--radius-badge', `calc(${r} - 0.3rem)`);
    
    root.style.setProperty('--font-sans', FONTS[bodyFont()]);
    root.style.setProperty('--font-display', FONTS[headerFont()]);
    root.style.setProperty('--font-mono', FONTS.mono);
    
    document.body.style.fontFamily = FONTS[bodyFont()];
  });

  return { 
    isDark, setIsDark,
    accentColor, setAccentColor,
    radius, setRadius,
    headerFont, setHeaderFont,
    bodyFont, setBodyFont,
    baseColor, setBaseColor,
    shadow, setShadow,
    btnBoxShadow, setBtnBoxShadow
  };
}
