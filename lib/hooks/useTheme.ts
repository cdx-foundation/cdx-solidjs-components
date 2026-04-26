import { createPrefersDark } from '@solid-primitives/media';
import { makePersisted } from '@solid-primitives/storage';
import { type Accessor, type Setter, createEffect, createSignal } from 'solid-js';

export type ThemeState = {
  isDark: Accessor<boolean>;
  setIsDark: Setter<boolean>;
  toggleTheme: () => void;
};

/**
 * Manages the application's theme state (dark mode).
 * Persists preferences to localStorage and syncs with the DOM.
 *
 * @example
 * ```tsx
 * const { isDark, toggleTheme } = useTheme();
 * ```
 */
export function useTheme(): ThemeState {
  const prefersDark = createPrefersDark();

  const [isDark, setIsDark] = makePersisted(createSignal(prefersDark()), {
    name: 'startling-theme',
  });

  // Sync dark mode class and color-scheme to <html>
  createEffect(() => {
    const root = document.documentElement;
    const dark = isDark();
    root.classList.toggle('dark', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
  });

  const toggleTheme = () => setIsDark(!isDark());

  return { isDark, setIsDark, toggleTheme };
}
