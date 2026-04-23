import { createPrefersDark } from '@solid-primitives/media';
import { makePersisted } from '@solid-primitives/storage';
import { createEffect, createSignal } from 'solid-js';

/**
 * Manages the application's theme state (dark mode + accent color).
 * Persists preferences to localStorage and syncs with the DOM.
 *
 * @example
 * ```tsx
 * const { isDark, toggleTheme, accentColor, setAccentColor } = useTheme();
 * ```
 */
export function useTheme() {
  const prefersDark = createPrefersDark();

  const [isDark, setIsDark] = makePersisted(createSignal(prefersDark()), {
    name: 'startling-theme',
  });

  const [accentColor, setAccentColor] = makePersisted(createSignal('#c62828'), {
    name: 'startling-accent',
  });

  // Sync dark mode class to <html>
  createEffect(() => {
    const root = document.documentElement;
    if (isDark()) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  });

  // Sync accent color CSS variable
  createEffect(() => {
    document.documentElement.style.setProperty('--primary-color', accentColor());
  });

  const toggleTheme = () => setIsDark(!isDark());

  return { isDark, setIsDark, accentColor, setAccentColor, toggleTheme };
}
