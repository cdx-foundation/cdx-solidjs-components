# useTheme API Redesign

**Date:** 2026-06-15
**Status:** Approved

## Motivation

The `useTheme` hook manages the full application theme (dark mode, accent color, base palette, radius, font, shadow) but has several problems that prevent clean reuse across multiple projects:

1. **No per-project defaults** — the hook hardcodes its defaults (`accent: '#c62828'`, `base: 'pure'`, etc.), so every consumer project that wants a different baseline must override at runtime or fork the component library.
2. **Docs/code API mismatch** — docs advertise `{ isDark, toggleTheme }` but the code returns `{ theme, setTheme, toggleDark }`.
3. **No mode-scoped setters** — `setTheme` accepts `DualThemeConfig` but there's no ergonomic way to clearly say "set this only for dark mode" / "set this only for light mode."
4. **No individual reactive accessors** — consumers must use `theme().accent` rather than `accent()`, losing granular reactivity in Solid computations.

## Design

### Scope

Keep the same six theme dimensions:
- `dark` — dark/light mode boolean
- `accent` — primary accent color (hex)
- `base` — named color palette (`zinc`, `slate`, `stone`, `pure`, etc.)
- `radius` — unified border radius
- `font` — named font stack (`sans`, `mono`, `serif`, etc.)
- `shadow` — shadow level (`none`, `sm`, `md`, `lg`, etc.)

### Types (unchanged)

```ts
export type Theme = {
  dark: boolean;
  accent: string;
  base: BaseColor;
  radius: string;
  font: ThemeFont;
  shadow: ShadowLevel;
};

export type DualThemeConfig = { light: Partial<Theme>; dark: Partial<Theme> };
```

### Hook return type

```ts
export type ThemeConfig = {
  // Individual reactive accessors
  isDark: Accessor<boolean>;
  accent: Accessor<string>;
  base: Accessor<BaseColor>;
  radius: Accessor<string>;
  font: Accessor<ThemeFont>;
  shadow: Accessor<ShadowLevel>;

  // Full theme accessor (for serialization / bulk reads)
  theme: Accessor<Theme>;

  // Mutators
  setTheme: (config: Partial<Theme> | DualThemeConfig) => void;
  setLightTheme: (config: Partial<Theme>) => void;
  setDarkTheme: (config: Partial<Theme>) => void;
  toggleTheme: () => void;
};
```

### Hook signature

```ts
export function useTheme(defaults?: Partial<Theme>): ThemeConfig;
```

### Static FOUC-prevention script

```ts
useTheme.getScript = (defaults?: Partial<Theme>): string;
```

Each project inlines in `<head>`:

```html
<script>{useTheme.getScript({ accent: '#2563eb', base: 'slate' })}</script>
```

### Defaults cascade

```
Built-in defaults (hardcoded)
       │
       ▼  merge (shallow)
Project defaults (via useTheme(param) / getScript param)
       │
       ▼  merge (shallow)
localStorage rehydration (via makePersisted)
       │
       ▼
Resolved Theme signal
```

- Higher layers win: localStorage > project defaults > built-in.
- A returning user's saved preferences are never trampled by project defaults.

### Behavior

| Method | Effect |
|---|---|
| `setTheme({ accent: '#foo' })` | Merge overrides into current theme regardless of mode |
| `setTheme({ light: { accent: '#' }, dark: { accent: '#' } })` | Mode-aware: applies only the current mode's overrides |
| `setLightTheme({ accent: '#foo' })` | Sugar for `setTheme({ light: { accent: '#foo' } })` |
| `setDarkTheme({ base: 'oled' })` | Sugar for `setTheme({ dark: { base: 'oled' } })` |
| `toggleTheme()` | Flips `dark` boolean, previously named `toggleDark` |

### Backward compatibility

- Old persisted localStorage key (`starling-theme`) is preserved.
- `getScript()` called without arguments behaves identically to today (uses built-in defaults).
- Existing consumers of `{ theme, setTheme, toggleDark }` will break on the rename. This is acceptable — the whole point is to unify the API.

## Naming conventions

- `is` prefix for booleans (`isDark`).
- `set` prefix for mutations (`setTheme`, `setLightTheme`, `setDarkTheme`).
- `toggle` prefix for binary flips (`toggleTheme`).
- Individual accessors are just the property name (`accent`, `base`, `radius`, `font`, `shadow`).

## Not in scope

- Per-component theming (kept in CSS variables).
- CSS variable injection beyond what `applyTheme` already does.
- Context provider pattern — the singleton approach via `makePersisted` is sufficient for a global theme.
