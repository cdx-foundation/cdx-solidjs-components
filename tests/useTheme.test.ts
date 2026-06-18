import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { FONTS, SHADOWS } from '../lib/theme-tokens';

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
function toDark(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  const dl =
    l >= 70
      ? 6 + ((100 - l) / 30) * 14
      : l >= 30
        ? 20 + ((70 - l) / 40) * 30
        : 80 + ((30 - l) / 30) * 16;
  return hslToHex(h, s * 0.55, dl);
}

let useTheme: (typeof import('../lib/hooks/useTheme'))['useTheme'];

beforeEach(async () => {
  localStorage.clear();
  vi.resetModules();
  const mod = await import('../lib/hooks/useTheme');
  useTheme = mod.useTheme;
});

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('calling useTheme with a config applies setTheme directly', () => {
    const theme = useTheme({ accent: '#direct', radius: '6px' });
    expect(theme.accent()).toBe('#direct');
    expect(theme.radius()).toBe('6px');

    // DualThemeConfig also works
    const theme2 = useTheme({ light: { accent: '#dual' }, dark: { accent: '#darkacc' } });
    expect(theme2.accent()).toBe('#dual');
    theme2.setTheme({ dark: true });
    expect(theme2.accent()).toBe('#darkacc');
  });

  it('setTheme with Partial<Theme> updates accessors', () => {
    const theme = useTheme();
    theme.setTheme({ accent: '#ff0000', bg: '#f0f0f0' });
    expect(theme.accent()).toBe('#ff0000');
    expect(theme.bg()).toBe('#f0f0f0');
  });

  it('setTheme dark flag toggles mode and scopes styles', () => {
    const theme = useTheme();
    theme.setTheme({ dark: true, accent: '#darkacc' });
    expect(theme.isDark()).toBe(true);
    expect(theme.accent()).toBe('#darkacc');

    theme.setTheme({ dark: false, accent: '#lightacc' });
    expect(theme.isDark()).toBe(false);
    expect(theme.accent()).toBe('#lightacc');
  });

  it('setTheme with DualThemeConfig applies mode-specific overrides', () => {
    const theme = useTheme();
    theme.setTheme({
      light: { bg: '#ffffff', accent: '#light' },
      dark: { bg: '#000000', accent: '#dark' },
    });

    theme.setTheme({ dark: false });
    expect(theme.bg()).toBe('#ffffff');
    expect(theme.accent()).toBe('#light');

    theme.setTheme({ dark: true });
    expect(theme.bg()).toBe('#000000');
    expect(theme.accent()).toBe('#dark');
  });

  it('light colour changes propagate to dark mode via auto-computation', () => {
    const theme = useTheme();
    theme.setTheme({ dark: false });

    // Set custom light colours
    theme.setLightTheme({ fg: '#111111', bg: '#eeeeee' });

    // Light mode shows custom values
    expect(theme.fg()).toBe('#111111');
    expect(theme.bg()).toBe('#eeeeee');

    // Dark mode auto-computes from the new light values
    theme.setTheme({ dark: true });
    expect(theme.fg()).toBe(toDark('#111111'));
    expect(theme.bg()).toBe(toDark('#eeeeee'));
  });

  it('setDarkTheme overrides auto-computed dark values', () => {
    const theme = useTheme();

    // Set a light value as base
    theme.setLightTheme({ fg: '#111111' });

    // Explicit dark override takes precedence over auto-computed
    theme.setDarkTheme({ fg: '#customdark' });

    theme.setTheme({ dark: true });
    expect(theme.fg()).toBe('#customdark');
  });

  it('setDarkTheme does not affect light mode', () => {
    const theme = useTheme();
    const initialBg = theme.bg();

    theme.setDarkTheme({ fg: '#darkfg' });

    theme.setTheme({ dark: false });
    expect(theme.bg()).toBe(initialBg);
  });

  it('non-colour fields (radius, font, shadow) carry over from light to dark', () => {
    const theme = useTheme();

    // Set non-colour fields via setLightTheme (they go into p.light)
    theme.setLightTheme({ radius: '6px', font: 'mono', shadow: 'xl' });

    // These aren't auto-computed — they carry over as-is to dark mode
    theme.setTheme({ dark: true });
    expect(theme.radius()).toBe('6px');
    expect(theme.font()).toBe('mono');
    expect(theme.shadow()).toBe('xl');

    // Switching back preserves them in light mode
    theme.setTheme({ dark: false });
    expect(theme.radius()).toBe('6px');
    expect(theme.font()).toBe('mono');
  });

  it('toggleTheme flips dark mode', () => {
    const theme = useTheme();
    const initial = theme.isDark();

    theme.toggleTheme();
    expect(theme.isDark()).toBe(!initial);

    theme.toggleTheme();
    expect(theme.isDark()).toBe(initial);
  });

  it('setStyle sets the style metadata', () => {
    const theme = useTheme();
    theme.setStyle('retro');
    expect(theme.style()).toBe('retro');
  });

  it('persists state to localStorage with version', () => {
    const theme = useTheme();
    theme.setTheme({ accent: '#store', radius: '6px' });
    theme.setStyle('modern');

    const saved = JSON.parse(localStorage.getItem('cdx_theme') || '{}');
    expect(saved.version).toBe(1);
    expect(saved.light.accent).toBe('#store');
    expect(saved.style).toBe('modern');
  });

  it('discards stale localStorage when version mismatches', async () => {
    localStorage.clear();
    localStorage.setItem(
      'cdx_theme',
      JSON.stringify({
        mode: 'dark',
        light: {},
        dark: { accent: '#old' },
      }),
    );

    // Fresh module import triggers makePersisted → deserialize,
    // which should reject data without matching version → return defaults
    vi.resetModules();
    const { useTheme: freshTheme } = await import('../lib/hooks/useTheme');

    const theme = freshTheme();
    // Default accent (no '#old'), and first mutation writes version
    expect(theme.accent()).toBe('#6366f1');
    theme.setDarkTheme({ bg: '#fresh' });

    const saved = JSON.parse(localStorage.getItem('cdx_theme') || '{}');
    expect(saved.version).toBe(1);
    expect(saved.dark.accent).toBeUndefined();
    expect(saved.dark.bg).toBe('#fresh');
  });

  it('applies CSS custom properties on document.documentElement', () => {
    const theme = useTheme();
    const root = document.documentElement;

    theme.setTheme({
      accent: '#abc123',
      bg: '#def456',
      radius: '4px',
      font: 'oxanium',
      shadow: 'xl',
      btnShadow: 'neo',
    });

    expect(root.style.getPropertyValue('--primary-color')).toBe('#abc123');
    expect(root.style.getPropertyValue('--bg-main')).toBe('#def456');
    expect(root.style.getPropertyValue('--radius-card')).toBe('4px');
    expect(root.style.getPropertyValue('--radius-btn')).toBe('4px');
    expect(root.style.getPropertyValue('--radius-input')).toBe('4px');
    expect(root.style.getPropertyValue('--radius-badge')).toBe('4px');
    expect(root.style.getPropertyValue('--sans-main')).toBe(FONTS.oxanium);
    expect(root.style.getPropertyValue('--shadow-main')).toBe(SHADOWS.xl);
    expect(root.style.getPropertyValue('--shadow-btn')).toBe(SHADOWS.neo);
  });

  it('useTheme.getScript returns an inline script IIFE with version check and toDark', () => {
    const script = useTheme.getScript();
    expect(typeof script).toBe('string');
    expect(script.startsWith('(function(){')).toBe(true);
    expect(script.endsWith('})();')).toBe(true);
    expect(script).toContain('var v=1;');
    expect(script).toContain('p.version===v');
    expect(script).toContain('cdx_theme');
    expect(script).toContain('toDark(');
    expect(script).toContain('--primary-color');
    expect(script).toContain('--bg-main');
    expect(script).toContain('--fg-main');
    expect(script).toContain('--shadow-btn');
    expect(script).toContain('--display-main');
  });

  it('getScript accepts user defaults', () => {
    const script = useTheme.getScript({ accent: '#ff0000' });
    expect(script).toContain('#ff0000');
  });

  it('exposes a theme() accessor returning the full Theme object', () => {
    const theme = useTheme();
    const full = theme.theme();
    expect(full).toHaveProperty('accent');
    expect(full).toHaveProperty('bg');
    expect(full).toHaveProperty('panel');
    expect(full).toHaveProperty('surface');
    expect(full).toHaveProperty('border');
    expect(full).toHaveProperty('fg');
    expect(full).toHaveProperty('muted');
    expect(full).toHaveProperty('radius');
    expect(full).toHaveProperty('font');
    expect(full).toHaveProperty('headerFont');
    expect(full).toHaveProperty('shadow');
    expect(full).toHaveProperty('btnShadow');
    expect(full).toHaveProperty('dark');
  });

  it('accessor functions all return string values except isDark/theme', () => {
    const theme = useTheme();
    expect(typeof theme.isDark()).toBe('boolean');
    expect(typeof theme.accent()).toBe('string');
    expect(typeof theme.bg()).toBe('string');
    expect(typeof theme.panel()).toBe('string');
    expect(typeof theme.surface()).toBe('string');
    expect(typeof theme.border()).toBe('string');
    expect(typeof theme.fg()).toBe('string');
    expect(typeof theme.muted()).toBe('string');
    expect(typeof theme.radius()).toBe('string');
    expect(typeof theme.font()).toBe('string');
    expect(typeof theme.headerFont()).toBe('string');
    expect(typeof theme.shadow()).toBe('string');
    expect(typeof theme.btnShadow()).toBe('string');
    expect(typeof theme.style()).toBe('string');
    expect(typeof theme.theme()).toBe('object');
  });
});
