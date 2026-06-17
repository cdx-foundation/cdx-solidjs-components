# useTheme API Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `useTheme` hook API to support per-project defaults, individual reactive accessors, docs-consistent naming (`isDark`/`toggleTheme`), and mode-scoped convenience setters (`setLightTheme`/`setDarkTheme`).

**Architecture:** Singleton `makePersisted` signal at module scope remains; `useTheme(defaults?)` accepts an optional `Partial<Theme>` that overlays on first call (persisted localStorage always wins). New accessors derive from the single `theme` signal. `getScript(defaults?)` accepts the same defaults shape for FOUC consistency.

**Tech Stack:** SolidJS, `@solid-primitives/media`, `@solid-primitives/storage`

---

### Task 1: Rewrite `lib/hooks/useTheme.ts`

**File:** `lib/hooks/useTheme.ts` (full rewrite)

- [ ] **Step 1: Update `ThemeConfig` type — add individual accessors, mode-scoped setters, rename `toggleDark` → `toggleTheme`**

Replace the current `ThemeConfig` type block (lines 25-30):

```ts
export type ThemeConfig = {
  /** Whether dark mode is active. */
  isDark: Accessor<boolean>;
  /** Primary accent color (hex). */
  accent: Accessor<string>;
  /** Named color palette. */
  base: Accessor<BaseColor>;
  /** Unified border radius for all elements. */
  radius: Accessor<string>;
  /** UI font stack. */
  font: Accessor<ThemeFont>;
  /** Shadow level for panels and buttons. */
  shadow: Accessor<ShadowLevel>;

  /** Full theme object (for serialization / bulk reads). */
  theme: Accessor<Theme>;

  /** Merge a partial theme or apply a dual-theme config ({ light, dark }). */
  setTheme: (config: Partial<Theme> | DualThemeConfig) => void;
  /** Apply overrides scoped to light mode. */
  setLightTheme: (config: Partial<Theme>) => void;
  /** Apply overrides scoped to dark mode. */
  setDarkTheme: (config: Partial<Theme>) => void;
  /** Toggle between dark and light mode. */
  toggleTheme: () => void;
};
```

- [ ] **Step 2: Rename `DEFAULT_THEME` → `BUILTIN_DEFAULTS`, add `defaultsApplied` guard**

Replace:

```ts
const DEFAULT_THEME: Theme = {
  dark: prefersDark(),
  accent: '#c62828',
  base: 'pure',
  radius: '0px',
  font: 'sans',
  shadow: 'none',
};
```

With (rename + keep same values):

```ts
const BUILTIN_DEFAULTS: Theme = {
  dark: prefersDark(),
  accent: '#c62828',
  base: 'pure',
  radius: '0px',
  font: 'sans',
  shadow: 'none',
};
```

Also update the `makePersisted` call on line 47:

```ts
const [theme, setThemeRaw] = makePersisted(createSignal<Theme>(BUILTIN_DEFAULTS), {
  name: 'starling-theme',
});
```

Add a module-level guard after `ensureThemeEffect()`:

```ts
// ─── Track whether project defaults have been applied ────────────────────────

let defaultsApplied = false;
```

- [ ] **Step 3: Rewrite `useTheme()` body — add `defaults` param, individual accessors, mode-scoped setters, rename `toggleDark`**

Replace the entire `useTheme` function (lines 111-128):

````ts
/**
 * Manages the full application theme via a single `Theme` object.
 * Call `setTheme` with your server response to apply it instantly.
 * The last applied theme is persisted to localStorage as a fallback.
 *
 * Accepts optional project-level defaults that merge over the built-in
 * values but are overridden by any persisted user preference.
 *
 * Use `useTheme.getScript()` as a blocking inline `<script>` in `<head>`
 * to prevent a flash of unstyled content (FOUC).
 *
 * @example
 * ```tsx
 * // With project defaults
 * const { isDark, toggleTheme, setTheme } = useTheme({ accent: '#6366f1' });
 *
 * // Apply a full theme from server
 * setTheme(await fetchTheme());
 *
 * // Mode-scoped overrides
 * setLightTheme({ accent: '#818cf8' });
 * ```
 */
export function useTheme(defaults?: Partial<Theme>): ThemeConfig {
  ensureThemeEffect();

  // Apply project defaults once (persisted localStorage already merged in signal)
  if (defaults && !defaultsApplied) {
    defaultsApplied = true;
    setThemeRaw((prev) => ({ ...BUILTIN_DEFAULTS, ...defaults, ...prev }));
  }

  return {
    theme,
    isDark: () => theme().dark,
    accent: () => theme().accent,
    base: () => theme().base,
    radius: () => theme().radius,
    font: () => theme().font,
    shadow: () => theme().shadow,

    setTheme: (config: Partial<Theme> | DualThemeConfig) => {
      setThemeRaw((prev) => {
        if ('light' in config || 'dark' in config) {
          const mode: 'light' | 'dark' = prev.dark ? 'dark' : 'light';
          const modeConfig = (config as DualThemeConfig)[mode];
          return modeConfig ? { ...prev, ...modeConfig } : prev;
        }
        return { ...prev, ...(config as Partial<Theme>) };
      });
    },

    setLightTheme: (config: Partial<Theme>) => {
      setThemeRaw((prev) => (prev.dark ? prev : { ...prev, ...config }));
    },

    setDarkTheme: (config: Partial<Theme>) => {
      setThemeRaw((prev) => (prev.dark ? { ...prev, ...config } : prev));
    },

    toggleTheme: () => {
      setThemeRaw((prev) => ({ ...prev, dark: !prev.dark }));
    },
  };
}
````

- [ ] **Step 4: Update `useTheme.getScript` — add `defaults` parameter**

Replace the entire `getScript` assignment (lines 142-166):

````ts
/**
 * Returns an inline script string that synchronously applies the persisted
 * theme before the first paint, preventing FOUC.
 *
 * Optionally accepts project-level defaults to match the runtime hook.
 *
 * ```html
 * <script><!-- paste output here --></script>
 * ```
 * Or in a meta-framework:
 * ```tsx
 * <script innerHTML={useTheme.getScript({ accent: '#6366f1' })} />
 * ```
 */
useTheme.getScript = (defaults?: Partial<Theme>): string => `(function(){
  var d=Object.assign({},${JSON.stringify(BUILTIN_DEFAULTS)},${JSON.stringify(defaults || {})});
  try{var s=localStorage.getItem('starling-theme');if(s)d=Object.assign(d,JSON.parse(s));}catch(e){}
  var palettes=${JSON.stringify(BASE_PALETTES)};
  var fonts=${JSON.stringify(FONTS)};
  var shadows=${JSON.stringify(SHADOWS)};
  var p=(palettes[d.base]||palettes.pure)[d.dark?'dark':'light'];
  var r=document.documentElement;
  r.classList.toggle('dark',d.dark);
  r.style.colorScheme=d.dark?'dark':'light';
  r.style.setProperty('--primary-color',d.accent);
  r.style.setProperty('--bg-main',p.bg);
  r.style.setProperty('--bg-panel',p.panel);
  r.style.setProperty('--bg-surface',p.surface);
  r.style.setProperty('--border-main',p.border);
  r.style.setProperty('--stroke',p.border);
  r.style.setProperty('--fg-main',p.fg);
  r.style.setProperty('--text-muted',p.muted);
  var rv=d.radius,fv=fonts[d.font]||fonts.sans,sv=shadows[d.shadow]||'none';
  ['--radius-card','--radius-btn','--radius-input','--radius-badge'].forEach(function(k){r.style.setProperty(k,rv);});
  r.style.setProperty('--display-main',fv);
  r.style.setProperty('--sans-main',fv);
  r.style.setProperty('--shadow-main',sv);
  r.style.setProperty('--shadow-btn',sv);
})();`;
````

Key changes from current: `d=DEFAULT_THEME=` becomes `d=Object.assign({},${JSON.stringify(BUILTIN_DEFAULTS)},${JSON.stringify(defaults || {})})` — the defaults are merged before localStorage is read.

- [ ] **Step 5: Verify the file compiles**

Run:

```bash
npx tsc --noEmit lib/hooks/useTheme.ts
```

Expected: no errors.

---

### Task 2: Update docs to match new API

- [ ] **Step 1: Update `docs/theming.md`**

File: `docs/theming.md`

Change the `useTheme` example block (lines 65-77) to match the new API:

````markdown
### Via `useTheme` Hook

Starling UI provides a built-in `useTheme` hook that manages the full application theme.

```tsx
import { useTheme } from 'cdx-solidjs-components/hooks';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return <Button onClick={toggleTheme}>Switch to {isDark() ? 'Light' : 'Dark'} Mode</Button>;
}
```
````

For project-specific defaults:

```tsx
import { useTheme } from 'cdx-solidjs-components/hooks';

const { accent, setLightTheme } = useTheme({ accent: '#6366f1', base: 'slate' });
```

Other theme properties like primary color, radii, and fonts should be managed via CSS variables as shown in the [Global CSS](#via-global-css) section.

````

- [ ] **Step 2: Update `docs/utilities.md`**

File: `docs/utilities.md`, lines 5-27.

Replace the current `useTheme` section with:

```markdown
## useTheme Hook

A reactive hook for managing the application's theme state with built-in persistence and DOM synchronization.

```tsx
import { useTheme } from 'cdx-solidjs-components/hooks';

export default function ThemeControl() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div class="flex flex-col gap-4">
      <p>Dark Mode: {isDark() ? 'Active' : 'Inactive'}</p>
      <Button onClick={toggleTheme}>Toggle Mode</Button>
    </div>
  );
}
````

### Features

- **System Sync:** Detects user OS preferences (e.g., `prefers-color-scheme`) on first load.
- **Persistence:** Automatically saves the user preference to `localStorage`.
- **DOM Integration:** Automatically toggles the `.dark` class on the `<html>` element and updates `color-scheme`.
- **Per-project defaults:** Pass a `Partial<Theme>` to `useTheme()` to set project-level base values.
- **Mode-scoped overrides:** Use `setLightTheme()` and `setDarkTheme()` for mode-specific customization.
- **Fine-grained reactivity:** Individual accessors (`accent()`, `base()`, `radius()`, `font()`, `shadow()`) for precise reactive dependencies.

````

---

### Task 3: Update README.md

**File:** `README.md`

- [ ] **Step 1: Update example usage (lines 82-108)**

Change the `useTheme` destructuring to align with the new API:

```tsx
const { isDark, toggleTheme } = useTheme();
// ...
<Button onClick={toggleTheme}>
  Switch to {isDark() ? "Light" : "Dark"} Mode
</Button>
````

(The current code on lines 87-103 already uses `isDark` and `toggleTheme` from `useTheme()` — verify it matches and update if needed.)

- [ ] **Step 2: Verify README is consistent**

Run:

```bash
grep -n "toggleDark\|setTheme\|\.dark\b" README.md
```

Expected: no mentions of the old `toggleDark` name.
