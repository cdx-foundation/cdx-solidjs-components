import { createPrefersDark } from '@solid-primitives/media';
import { makePersisted } from '@solid-primitives/storage';
import { createEffect, createSignal } from 'solid-js';
import {
  BASE_PALETTES,
  FONTS,
  SHADOWS,
  type BaseColor,
  type ShadowLevel,
  type ThemeFont,
  hexToRgb,
} from '../theme-constants';

const prefersDark = createPrefersDark();

// Shared signals for the demo app
const [isDark, setIsDark] = makePersisted(createSignal(prefersDark()), {
  name: 'starling-theme',
});
const [accentColor, setAccentColor] = makePersisted(createSignal('#e11d48'), {
  name: 'starling-accent',
});
const [radius, setRadius] = makePersisted(createSignal('0.5rem'), { name: 'starling-radius' });
const [headerFont, setHeaderFont] = makePersisted(createSignal<ThemeFont>('display'), {
  name: 'starling-header-font',
});
const [bodyFont, setBodyFont] = makePersisted(createSignal<ThemeFont>('sans'), {
  name: 'starling-body-font',
});
const [baseColor, setBaseColor] = makePersisted(createSignal<BaseColor>('pure'), {
  name: 'starling-base',
});
const [shadow, setShadow] = makePersisted(createSignal<ShadowLevel>('sm'), {
  name: 'starling-shadow',
});
const [btnBoxShadow, setBtnBoxShadow] = makePersisted(createSignal<ShadowLevel>('none'), {
  name: 'starling-btn-shadow',
});

// App-specific implementation logic (Effects)
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

  const isDarkVal = isDark();
  root.style.setProperty(
    '--ring-main',
    isDarkVal ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
  );
  root.style.setProperty(
    '--glass-border',
    isDarkVal ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
  );

  root.style.setProperty('--shadow-main', SHADOWS[shadow()]);
  root.style.setProperty('--shadow-btn', SHADOWS[btnBoxShadow()]);

  const r = radius();
  root.style.setProperty('--radius-card', r);
  root.style.setProperty('--radius-lg', r);
  root.style.setProperty('--radius-btn', `calc(${r} - 0.2rem)`);
  root.style.setProperty('--radius-input', `calc(${r} - 0.1rem)`);
  root.style.setProperty('--radius-badge', `calc(${r} - 0.3rem)`);

  root.style.setProperty('--sans-main', FONTS[bodyFont()]);
  root.style.setProperty('--display-main', FONTS[headerFont()]);
  root.style.setProperty('--mono-main', FONTS.mono);

  document.body.style.fontFamily = FONTS[bodyFont()];
});

/**
 * App-specific theme hook that returns the shared theme state.
 */
export function useAppTheme() {
  return {
    isDark,
    setIsDark,
    accentColor,
    setAccentColor,
    radius,
    setRadius,
    headerFont,
    setHeaderFont,
    bodyFont,
    setBodyFont,
    baseColor,
    setBaseColor,
    shadow,
    setShadow,
    btnBoxShadow,
    setBtnBoxShadow,
  };
}
