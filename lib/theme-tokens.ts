export type ThemeFont =
  | 'sans'
  | 'mono'
  | 'serif'
  | 'display'
  | 'system'
  | 'modern'
  | 'reading'
  | 'geometric'
  | 'condensed'
  | 'soft-serif'
  | 'oxanium';

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'neo' | 'flat' | 'hard';

export const SHADOWS: Record<ShadowLevel, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  neo: '2px 2px 0px 0px var(--stroke)',
  flat: '4px 4px 0px 0px var(--stroke)',
  hard: '6px 6px 0px 0px var(--fg-main)',
};

export const FONTS: Record<ThemeFont, string> = {
  sans: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  serif: '"Playfair Display", Georgia, serif',
  display: '"Archivo Black", Impact, sans-serif',
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  modern: '"Space Grotesk", sans-serif',
  reading: '"Lexend", sans-serif',
  geometric: '"Outfit", sans-serif',
  condensed: '"Bebas Neue", sans-serif',
  'soft-serif': '"Fraunces", serif',
  oxanium: '"Oxanium", sans-serif',
};
