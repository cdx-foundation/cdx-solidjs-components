import { createPrefersDark } from '@solid-primitives/media';
import { makePersisted } from '@solid-primitives/storage';
import {
  type Accessor,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  onCleanup,
  type Setter,
} from 'solid-js';
import { FONTS, SHADOWS } from '../theme-tokens';
import type { ShadowLevel, ThemeFont } from '../theme-tokens';

export type { ShadowLevel, ThemeFont };

// ─── Theme types ──────────────────────────────────────────────────────────────

export type Theme = {
  dark: boolean;
  /** Primary accent color (hex). */
  accent: string;
  /** Application background. */
  bg: string;
  /** Panel / card / modal background. */
  panel: string;
  /** Subtle surface for hover states, secondary areas. */
  surface: string;
  /** Default border color. */
  border: string;
  /** Primary text / foreground color. */
  fg: string;
  /** Muted / secondary text color. */
  muted: string;
  /** Unified border radius. */
  radius: string;
  /** Body text font. */
  font: ThemeFont;
  /** Heading / display font. */
  headerFont: ThemeFont;
  /** Shadow level for panels. */
  shadow: ShadowLevel;
  /** Shadow level for buttons. */
  btnShadow: ShadowLevel;
};

export type DualThemeConfig = { light?: Partial<Theme>; dark?: Partial<Theme> };

export type ThemeConfig = {
  isDark: Accessor<boolean>;
  accent: Accessor<string>;
  bg: Accessor<string>;
  panel: Accessor<string>;
  surface: Accessor<string>;
  border: Accessor<string>;
  fg: Accessor<string>;
  muted: Accessor<string>;
  radius: Accessor<string>;
  font: Accessor<ThemeFont>;
  headerFont: Accessor<ThemeFont>;
  shadow: Accessor<ShadowLevel>;
  btnShadow: Accessor<ShadowLevel>;
  /** Style preset name (spacing/density preset, not mode-specific). */
  style: Accessor<string>;

  /** Full theme object (for serialisation / bulk reads). */
  theme: Accessor<Theme>;

  /** Merge a partial theme or apply a dual-theme config ({ light, dark }). */
  setTheme: (config: Partial<Theme> | DualThemeConfig) => void;
  /** Apply overrides scoped to light mode. */
  setLightTheme: (config: Partial<Theme>) => void;
  /** Apply overrides scoped to dark mode. */
  setDarkTheme: (config: Partial<Theme>) => void;
  /** Toggle between dark, light, and system mode. */
  toggleTheme: () => void;
  /** Updates the style preset name (spacing/density metadata). */
  setStyle: (v: string) => void;
};

// ─── Persisted shape ──────────────────────────────────────────────────────────

/** Theme style properties (everything except the `dark` mode flag). */
type ThemeStyles = Omit<Theme, 'dark'>;

interface PersistedTheme {
  /** Schema version for forward-compat. Bump when shape changes. */
  version: number;
  /** Which mode is currently active. 'system' follows OS preference. */
  mode: 'light' | 'dark' | 'system';
  /** Light-mode style overrides. */
  light: Partial<ThemeStyles>;
  /** Dark-mode style overrides. */
  dark: Partial<ThemeStyles>;
  /** Style preset name (spacing/density metadata, not mode-specific). */
  style?: string;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

// Fix #2: Guard createPrefersDark() against SSR / no-DOM environments.
// The signal is created lazily inside ensureReactives() instead of at module
// evaluation time, so importing this file in Node/SSR never touches the DOM.
let prefersDarkSignal: Accessor<boolean> | null = null;
function getPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  if (!prefersDarkSignal) prefersDarkSignal = createPrefersDark();
  return prefersDarkSignal();
}

const BUILTIN_DEFAULTS: Theme = {
  dark: false,
  accent: '#6366f1',
  bg: '#ffffff',
  panel: '#ffffff',
  surface: '#f4f4f5',
  border: '#e4e4e7',
  fg: '#09090b',
  muted: '#71717a',
  radius: '12px',
  font: 'sans',
  headerFont: 'sans',
  shadow: 'md',
  btnShadow: 'md',
};

/** Bump when the persisted shape changes (e.g. new required fields). */
const THEME_VERSION = 1;

const STORAGE_KEY = 'cdx_theme';

// C2: Signal + makePersisted are created lazily inside ensureReactives() to
// avoid SSR hazards (makePersisted accesses localStorage at creation time).
let persisted!: Accessor<PersistedTheme>;
let setPersisted!: Setter<PersistedTheme>;

// ─── Color helpers ────────────────────────────────────────────────────────────

const COLOR_FIELDS: ReadonlyArray<keyof ThemeStyles> = [
  'bg',
  'panel',
  'surface',
  'border',
  'fg',
  'muted',
];

// ─── HSL colour helpers ───────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const hi = h / 360;
  const si = s / 100;
  const li = l / 100;
  const q = li < 0.5 ? li * (1 + si) : li + si - li * si;
  const p = 2 * li - q;
  const toC = (t: number) => {
    const n = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (n < 1 / 6) return p + (q - p) * 6 * n;
    if (n < 1 / 2) return q;
    if (n < 2 / 3) return p + (q - p) * (2 / 3 - n) * 6;
    return p;
  };
  const r = Math.round(toC(hi + 1 / 3) * 255);
  const g = Math.round(toC(hi) * 255);
  const b = Math.round(toC(hi - 1 / 3) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Derive a dark-mode counterpart for a light-mode hex colour.
 *
 * Maps lightness through a piecewise dark-mode curve while preserving hue
 * and damping saturation by 45%.  Relative lightness ordering is preserved
 * so layered surfaces (bg < panel < surface < border) remain correctly
 * stratified in dark mode.
 *
 * Mapping:
 *   L 70–100% → surfaces  → 6–20%  (bg=6, border≈11)
 *   L 30–70%  → mid-tones → 20–50% (muted grays)
 *   L 0–30%   → text      → 80–96% (near-black fg → near-white)
 */
export function toDark(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  let dl: number;
  if (l >= 70)
    dl = 6 + ((100 - l) / 30) * 14; // surfaces
  else if (l >= 30)
    dl = 20 + ((70 - l) / 40) * 30; // mid-tones
  else dl = 80 + ((30 - l) / 30) * 16; // text → near-white
  return hslToHex(h, s * 0.55, dl);
}

// ─── Compute active theme from persisted state ────────────────────────────────

function computeTheme(p: PersistedTheme): Theme {
  // Resolve 'system' mode against the OS preference at compute time.
  const isDark = p.mode === 'system' ? getPrefersDark() : p.mode === 'dark';

  // Start from the light-mode computed state (defaults + light overrides).
  // Non-colour fields (radius, font, shadow, etc.) carry over to dark mode.
  const lightComputed = { ...BUILTIN_DEFAULTS, ...p.light, dark: false };

  if (isDark) {
    // Auto-derive the 6 neutral colour fields from the light values.
    const darkColors: Partial<Pick<Theme, (typeof COLOR_FIELDS)[number]>> = {};
    for (const key of COLOR_FIELDS) darkColors[key] = toDark(lightComputed[key]) as any;
    // Explicit dark overrides take precedence over auto-derived values.
    return { ...lightComputed, ...darkColors, ...p.dark, dark: true };
  }

  return lightComputed;
}

// ─── Apply to <html> ──────────────────────────────────────────────────────────

function applyTheme(t: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const fontVal = FONTS[t.font];
  const headerFontVal = FONTS[t.headerFont];
  const shadowVal = SHADOWS[t.shadow];
  const btnShadowVal = SHADOWS[t.btnShadow];

  root.classList.toggle('dark', t.dark);
  root.style.colorScheme = t.dark ? 'dark' : 'light';
  root.style.setProperty('--primary-color', t.accent);
  root.style.setProperty('--bg-main', t.bg);
  root.style.setProperty('--bg-panel', t.panel);
  root.style.setProperty('--bg-surface', t.surface);
  root.style.setProperty('--border-main', t.border);
  root.style.setProperty('--stroke', t.border);
  root.style.setProperty('--fg-main', t.fg);
  root.style.setProperty('--text-muted', t.muted);
  root.style.setProperty('--radius-card', t.radius);
  root.style.setProperty('--radius-btn', t.radius);
  root.style.setProperty('--radius-input', t.radius);
  root.style.setProperty('--radius-badge', t.radius);
  root.style.setProperty('--display-main', headerFontVal);
  root.style.setProperty('--sans-main', fontVal);
  root.style.setProperty('--shadow-main', shadowVal);
  root.style.setProperty('--shadow-btn', btnShadowVal);
}

// ─── Root-level effect (HMR-safe) ─────────────────────────────────────────────

let themeMemo: Accessor<Theme>;
let themeEffectRan = false;

function ensureReactives() {
  if (themeEffectRan) return;
  themeEffectRan = true;

  // Fix #2: initialise prefersDark inside a reactive root so the media-query
  // listener is properly owned and cleaned up with the root.
  createRoot(() => {
    // Eagerly create the prefersDark signal so 'system' mode is reactive.
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      prefersDarkSignal = createPrefersDark();
    }

    // C2: Create persisted signal lazily, guarded against SSR.
    // makePersisted accesses localStorage which throws during SSR.
    if (typeof window !== 'undefined') {
      const [p, sp] = makePersisted(
        createSignal<PersistedTheme>({
          version: THEME_VERSION,
          mode: 'system',
          light: {},
          dark: {},
        }),
        {
          name: STORAGE_KEY,
          deserialize: (raw: string): PersistedTheme => {
            try {
              const parsed = JSON.parse(raw);
              if (parsed.version === THEME_VERSION) return parsed as PersistedTheme;
            } catch {}
            return { version: THEME_VERSION, mode: 'system', light: {}, dark: {} };
          },
        },
      );
      persisted = p;
      setPersisted = sp;
    } else {
      // SSR fallback: no localStorage available
      const [p, sp] = createSignal<PersistedTheme>({
        version: THEME_VERSION,
        mode: 'system',
        light: {},
        dark: {},
      });
      persisted = p;
      setPersisted = sp;
    }

    themeMemo = createMemo(() => computeTheme(persisted()));
    createEffect(() => applyTheme(themeMemo()));

    // M6: Cross-tab / cross-app sync via the storage event.
    // Moved inside createRoot so cleanup is properly disposed on HMR/unmount.
    if (typeof window !== 'undefined') {
      const handler = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed.version === THEME_VERSION) setPersisted(parsed);
          } catch {}
        }
      };
      window.addEventListener('storage', handler);
      onCleanup(() => window.removeEventListener('storage', handler));
    }
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Reactive theme hook with persistent light/dark overrides and FOUC prevention.
 *
 * The hook manages two independent style branches (`light` and `dark`) plus a
 * `mode` toggle.  When dark mode is active, the six neutral colour fields (bg,
 * panel, surface, border, fg, muted) are **auto-derived** from the light values
 * via luminance inversion (`toDark`).  Non-colour fields (radius, font, shadow,
 * headerFont, btnShadow) carry over from light mode unchanged.  Explicit dark
 * overrides passed via `setDarkTheme` or `DualThemeConfig` take precedence over
 * auto-derived values.
 *
 * Persisted to `localStorage` under `cdx_theme`.  Each persisted object carries
 * a `version` number — if the stored schema ever changes the hook transparently
 * discards stale data and falls back to fresh defaults.
 *
 * The default mode is `'system'`, which follows the OS preference reactively.
 * `toggleTheme` cycles through `system → dark → light → system`.
 *
 * Use `useTheme.getScript()` as a blocking inline `<script>` in `<head>` to
 * prevent a flash of unstyled content (FOUC).  The emitted script reads
 * localStorage synchronously, auto-derives dark-mode colours, and sets CSS
 * custom properties before the first paint.
 *
 * All colour values are hex strings (e.g. `"#6366f1"`).  The `dark` accessor
 * is `true` when dark mode is active.
 *
 * @param config - Optional theme config. When provided, calls `setTheme` to
 *   apply changes directly (equivalent to `useTheme().setTheme(config)`).
 *   Accepts `Partial<Theme>` for flat overrides or `DualThemeConfig` for
 *   scoped light/dark overrides.
 *
 * @example
 * ```tsx
 * import { useTheme } from 'your-lib/hooks/useTheme';
 *
 * function App() {
 *   const {
 *     isDark, theme, bg, fg, accent, radius,
 *     font, headerFont, shadow, btnShadow, style,
 *     setTheme, setLightTheme, setDarkTheme,
 *     toggleTheme, setStyle,
 *   } = useTheme();
 *
 *   // Toggle cycles: system → dark → light → system
 *   <button onClick={toggleTheme}>
 *     {isDark() ? 'Switch to Light' : 'Switch to Dark'}
 *   </button>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Set theme directly without a separate setTheme call
 * const theme = useTheme({ accent: '#ff4500', radius: '8px' });
 * ```
 *
 * @example
 * ```html
 * <!-- index.html — block FOUC before the first paint -->
 * <head>
 *   <script>${useTheme.getScript({ accent: '#ff4500' })}</script>
 * </head>
 * ```
 */
/** Shared set-theme logic used by both the hook arg and setTheme(). */
function applyThemeConfig(
  prev: PersistedTheme,
  config: Partial<Theme> | DualThemeConfig,
): PersistedTheme {
  if ('light' in config || typeof (config as any).dark === 'object') {
    const { light: lCfg, dark: dCfg } = config as DualThemeConfig;
    return {
      ...prev,
      light: lCfg ? { ...prev.light, ...lCfg } : prev.light,
      dark: dCfg ? { ...prev.dark, ...dCfg } : prev.dark,
    };
  }
  const { dark: modeFlag, ...styleChanges } = config as Partial<Theme>;
  const targetMode: 'light' | 'dark' =
    modeFlag !== undefined
      ? modeFlag
        ? 'dark'
        : 'light'
      : prev.mode === 'system'
        ? getPrefersDark()
          ? 'dark'
          : 'light'
        : prev.mode;
  if (targetMode === 'dark') {
    return { ...prev, mode: 'dark', dark: { ...prev.dark, ...styleChanges } };
  }
  return { ...prev, mode: 'light', light: { ...prev.light, ...styleChanges } };
}

export function useTheme(config?: Partial<Theme> | DualThemeConfig): ThemeConfig {
  ensureReactives();

  if (config) {
    setPersisted((prev) => applyThemeConfig(prev, config));
  }

  return {
    theme: () => themeMemo!(),
    isDark: () => themeMemo!().dark,
    accent: () => themeMemo!().accent,
    bg: () => themeMemo!().bg,
    panel: () => themeMemo!().panel,
    surface: () => themeMemo!().surface,
    border: () => themeMemo!().border,
    fg: () => themeMemo!().fg,
    muted: () => themeMemo!().muted,
    radius: () => themeMemo!().radius,
    font: () => themeMemo!().font,
    headerFont: () => themeMemo!().headerFont,
    shadow: () => themeMemo!().shadow,
    btnShadow: () => themeMemo!().btnShadow,
    style: () => persisted().style ?? 'vega',

    setTheme: (config: Partial<Theme> | DualThemeConfig) => {
      setPersisted((prev) => applyThemeConfig(prev, config));
    },

    setLightTheme: (config: Partial<Theme>) => {
      setPersisted((prev) => ({ ...prev, light: { ...prev.light, ...config } }));
    },

    setDarkTheme: (config: Partial<Theme>) => {
      setPersisted((prev) => ({ ...prev, dark: { ...prev.dark, ...config } }));
    },

    // Fix #5: Toggle cycles through system → dark → light → system.
    toggleTheme: () => {
      setPersisted((prev) => ({
        ...prev,
        mode: prev.mode === 'system' ? 'dark' : prev.mode === 'dark' ? 'light' : 'system',
      }));
    },

    setStyle: (v: string) => setPersisted((prev) => ({ ...prev, style: v })),
  };
}

/**
 * Returns an inline script string that synchronously applies the persisted
 * theme before the first paint, preventing FOUC.
 *
 * Dark-mode colours are auto-derived from the light values via simple
 * inversion.  Explicit dark overrides in the persisted data take precedence.
 *
 * M10: The colour-helpers JS is generated from the actual TS implementations
 * (hexToHsl, hslToHex, toDark) via .toString() so they cannot diverge.
 */
useTheme.hexToHsl = hexToHsl;
useTheme.hslToHex = hslToHex;
useTheme.toDark = toDark;
useTheme.getScript = (defaults?: Partial<Theme>): string => `(function(){
  var v=${THEME_VERSION};
  var def=${JSON.stringify(BUILTIN_DEFAULTS)};
  var user=${JSON.stringify(defaults || {})};
  ${useTheme.hexToHsl!.toString()}
  ${useTheme.hslToHex!.toString()}
  ${useTheme.toDark!.toString()}
  var d=Object.assign({},def,user);
  try{
    var s=localStorage.getItem('${STORAGE_KEY}');
    if(s){
      var p=JSON.parse(s);
      if(p.version===v && p.mode && p.light && p.dark){
        Object.assign(d,p.light);
        // Fix #5: resolve 'system' mode against matchMedia
        var isDark=p.mode==='dark'||(p.mode==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
        if(isDark){
          d.bg=toDark(d.bg);d.panel=toDark(d.panel);d.surface=toDark(d.surface);
          d.border=toDark(d.border);d.fg=toDark(d.fg);d.muted=toDark(d.muted);
          Object.assign(d,p.dark);
        }
        d.dark=isDark;
      }
    }
  }catch(e){}
  var fonts=${JSON.stringify(FONTS)};
  var shadows=${JSON.stringify(SHADOWS)};
  var r=document.documentElement;
  r.classList.toggle('dark',d.dark);
  r.style.colorScheme=d.dark?'dark':'light';
  r.style.setProperty('--primary-color',d.accent);
  r.style.setProperty('--bg-main',d.bg);
  r.style.setProperty('--bg-panel',d.panel);
  r.style.setProperty('--bg-surface',d.surface);
  r.style.setProperty('--border-main',d.border);
  r.style.setProperty('--stroke',d.border);
  r.style.setProperty('--fg-main',d.fg);
  r.style.setProperty('--text-muted',d.muted);
  var rv=d.radius,fv=fonts[d.font]||fonts.sans,hfv=fonts[d.headerFont]||fonts.sans,sv=shadows[d.shadow]||'none',bsv=shadows[d.btnShadow]||'none';
  ['--radius-card','--radius-btn','--radius-input','--radius-badge'].forEach(function(k){r.style.setProperty(k,rv);});
  r.style.setProperty('--display-main',hfv);
  r.style.setProperty('--sans-main',fv);
  r.style.setProperty('--shadow-main',sv);
  r.style.setProperty('--shadow-btn',bsv);
})();`;
