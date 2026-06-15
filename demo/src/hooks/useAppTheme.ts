import { createPrefersDark } from '@solid-primitives/media';
import { makePersisted } from '@solid-primitives/storage';
import { createSignal } from 'solid-js';
import type { BaseColor, ShadowLevel, StylePreset, ThemeFont } from '../theme-constants';

const prefersDark = createPrefersDark();

// Shared signals for the demo app
const [isDark, setIsDark] = makePersisted(createSignal(prefersDark()), {
  name: 'starling-theme',
});
const [accentColor, setAccentColor] = makePersisted(createSignal('#e11d48'), {
  name: 'starling-accent',
});
const [radius, setRadius] = makePersisted(createSignal('0.5rem'), { name: 'starling-radius' });
const [headerFont, setHeaderFont] = makePersisted(createSignal<ThemeFont>('sans'), {
  name: 'starling-header-font',
});
const [bodyFont, setBodyFont] = makePersisted(createSignal<ThemeFont>('sans'), {
  name: 'starling-body-font',
});
const [baseColor, setBaseColor] = makePersisted(createSignal<BaseColor>('zinc'), {
  name: 'starling-base',
});
const [shadow, setShadow] = makePersisted(createSignal<ShadowLevel>('sm'), {
  name: 'starling-shadow',
});
const [btnBoxShadow, setBtnBoxShadow] = makePersisted(createSignal<ShadowLevel>('none'), {
  name: 'starling-btn-shadow',
});
const [style, setStyle] = makePersisted(createSignal<StylePreset>('vega'), {
  name: 'starling-style',
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
    style,
    setStyle,
  };
}
