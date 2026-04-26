import { createPrefersDark } from '@solid-primitives/media';
import { type Accessor, type Setter, createSignal } from 'solid-js';

export type ThemeConfig = {
  isDark?: boolean;
};

export type ThemeState = {
  isDark: Accessor<boolean>;
  setIsDark: Setter<boolean>;
  toggleTheme: () => void;
};

/**
 * Minimal theme state manager focusing on dark/light mode.
 * The rest of theme configurations (accent colors, radii, etc.)
 * should be handled via CSS variables for better performance and simplicity.
 */
export function useTheme(initial: ThemeConfig = {}): ThemeState {
  const prefersDark = createPrefersDark();

  const [isDark, setIsDark] = createSignal(initial.isDark ?? prefersDark());

  const toggleTheme = () => setIsDark((prev) => !prev);

  return {
    isDark,
    setIsDark,
    toggleTheme,
  };
}
