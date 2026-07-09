# Theming

CDX Solid.js Components provides a powerful reactive theming system built on CSS custom properties and SolidJS signals. The `useTheme` hook lets you control colors, fonts, radii, and shadows at runtime — with `localStorage` persistence, dark-mode auto-derivation, FOUC prevention, and cross-tab sync.

---

## Quick Start

```tsx
import { useTheme } from '@cdx-foundation/cdx-solidjs-components/hooks';

function App() {
  const theme = useTheme();

  return <button onClick={theme.toggleTheme}>{theme.isDark() ? '☀️ Light' : '🌙 Dark'}</button>;
}
```

That's it. The hook injects CSS custom properties onto `<html>` reactively, and every component reads from those properties.

---

## The `useTheme` Hook

### Signature

```ts
function useTheme(config?: Partial<Theme> | DualThemeConfig): ThemeConfig;
```

Pass an optional initial config to seed the theme on first call. Subsequent calls return the same singleton instance (HMR-safe via `ensureReactives()`).

### Return Value (`ThemeConfig`)

| Property        | Type                    | Description                                            |
| --------------- | ----------------------- | ------------------------------------------------------ |
| `theme`         | `Accessor<Theme>`       | The full theme object (for serialization / bulk reads) |
| `isDark`        | `Accessor<boolean>`     | `true` when dark mode is active                        |
| `accent`        | `Accessor<string>`      | Hex primary accent color                               |
| `bg`            | `Accessor<string>`      | Hex application background                             |
| `panel`         | `Accessor<string>`      | Hex panel / card / modal background                    |
| `surface`       | `Accessor<string>`      | Hex subtle surface / hover background                  |
| `border`        | `Accessor<string>`      | Hex default border color                               |
| `fg`            | `Accessor<string>`      | Hex primary text / foreground color                    |
| `muted`         | `Accessor<string>`      | Hex muted / secondary text color                       |
| `radius`        | `Accessor<string>`      | Border radius string (e.g. `"12px"`)                   |
| `font`          | `Accessor<ThemeFont>`   | Body font family key                                   |
| `headerFont`    | `Accessor<ThemeFont>`   | Heading font family key                                |
| `shadow`        | `Accessor<ShadowLevel>` | Panel shadow level                                     |
| `btnShadow`     | `Accessor<ShadowLevel>` | Button shadow level                                    |
| `style`         | `Accessor<string>`      | Style preset name (defaults `"vega"`)                  |
| `setTheme`      | `(config) => void`      | Set theme from `Partial<Theme>` or `DualThemeConfig`   |
| `setLightTheme` | `(config) => void`      | Override light-mode values only                        |
| `setDarkTheme`  | `(config) => void`      | Override dark-mode values only                         |
| `toggleTheme`   | `() => void`            | Cycle: `system` → `dark` → `light` → `system`          |
| `setStyle`      | `(v: string) => void`   | Set the style preset name                              |

---

## Theme Types

### `Theme`

```ts
type Theme = {
  dark: boolean;
  accent: string; // Primary accent color (hex)
  bg: string; // Application background
  panel: string; // Panel / card / modal background
  surface: string; // Subtle surface / hover states
  border: string; // Default border color
  fg: string; // Primary text / foreground color
  muted: string; // Muted / secondary text color
  radius: string; // Unified border radius (e.g. "12px")
  font: ThemeFont; // Body text font
  headerFont: ThemeFont; // Heading / display font
  shadow: ShadowLevel; // Shadow level for panels
  btnShadow: ShadowLevel; // Shadow level for buttons
};
```

### `DualThemeConfig`

```ts
type DualThemeConfig = {
  light?: Partial<Theme>;
  dark?: Partial<Theme>;
};
```

### `ThemeFont`

```ts
type ThemeFont =
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
```

| Key          | Font Family                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| `sans`       | `"Inter", system-ui, sans-serif`                                               |
| `mono`       | `"JetBrains Mono", ui-monospace, monospace`                                    |
| `serif`      | `"Playfair Display", Georgia, serif`                                           |
| `display`    | `"Archivo Black", Impact, sans-serif`                                          |
| `system`     | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| `modern`     | `"Space Grotesk", sans-serif`                                                  |
| `reading`    | `"Lexend", sans-serif`                                                         |
| `geometric`  | `"Outfit", sans-serif`                                                         |
| `condensed`  | `"Bebas Neue", sans-serif`                                                     |
| `soft-serif` | `"Fraunces", serif`                                                            |
| `oxanium`    | `"Oxanium", sans-serif`                                                        |

### `ShadowLevel`

```ts
type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'neo' | 'flat' | 'hard';
```

| Level  | Shadow Value                                                          |
| ------ | --------------------------------------------------------------------- |
| `none` | `none`                                                                |
| `sm`   | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                       |
| `md`   | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`    |
| `lg`   | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`  |
| `xl`   | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` |
| `2xl`  | `0 25px 50px -12px rgb(0 0 0 / 0.25)`                                 |
| `neo`  | `4px 4px 0px 0px var(--stroke)`                                       |
| `flat` | `2px 2px 0px 0px var(--stroke)`                                       |
| `hard` | `6px 6px 0px 0px var(--fg-main)`                                      |

---

## Default Values

| Field        | Default   |
| ------------ | --------- |
| `dark`       | `false`   |
| `accent`     | `#6366f1` |
| `bg`         | `#ffffff` |
| `panel`      | `#ffffff` |
| `surface`    | `#f4f4f5` |
| `border`     | `#e4e4e7` |
| `fg`         | `#09090b` |
| `muted`      | `#71717a` |
| `radius`     | `12px`    |
| `font`       | `sans`    |
| `headerFont` | `sans`    |
| `shadow`     | `md`      |
| `btnShadow`  | `md`      |

---

## Usage Patterns

### Server-Fetched Theme → Client Apply

The intended primary pattern is to **fetch the theme configuration from your server** (e.g. a Lua backend) and apply it on startup. This allows the backend to control branding, accent colors, radii, fonts, and shadow levels dynamically per request or per tenant.

```tsx
import { useTheme } from '@cdx-foundation/cdx-solidjs-components/hooks';

function App() {
  const theme = useTheme();

  createEffect(async () => {
    const res = await fetch('/api/theme');
    const serverTheme = await res.json();
    theme.setTheme(serverTheme);
  });

  return <YourApp />;
}
```

**Server (Lua) endpoint example:**

```lua
-- themes.lua
local theme = {
  accent = "#c62828",
  bg     = "#ffffff",
  fg     = "#1a1a1a",
  radius = "0px",
  font   = "sans",
  shadow = "neo"
}
return theme
```

The JSON returned to the client is passed directly to `setTheme()`:

```ts
theme.setTheme({
  accent: '#c62828',
  bg: '#ffffff',
  fg: '#1a1a1a',
  radius: '0px',
  font: 'sans',
  shadow: 'neo',
});
```

### Light/Dark Dual Config

When your server wants to supply separate overrides for light and dark mode, return a `{ light, dark }` object:

```ts
theme.setTheme({
  light: { bg: '#ffffff', fg: '#1a1a1a', accent: '#c62828' },
  dark: { bg: '#0a0a0a', fg: '#f5f5f5', accent: '#ef5350' },
});
```

### Partial Overrides

You only need to include the values you want to override — everything else falls back to built-in defaults:

```ts
theme.setTheme({ accent: '#10b981' }); // just change the accent
```

### Toggle Cycle

`toggleTheme()` cycles through three modes:

```
system → dark → light → system → ...
```

- `system` follows the OS preference via `prefers-color-scheme`.
- `dark` forces dark mode.
- `light` forces light mode.

---

## Dark Mode Auto-Derivation

When you only configure light-mode values, dark-mode neutral colors (`bg`, `panel`, `surface`, `border`, `fg`, `muted`) are **auto-derived** via luminance inversion. The `toDark()` algorithm maps HSL lightness through three bands to preserve relative ordering so layered surfaces remain stratified:

- Lightness 70–100% (surfaces) → 6–20% in dark
- Lightness 40–70% (mid-tones) → proportionally inverted
- Lightness 0–40% (dark text) → 80–95% in dark

Non-color fields (`radius`, `font`, `shadow`, etc.) carry over unchanged. Explicit dark overrides via `setDarkTheme()` or `DualThemeConfig` take precedence over auto-derived values.

---

## FOUC Prevention

Block the first paint with a synchronously-evaluated inline script that reads the persisted theme from `localStorage` and applies CSS custom properties before any rendering:

```html
<head>
  <script>
    ${useTheme.getScript({ accent: '#c62828' })}
  </script>
</head>
```

`useTheme.getScript(defaults?)` generates a self-contained inline `<script>` string that:

1. Reads the persisted theme from `localStorage` under the `cdx_theme` key.
2. Auto-derives dark-mode colors via the same `toDark()` algorithm (generated via `.toString()` so it cannot diverge).
3. Sets CSS custom properties on `<html>` before first paint.

Pass optional defaults as the argument — these are applied before any persisted overrides. Place the script blocking in `<head>`.

---

## Persistence

Theme state persists to `localStorage` under the `cdx_theme` key. The persisted object shape:

```ts
interface PersistedTheme {
  version: number; // Schema version (currently 1) for forward-compatible migration
  mode: 'light' | 'dark' | 'system';
  light: Partial<ThemeStyles>; // Light-mode style overrides
  dark: Partial<ThemeStyles>; // Dark-mode style overrides
  style?: string; // Style preset name
}
```

- **Schema versioning:** Each entry carries a `version` number for forward-compatible schema migration. Stale data is discarded and defaults restored.
- **Cross-tab sync:** Handled automatically via the `storage` event — change the theme in one tab and all open tabs update.

---

## CSS Custom Properties

`useTheme` sets the following 16 CSS custom properties on `<html>`, which the `theme.css` `@theme` block maps to Tailwind tokens:

| CSS Variable      | Tailwind Token    | Description             |
| ----------------- | ----------------- | ----------------------- |
| `--primary-color` | `--color-primary` | Primary accent color    |
| `--bg-main`       | `--color-bg`      | Application background  |
| `--bg-panel`      | `--color-panel`   | Panel / card background |
| `--bg-surface`    | `--color-surface` | Subtle surface          |
| `--border-main`   | —                 | Default border color    |
| `--stroke`        | `--color-stroke`  | Stroke / border color   |
| `--fg-main`       | `--color-fg`      | Primary text color      |
| `--text-muted`    | —                 | Muted text color        |
| `--radius-card`   | `--radius-card`   | Card border radius      |
| `--radius-btn`    | `--radius-btn`    | Button border radius    |
| `--radius-input`  | `--radius-input`  | Input border radius     |
| `--radius-badge`  | `--radius-badge`  | Badge border radius     |
| `--display-main`  | `--font-display`  | Display font family     |
| `--sans-main`     | `--font-sans`     | Sans font family        |
| `--shadow-main`   | `--shadow-main`   | Panel shadow            |
| `--shadow-btn`    | `--shadow-btn`    | Button shadow           |

Derived tokens (computed at CSS level via `color-mix()`):

| Token                    | Derivation                                                  |
| ------------------------ | ----------------------------------------------------------- |
| `--color-primary-hover`  | `color-mix(in srgb, var(--color-primary), black 15%)`       |
| `--color-primary-alpha`  | `color-mix(in srgb, var(--color-primary), transparent 92%)` |
| `--color-primary-border` | `color-mix(in srgb, var(--color-primary), transparent 75%)` |

---

## Static Helper Methods

`useTheme` exposes static utility methods:

| Method               | Signature                                 | Description                                  |
| -------------------- | ----------------------------------------- | -------------------------------------------- |
| `useTheme.hexToHsl`  | `(hex: string): [number, number, number]` | Convert hex to HSL tuple                     |
| `useTheme.hslToHex`  | `(h, s, l): string`                       | Convert HSL to hex string                    |
| `useTheme.toDark`    | `(hex: string): string`                   | Auto-derive dark-mode color from a light hex |
| `useTheme.getScript` | `(defaults?: Partial<Theme>): string`     | Generate FOUC-prevention inline script       |

---

## Utility Classes

The `theme.css` file defines two custom utility classes in `@layer utilities`:

### `.clean-panel`

A themed panel surface with background, border, and card radius. Used by `Card`, `Modal`, `Sheet`, and other container components.

### `.hud`

A HUD (heads-up display) variant override block that sets CSS variables for a transparent background, white text, `Bebas Neue` display font, `0px` radii, and specific shadows. Also sets `pointer-events: none` for overlay-style displays.

---

## Complete Example

```tsx
import { createEffect } from 'solid-js';
import { Button, Modal } from '@cdx-foundation/cdx-solidjs-components';
import { useTheme } from '@cdx-foundation/cdx-solidjs-components/hooks';

export const MyComponent = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const theme = useTheme();

  // Fetch theme from server (Lua backend) on mount
  createEffect(async () => {
    const res = await fetch('/api/theme');
    const serverTheme = await res.json();
    theme.setTheme(serverTheme);
  });

  return (
    <div class="p-8">
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} title="Settings">
        <div class="p-4 space-y-4">
          <p>Configure your application preferences here.</p>
          <Button onClick={theme.toggleTheme}>
            Switch to {theme.isDark() ? 'Light' : 'Dark'} Mode
          </Button>
        </div>
      </Modal>
    </div>
  );
};
```
