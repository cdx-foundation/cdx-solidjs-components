# Mode-Aware Color Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ThemeCreator's color palette independently customizable for light and dark themes.

**Architecture:** Three files change: `useTheme.ts` (export `toDark`), `useAppTheme.ts` (mode-aware color setters, expose `setTheme`), and `ThemeCreator.tsx` (presets set light only, mode indicator badge, copy-light-to-dark button). The library's `computeTheme` already supports separate `p.light`/`p.dark` branches and auto-computation — this just wires up the demo UI to use them independently.

**Tech Stack:** SolidJS, TypeScript, Vite, TailwindCSS

---

### Task 1: Export `toDark()` from `useTheme.ts`

**Files:**

- Modify: `lib/hooks/useTheme.ts:140-145`

- [ ] **Step 1: Add `export` to `toDark`**

In `lib/hooks/useTheme.ts`, line 140, change the function declaration from:

```ts
function toDark(hex: string): string {
```

to:

```ts
export function toDark(hex: string): string {
```

- [ ] **Step 2: Add `toDark` to the public type exports**

At line 7, add `toDark` to the export:

```ts
export type { ShadowLevel, ThemeFont };
```

becomes:

```ts
export type { ShadowLevel, ThemeFont };
export { toDark };
```

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: exits clean (no output)

- [ ] **Step 4: Commit**

```bash
git add lib/hooks/useTheme.ts
git commit -m "feat(theme): export toDark() for external use"
```

---

### Task 2: Mode-aware color setters in `useAppTheme.ts`

**Files:**

- Modify: `demo/src/hooks/useAppTheme.ts`

- [ ] **Step 1: Rewrite `useAppTheme.ts`**

Replace the entire file content with:

```ts
import { useTheme, toDark } from '../../../lib/hooks/useTheme';
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
    /** Read passthrough — for presets that always write to light. */
    setTheme,

    /** Toggle mode. */
    setIsDark: (v: boolean) => setTheme({ dark: v }),
    /** Accent is a brand colour — always writes to both modes. */
    setAccentColor: (v: string) => setTheme({ light: { accent: v }, dark: { accent: v } }),

    // ── Mode-aware colour setters ──────────────────────────────────────
    setBg: (v: string) => setTheme({ [isDark() ? 'dark' : 'light']: { bg: v } }),
    setPanel: (v: string) => setTheme({ [isDark() ? 'dark' : 'light']: { panel: v } }),
    setSurface: (v: string) => setTheme({ [isDark() ? 'dark' : 'light']: { surface: v } }),
    setBorder: (v: string) => setTheme({ [isDark() ? 'dark' : 'light']: { border: v } }),
    setFg: (v: string) => setTheme({ [isDark() ? 'dark' : 'light']: { fg: v } }),
    setMuted: (v: string) => setTheme({ [isDark() ? 'dark' : 'light']: { muted: v } }),

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
```

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`
Expected: exits clean (no output)

- [ ] **Step 3: Commit**

```bash
git add demo/src/hooks/useAppTheme.ts
git commit -m "feat(demo): mode-aware colour setters in useAppTheme"
```

---

### Task 3: Color presets use `setTheme({ light })` and add mode indicator in ThemeCreator

**Files:**

- Modify: `demo/src/components/ThemeCreator.tsx`

- [ ] **Step 1: Change `applyColorPreset` to use `setTheme({ light })`**

Find `applyColorPreset` (lines 94-102) and replace with:

```ts
/** Apply a named colour preset — always sets light colours; dark auto-derives. */
const applyColorPreset = (preset: (typeof COLOR_PRESETS)[number]) => {
  theme.setTheme({ light: { ...preset.colors } });
};
```

- [ ] **Step 2: Add mode indicator badge to "Custom Colors" collapsible trigger**

Find the `Collapsible` for custom colors (around line 315) and update the `CollapsibleTrigger`:

Old:

```tsx
          <Collapsible class="space-y-4">
            <CollapsibleTrigger class="flex items-center gap-1.5 text-[10px] text-muted hover:text-fg transition-colors uppercase tracking-widest font-bold">
              <Palette size={10} />
              Custom Colors
            </CollapsibleTrigger>
```

New:

```tsx
          <Collapsible class="space-y-4">
            <CollapsibleTrigger class="flex items-center gap-1.5 text-[10px] text-muted hover:text-fg transition-colors uppercase tracking-widest font-bold">
              <Palette size={10} />
              Custom Colors
              <span class="ml-2 px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full border border-stroke bg-surface/60 text-muted">
                Editing: {theme.isDark() ? 'Dark' : 'Light'}
              </span>
            </CollapsibleTrigger>
```

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: exits clean (no output)

- [ ] **Step 4: Commit**

```bash
git add demo/src/components/ThemeCreator.tsx
git commit -m "feat(demo): presets set light only, add mode badge in ThemeCreator"
```

---

### Task 4: Add "Copy Light Colors to Dark" button

**Files:**

- Modify: `demo/src/components/ThemeCreator.tsx`

- [ ] **Step 1: Add `toDark` import at the top of ThemeCreator.tsx**

Add to the existing imports (around line 54):

```ts
import { toDark } from '../../../lib/hooks/useTheme';
```

- [ ] **Step 2: Add the copy handler and button in the Appearance section**

Find the Appearance section (around line 487, the one labeled `Appearance` with Light/Dark buttons). After the Light/Dark button grid, add:

```tsx
<button
  type="button"
  onClick={() => {
    theme.setTheme({
      dark: {
        bg: toDark(theme.bg()),
        panel: toDark(theme.panel()),
        surface: toDark(theme.surface()),
        border: toDark(theme.border()),
        fg: toDark(theme.fg()),
        muted: toDark(theme.muted()),
      },
    });
  }}
  class="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-md border border-stroke bg-surface/50 text-[9px] font-bold text-muted hover:text-fg hover:border-muted transition-all"
>
  Copy Light Colors to Dark
</button>
```

The full Appearance section should look like:

```tsx
<div class="space-y-3">
  <Label class="text-[10px] font-bold uppercase tracking-widest text-muted">Appearance</Label>
  <div class="grid grid-cols-2 gap-2">
    <Button
      variant={!theme.isDark() ? 'primary' : 'secondary'}
      size="sm"
      onClick={() => theme.setIsDark(false)}
      class="h-8 text-[10px] font-bold"
    >
      Light
    </Button>
    <Button
      variant={theme.isDark() ? 'primary' : 'secondary'}
      size="sm"
      onClick={() => theme.setIsDark(true)}
      class="h-8 text-[10px] font-bold"
    >
      Dark
    </Button>
  </div>
  <button
    type="button"
    onClick={() => {
      theme.setTheme({
        dark: {
          bg: toDark(theme.bg()),
          panel: toDark(theme.panel()),
          surface: toDark(theme.surface()),
          border: toDark(theme.border()),
          fg: toDark(theme.fg()),
          muted: toDark(theme.muted()),
        },
      });
    }}
    class="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-md border border-stroke bg-surface/50 text-[9px] font-bold text-muted hover:text-fg hover:border-muted transition-all"
  >
    Copy Light Colors to Dark
  </button>
</div>
```

- [ ] **Step 3: Run typecheck**

Run: `bun run typecheck`
Expected: exits clean (no output)

- [ ] **Step 4: Commit**

```bash
git add demo/src/components/ThemeCreator.tsx
git commit -m "feat(demo): add Copy Light Colors to Dark button"
```

---

### Task 5: Verify

- [ ] **Step 1: Run test suite**

Run: `bun run test`
Expected: All 116 tests pass. Any failures are related to our changes — fix before proceeding.

- [ ] **Step 2: Run build**

Run: `bun run --bun build`
Expected: Build succeeds (ESM + CJS output).

- [ ] **Step 3: Start dev server and check it loads**

Run: `bun run dev`

Verify in browser:

- Toggle Light/Dark — color picker values change (auto-computed dark)
- Adjust a color in dark mode — dark override is set; toggle to light — light color is unchanged
- Apply a color preset — light colors change; toggle to dark — dark auto-computes
- Click "Copy Light Colors to Dark" — toggle to dark — dark values are frozen explicit overrides
- The "Editing: Light / Dark" badge shows the correct mode on the collapsible trigger

- [ ] **Step 4: Kill dev server and commit any final fixes**

```bash
git status
git add -A
git commit -m "chore: final verification fixes"
```
