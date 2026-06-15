import { createPrefersDark } from '@solid-primitives/media';
import { makePersisted } from '@solid-primitives/storage';
import { type Accessor, createEffect, createRoot, createSignal } from 'solid-js';
import { BASE_PALETTES, FONTS, SHADOWS } from '../theme-tokens';
import type { BaseColor, ShadowLevel, ThemeFont } from '../theme-tokens';

export type { BaseColor, ShadowLevel, ThemeFont };

export type Theme = {
  dark: boolean;
  /** Primary accent color (hex). */
  accent: string;
  /** Named color palette. */
  base: BaseColor;
  /** Unified border radius for all elements. */
  radius: string;
  /** UI font. */
  font: ThemeFont;
  /** Shadow level for panels and buttons. */
  shadow: ShadowLevel;
};

export type DualThemeConfig = { light: Partial<Theme>; dark: Partial<Theme> };

export type ThemeConfig = {
  /** Whether dark mode is active. */
  isDark: Accessor<boolean>;
  /** Primary accent color (hex). */
  accent: Accessor<string>;
  /** Named color palette. */
  base: Accessor<BaseColor>;
  /** Unified border radius for all elements. */
  radius: Accessor<string>;
  /** UI font stack. */
  font: Accessor<ThemeFont>;
  /** Shadow level for panels and buttons. */
  shadow: Accessor<ShadowLevel>;

  /** Full theme object (for serialization / bulk reads). */
  theme: Accessor<Theme>;

  /** Merge a partial theme or apply a dual-theme config ({ light, dark }). */
  setTheme: (config: Partial<Theme> | DualThemeConfig) => void;
  /** Apply overrides scoped to light mode. */
  setLightTheme: (config: Partial<Theme>) => void;
  /** Apply overrides scoped to dark mode. */
  setDarkTheme: (config: Partial<Theme>) => void;
  /** Toggle between dark and light mode. */
  toggleTheme: () => void;
};

// ─── Defaults ────────────────────────────────────────────────────────────────

const prefersDark = createPrefersDark();

const BUILTIN_DEFAULTS: Theme = {
  dark: prefersDark(),
  accent: '#c62828',
  base: 'pure',
  radius: '0px',
  font: 'sans',
  shadow: 'none',
};

let defaultsApplied = false;

// ─── Persistent singleton ─────────────────────────────────────────────────────

const [theme, setThemeRaw] = makePersisted(createSignal<Theme>(BUILTIN_DEFAULTS), {
  name: 'starling-theme',
});

// ─── Apply to <html> ──────────────────────────────────────────────────────────

function applyTheme(t: Theme) {
  const root = document.documentElement;
  const palette = BASE_PALETTES[t.base][t.dark ? 'dark' : 'light'];
  const fontVal = FONTS[t.font];
  const shadowVal = SHADOWS[t.shadow];

  root.classList.toggle('dark', t.dark);
  root.style.colorScheme = t.dark ? 'dark' : 'light';
  root.style.setProperty('--primary-color', t.accent);
  root.style.setProperty('--bg-main', palette.bg);
  root.style.setProperty('--bg-panel', palette.panel);
  root.style.setProperty('--bg-surface', palette.surface);
  root.style.setProperty('--border-main', palette.border);
  root.style.setProperty('--stroke', palette.border);
  root.style.setProperty('--fg-main', palette.fg);
  root.style.setProperty('--text-muted', palette.muted);
  root.style.setProperty('--radius-card', t.radius);
  root.style.setProperty('--radius-btn', t.radius);
  root.style.setProperty('--radius-input', t.radius);
  root.style.setProperty('--radius-badge', t.radius);
  root.style.setProperty('--display-main', fontVal);
  root.style.setProperty('--sans-main', fontVal);
  root.style.setProperty('--shadow-main', shadowVal);
  root.style.setProperty('--shadow-btn', shadowVal);
}

// ─── Root-level effect (HMR-safe) ──────────────────────────────────────────────

let themeEffectRan = false;
function ensureThemeEffect() {
  if (themeEffectRan) return;
  themeEffectRan = true;
  createRoot(() => {
    createEffect(() => applyTheme(theme()));
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages the full application theme via a single `Theme` object.
 * Call `setTheme` with your server response to apply it instantly.
 * The last applied theme is persisted to localStorage as a fallback.
 *
 * Use `useTheme.getScript()` as a blocking inline `<script>` in `<head>`
 * to prevent a flash of unstyled content (FOUC).
 *
 * @param defaults - Optional project-level theme defaults applied once on first
 *   call (lower priority than persisted localStorage values).
 *
 * @example
 * ```tsx
 * const { isDark, toggleTheme, setTheme } = useTheme();
 *
 * // Apply a full theme from server
 * setTheme(await fetchTheme());
 *
 * // Or tweak a single value
 * setTheme({ accent: '#6366f1' });
 * ```
 */
export function useTheme(defaults?: Partial<Theme>): ThemeConfig {
  ensureThemeEffect();

  // Apply project defaults once (persisted localStorage already merged in signal)
  if (defaults && !defaultsApplied) {
    defaultsApplied = true;
    setThemeRaw((prev) => ({ ...BUILTIN_DEFAULTS, ...defaults, ...prev }));
  }

  return {
    theme,
    isDark: () => theme().dark,
    accent: () => theme().accent,
    base: () => theme().base,
    radius: () => theme().radius,
    font: () => theme().font,
    shadow: () => theme().shadow,

    setTheme: (config: Partial<Theme> | DualThemeConfig) => {
      setThemeRaw((prev) => {
        if ('light' in config || 'dark' in config) {
          const mode: 'light' | 'dark' = prev.dark ? 'dark' : 'light';
          const modeConfig = (config as DualThemeConfig)[mode];
          return modeConfig ? { ...prev, ...modeConfig } : prev;
        }
        return { ...prev, ...(config as Partial<Theme>) };
      });
    },

    setLightTheme: (config: Partial<Theme>) => {
      setThemeRaw((prev) => (prev.dark ? prev : { ...prev, ...config }));
    },

    setDarkTheme: (config: Partial<Theme>) => {
      setThemeRaw((prev) => (prev.dark ? { ...prev, ...config } : prev));
    },

    toggleTheme: () => {
      setThemeRaw((prev) => ({ ...prev, dark: !prev.dark }));
    },
  };
}

/**
 * Returns an inline script string that synchronously applies the persisted
 * theme before the first paint, preventing FOUC.
 *
 * ```html
 * <script><!-- paste output here --></script>
 * ```
 * Or in a meta-framework:
 * ```tsx
 * <script innerHTML={useTheme.getScript()} />
 * ```
 *
 * @param defaults - Optional project-level theme defaults to merge before
 *   reading persisted localStorage (same defaults passed to `useTheme`).
 */
useTheme.getScript = (defaults?: Partial<Theme>): string => `(function(){
  var d=Object.assign({},${JSON.stringify(BUILTIN_DEFAULTS)},${JSON.stringify(defaults || {})});
  try{var s=localStorage.getItem('starling-theme');if(s)d=Object.assign(d,JSON.parse(s));}catch(e){}
  var palettes=${JSON.stringify(BASE_PALETTES)};
  var fonts=${JSON.stringify(FONTS)};
  var shadows=${JSON.stringify(SHADOWS)};
  var p=(palettes[d.base]||palettes.pure)[d.dark?'dark':'light'];
  var r=document.documentElement;
  r.classList.toggle('dark',d.dark);
  r.style.colorScheme=d.dark?'dark':'light';
  r.style.setProperty('--primary-color',d.accent);
  r.style.setProperty('--bg-main',p.bg);
  r.style.setProperty('--bg-panel',p.panel);
  r.style.setProperty('--bg-surface',p.surface);
  r.style.setProperty('--border-main',p.border);
  r.style.setProperty('--stroke',p.border);
  r.style.setProperty('--fg-main',p.fg);
  r.style.setProperty('--text-muted',p.muted);
  var rv=d.radius,fv=fonts[d.font]||fonts.sans,sv=shadows[d.shadow]||'none';
  ['--radius-card','--radius-btn','--radius-input','--radius-badge'].forEach(function(k){r.style.setProperty(k,rv);});
  r.style.setProperty('--display-main',fv);
  r.style.setProperty('--sans-main',fv);
  r.style.setProperty('--shadow-main',sv);
  r.style.setProperty('--shadow-btn',sv);
})();`;
