# Theming

Starling UI uses a CSS variable-based design system with a reactive `useTheme` hook that persists light/dark mode styles independently.

## CSS Variables

The library reads these CSS custom properties from `:root`:

### Colors

| Variable          | Source           |
| :---------------- | :--------------- |
| `--primary-color` | `accent`         |
| `--bg-main`       | `bg`             |
| `--bg-panel`      | `panel`          |
| `--bg-surface`    | `surface`        |
| `--border-main`   | `border`         |
| `--stroke`        | `border` (alias) |
| `--fg-main`       | `fg`             |
| `--text-muted`    | `muted`          |

### Typography

| Variable         | Source                  |
| :--------------- | :---------------------- |
| `--sans-main`    | `font` (body text)      |
| `--display-main` | `headerFont` (headings) |

### Radii

All four radius vars are set to the same `radius` value:

| Variable         |
| :--------------- |
| `--radius-card`  |
| `--radius-btn`   |
| `--radius-input` |
| `--radius-badge` |

### Shadows

| Variable        | Source                |
| :-------------- | :-------------------- |
| `--shadow-main` | `shadow` (panels)     |
| `--shadow-btn`  | `btnShadow` (buttons) |

## `useTheme` Hook

```tsx
import { useTheme } from 'cdx-solidjs-components/hooks';

function Component() {
  const { isDark, toggleTheme, setTheme, accent, bg } = useTheme();
  // ...
}
```

### Accessors

| Accessor       | Returns       | Description                                     |
| :------------- | :------------ | :---------------------------------------------- |
| `isDark()`     | `boolean`     | Whether dark mode is active                     |
| `accent()`     | `string`      | Primary accent color (hex)                      |
| `bg()`         | `string`      | Application background                          |
| `panel()`      | `string`      | Card/modal background                           |
| `surface()`    | `string`      | Subtle surface for hover/secondary areas        |
| `border()`     | `string`      | Default border color                            |
| `fg()`         | `string`      | Primary text color                              |
| `muted()`      | `string`      | Muted/secondary text color                      |
| `radius()`     | `string`      | Unified border radius                           |
| `font()`       | `ThemeFont`   | Body font name                                  |
| `headerFont()` | `ThemeFont`   | Heading/display font name                       |
| `shadow()`     | `ShadowLevel` | Panel shadow level                              |
| `btnShadow()`  | `ShadowLevel` | Button shadow level                             |
| `style()`      | `string`      | Style preset name (metadata, not mode-specific) |
| `theme()`      | `Theme`       | Full theme object                               |

### Methods

| Method          | Signature                                               | Description                              |
| :-------------- | :------------------------------------------------------ | :--------------------------------------- |
| `setTheme`      | `(config: Partial\<Theme\> \| DualThemeConfig) => void` | Update styles or toggle mode. See below. |
| `setLightTheme` | `(config: Partial\<Theme\>) => void`                    | Apply overrides to light mode only       |
| `setDarkTheme`  | `(config: Partial\<Theme\>) => void`                    | Apply overrides to dark mode only        |
| `toggleTheme`   | `() => void`                                            | Switch between light and dark mode       |
| `setStyle`      | `(v: string) => void`                                   | Update the style preset name             |

### `setTheme` Behaviour

**`Partial<Theme>`** — updates the current active mode's overrides. If `dark` is included, it also toggles the mode:

```tsx
// Update light-mode styles and stay in light mode
setTheme({ accent: '#6366f1', radius: '8px' });

// Toggle to dark mode
setTheme({ dark: true });

// Toggle to dark mode AND set dark-specific accent
setTheme({ dark: true, accent: '#818cf8' });
```

**`DualThemeConfig`** — sets light and dark overrides independently:

```tsx
setTheme({
  light: { bg: '#ffffff', accent: '#6366f1' },
  dark: { bg: '#0a0a0a', accent: '#818cf8' },
});
```

Dark mode toggle checks: `typeof (config as any).dark === 'object'` distinguishes `{ dark: true }` (mode toggle) from `{ dark: { accent: '...' } }` (DualThemeConfig).

### Project Defaults

Pass a partial `Theme` to `useTheme()` to set project-level defaults. These are applied once on the first call (lower priority than persisted localStorage):

```tsx
const theme = useTheme({ accent: '#6366f1', font: 'modern', radius: '8px' });
```

## Preventing FOUC

Include `useTheme.getScript()` as a blocking inline `<script>` in `<head>` to apply the persisted theme before the first paint:

```tsx
// In your HTML template or SSR
<script>{useTheme.getScript()}</script>
```

You can also pass project defaults that match the JS-side defaults:

```tsx
<script>{useTheme.getScript({ accent: '#6366f1' })}</script>
```

## ThemeFont

```tsx
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

## ShadowLevel

```tsx
type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'neo' | 'flat' | 'hard';
```

## Persisted Shape

The theme is serialised to `localStorage` (`cdx_theme` key) as:

```json
{
  "mode": "light",
  "light": { "accent": "#6366f1", "bg": "#ffffff", ... },
  "dark": { "accent": "#818cf8", "bg": "#0a0a0a", ... },
  "style": "vega"
}
```

Light and dark mode overrides are stored independently, so toggling never loses customizations.
