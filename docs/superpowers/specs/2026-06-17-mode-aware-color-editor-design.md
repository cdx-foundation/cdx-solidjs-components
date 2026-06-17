# Mode-Aware Color Editor

**Date:** 2026-06-17
**Status:** Approved (design)

## Goal

Make the ThemeCreator's color palette independently customizable for light and dark themes, instead of always setting both modes to the same value.

## Current State

- `demo/src/hooks/useAppTheme.ts` color setters call `setTheme({ light: { k: v }, dark: { k: v } })` — always writes to both modes simultaneously
- `demo/src/components/ThemeCreator.tsx` color presets apply to both modes via individual setters
- The library (`lib/hooks/useTheme.ts`) already supports separate `light`/`dark` overrides and auto-computes dark colors from light values via `toDark()`, but the demo's setters bypass this

## Changes

### 1. Mode-aware color setters (`useAppTheme.ts`)

| Setter                                                                   | Current         | New                                                                                       |
| ------------------------------------------------------------------------ | --------------- | ----------------------------------------------------------------------------------------- |
| `setBg`, `setPanel`, `setSurface`, `setBorder`, `setFg`, `setMuted`      | Sets both modes | Sets only the **active** mode (via computed property key `[isDark() ? 'dark' : 'light']`) |
| `setAccentColor`                                                         | Both modes      | Both modes (unchanged — accent is a brand color, not mode-specific)                       |
| `setRadius`, `setBodyFont`, `setHeaderFont`, `setShadow`, `setBtnShadow` | Both modes      | Both modes (unchanged — non-color fields are design properties)                           |

### 2. Visual mode indicator (`ThemeCreator.tsx`)

- "Custom Colors" collapsible trigger shows a tag badge: `Editing: Light` / `Editing: Dark`
- Tag automatically reflects the current active mode

### 3. Color presets always set light colors (`ThemeCreator.tsx`)

- `applyColorPreset` calls `theme.setTheme({ light: preset.colors })` directly (bypasses mode-aware setters since `setTheme` is exposed from `useAppTheme`)
- Dark mode auto-computes from the new light values
- Existing `p.dark` overrides remain in place. If the user had explicit dark overrides from previous manual edits, those will persist and take precedence over auto-computation for the fields they cover.

### 4. "Copy Light Colors to Dark" button (`ThemeCreator.tsx`)

- Added in the Appearance section (near the Light/Dark toggle)
- On click: reads the current computed light colors (bg, panel, surface, border, fg, muted) and writes them as explicit `p.dark` overrides
- Uses `toDark()` (exported from `lib/hooks/useTheme.ts`) to compute appropriate dark equivalents
- Visually: no change when clicking in dark mode (dark already showed auto-computed values); in light mode, clicking then toggling to dark shows the frozen values
- Effect: future light-mode color changes won't affect the dark palette (overrides are locked in)

### 5. Export `toDark()` from `useTheme.ts`

- Make `toDark()` a public export so `ThemeCreator.tsx` can use it for the copy-light-to-dark feature

## Types

ThemeCreator's `ColorPreset.colors` (defined in `demo/src/theme-constants.ts`) remains `{ bg, panel, surface, border, fg, muted }`.

`useAppTheme` return type gains `setTheme` passthrough (typed as `(config: Partial<Theme> | DualThemeConfig) => void`).

## Testing

- Existing `useTheme.test.ts` tests already cover auto-computation, explicit dark overrides, and versioning
- No new tests needed for this change (it's demo-layer UX, not library behavior). Verify manually in the browser: toggle modes, pick presets, adjust individual colors, copy light to dark.
