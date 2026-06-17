import { createSignal } from 'solid-js';
import { useTheme } from '../../../lib/hooks/useTheme';
import type { StylePreset } from '../theme-constants';
import { STYLE_PRESETS } from '../theme-constants';

/**
 * App-specific theme wrapper.
 *
 * Colour setters (bg, panel, surface, border, fg, muted) affect the
 * currently active mode only (light or dark).  Non-colour setters
 * (radius, font, headerFont, shadow, btnShadow) are global — they
 * write to both modes.  Accent colour is also global.
 *
 * Pass `setTheme` through for advanced usage (e.g., colour presets
 * that always set light colours).
 */
export function useAppTheme() {
  const {
    isDark,
    accent,
    bg,
    panel,
    surface,
    border,
    fg,
    muted,
    radius,
    font,
    headerFont,
    shadow,
    btnShadow,
    style,
    setTheme,
    setStyle,
  } = useTheme();

  /** Tracks the label of the last-applied colour preset, so the UI can
   *  show it as selected even when dark-mode auto-computation causes the
   *  computed colours to differ from the preset's light values. Cleared
   *  when any individual colour setter fires. */
  const [matchedPreset, setMatchedPreset] = createSignal<string | null>(null);

  return {
    isDark,
    accentColor: accent,
    bg,
    panel,
    surface,
    border,
    fg,
    muted,
    radius,
    bodyFont: font,
    headerFont,
    shadow,
    btnShadow,
    style,
    /** Raw passthrough — for presets that always write to light. */
    setTheme,
    /** Label of the last-applied colour preset (null if user tweaked colours). */
    matchedPreset,
    /** Exposed so ThemeCreator can set it when a colour preset is applied. */
    setMatchedPreset,

    /** Toggle mode. */
    setIsDark: (v: boolean) => setTheme({ dark: v }),
    /** Accent is a brand colour — always writes to both modes. */
    setAccentColor: (v: string) => setTheme({ light: { accent: v }, dark: { accent: v } }),

    // ── Mode-aware colour setters ──────────────────────────────────────
    setBg: (v: string) => {
      setTheme({ [isDark() ? 'dark' : 'light']: { bg: v } });
      setMatchedPreset(null);
    },
    setPanel: (v: string) => {
      setTheme({ [isDark() ? 'dark' : 'light']: { panel: v } });
      setMatchedPreset(null);
    },
    setSurface: (v: string) => {
      setTheme({ [isDark() ? 'dark' : 'light']: { surface: v } });
      setMatchedPreset(null);
    },
    setBorder: (v: string) => {
      setTheme({ [isDark() ? 'dark' : 'light']: { border: v } });
      setMatchedPreset(null);
    },
    setFg: (v: string) => {
      setTheme({ [isDark() ? 'dark' : 'light']: { fg: v } });
      setMatchedPreset(null);
    },
    setMuted: (v: string) => {
      setTheme({ [isDark() ? 'dark' : 'light']: { muted: v } });
      setMatchedPreset(null);
    },

    // ── Global non-colour setters ──────────────────────────────────────
    setRadius: (v: string) => setTheme({ light: { radius: v }, dark: { radius: v } }),
    setBodyFont: (v: any) => setTheme({ light: { font: v }, dark: { font: v } }),
    setHeaderFont: (v: any) => setTheme({ light: { headerFont: v }, dark: { headerFont: v } }),
    setShadow: (v: any) => setTheme({ light: { shadow: v }, dark: { shadow: v } }),
    setBtnShadow: (v: any) => setTheme({ light: { btnShadow: v }, dark: { btnShadow: v } }),

    /** Apply a style preset — non-colour fields go to both modes. */
    applyPreset: (name: StylePreset) => {
      const p = STYLE_PRESETS[name];
      setTheme({
        light: {
          radius: p.radius,
          shadow: p.shadow as any,
          headerFont: p.headerFont as any,
          font: p.bodyFont as any,
          btnShadow: p.shadow as any,
        },
        dark: {
          radius: p.radius,
          shadow: p.shadow as any,
          headerFont: p.headerFont as any,
          font: p.bodyFont as any,
          btnShadow: p.shadow as any,
        },
      });
      setStyle(name);
    },
  };
}
