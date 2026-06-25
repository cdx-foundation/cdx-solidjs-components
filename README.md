# CDX Solid.js Components

[![npm](https://img.shields.io/npm/v/@cdx-foundation/cdx-solidjs-components)](https://www.npmjs.com/package/@cdx-foundation/cdx-solidjs-components)

An elegant and feature-rich UI component library for Solid.js, meticulously crafted for the CDX ecosystem. It provides a set of highly accessible, performant, and customizable primitives built with Tailwind CSS and Solid primitives.

## Features

- Fully Accessible: Adheres to WAI-ARIA design patterns with robust keyboard navigation and screen reader support.
- Performance First: Side-effect free and fully tree-shakable. You only bundle what you use.
- Modern Aesthetic: Clean, monospace-leaning design system optimized for technical and data-heavy interfaces.
- Compound Patterns: Flexible API using compound components for maximum layout control.
- Dark Mode Ready: Built-in support for theme switching and dark-mode aesthetics.
- Typed: Written in TypeScript with exhaustive JSDoc documentation for a superior developer experience.

## Installation

```bash
bun install @cdx-foundation/cdx-solidjs-components
# or
bun add @cdx-foundation/cdx-solidjs-components
```

## Setup

### 1. Fonts

This library's default design uses Google Fonts (Inter, JetBrains Mono, Archivo Black, Bebas Neue, Oxanium). You must load them in your app — the library no longer includes a CSS `@import` to avoid bundler warnings.

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300..900&family=JetBrains+Mono:wght@400..800&family=Archivo+Black&family=Bebas+Neue&family=Oxanium:wght@200..800&display=swap"
  rel="stylesheet"
/>
```

Or load them however you prefer — Vite's `@font-face` inlining, self-hosting, etc. If you only use a subset of fonts via the theme API, load only what you need.

### 2. Tailwind CSS v4 Configuration

To ensure styles are computed correctly, import the library in your main CSS file. This automatically configures Tailwind to scan the library's components for utility classes and provides default design tokens.

```css
@import 'tailwindcss';
@import '@cdx-foundation/cdx-solidjs-components';
```

## Theme

The `useTheme` hook provides reactive theming with persistent light/dark overrides, FOUC prevention, and CSS custom property injection.

### Primary pattern: server-fetched theme → client apply

The intended use is to **fetch the theme configuration from your server** (e.g. a Lua backend) and apply it to the client app on startup. This allows the backend to control branding, accent colors, radii, fonts, and shadow levels dynamically per request or per tenant.

```tsx
import { useTheme } from '@cdx-foundation/cdx-solidjs-components/hooks';

function App() {
  // On mount, fetch theme config from server and apply it.
  const { isDark, toggleTheme } = useTheme();

  createEffect(async () => {
    const res = await fetch('/api/theme');
    const serverTheme = await res.json();
    // serverTheme shape: Partial<Theme> or { light: ..., dark: ... }
    theme.setTheme(serverTheme);
  });

  return <button onClick={toggleTheme}>{isDark() ? '☀️ Light' : '🌙 Dark'}</button>;
}
```

**Server (Lua) endpoint example:** return a JSON object that mirrors `Partial<Theme>` fields. Only include the values you want to override — everything else falls back to built-in defaults.

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
useTheme().setTheme({
  accent: '#c62828',
  bg: '#ffffff',
  fg: '#1a1a1a',
  radius: '0px',
  font: 'sans',
  shadow: 'neo',
});
```

### Light/dark dual config

When your server wants to supply separate overrides for light and dark mode, return a `{ light, dark }` object:

```ts
useTheme().setTheme({
  light: { bg: '#ffffff', fg: '#1a1a1a', accent: '#c62828' },
  dark: { bg: '#0a0a0a', fg: '#f5f5f5', accent: '#ef5350' },
});
```

### FOUC prevention

Block the first paint with a synchronously-evaluated inline script that reads the persisted theme from `localStorage` and applies CSS custom properties before any rendering:

```html
<script>
  ${useTheme.getScript({ accent: '#c62828' })}
</script>
```

Pass optional defaults as the argument — these are applied before any persisted overrides.

### Available fields

| Field        | Type                     | Description                              |
| ------------ | ------------------------ | ---------------------------------------- |
| `accent`     | `string` (hex)           | Primary accent color                     |
| `bg`         | `string` (hex)           | Application background                   |
| `panel`      | `string` (hex)           | Card / modal background                  |
| `surface`    | `string` (hex)           | Subtle hover / secondary surface         |
| `border`     | `string` (hex)           | Default border color                     |
| `fg`         | `string` (hex)           | Primary text color                       |
| `muted`      | `string` (hex)           | Secondary / muted text color             |
| `radius`     | `string` (e.g. `"12px"`) | Unified border radius for all components |
| `font`       | `ThemeFont`              | Body font family                         |
| `headerFont` | `ThemeFont`              | Heading font family                      |
| `shadow`     | `ShadowLevel`            | Panel shadow level                       |
| `btnShadow`  | `ShadowLevel`            | Button shadow level                      |

`ThemeFont` values: `sans`, `mono`, `serif`, `display`, `system`, `modern`, `reading`, `geometric`, `condensed`, `soft-serif`, `oxanium`.

`ShadowLevel` values: `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `neo`, `flat`, `hard`.

### Dark mode auto-derivation

When you only configure light-mode values, dark-mode neutral colors (bg, panel, surface, border, fg, muted) are **auto-derived** via luminance inversion. Non-color fields (radius, font, shadow) carry over unchanged. Explicit dark overrides take precedence over auto-derived values.

Toggle cycles: `system` (follows OS) → `dark` → `light` → `system`.

### Persistence

Theme is persisted to `localStorage` under the `cdx_theme` key. Each entry carries a `version` number for forward-compatible schema migration. Cross-tab sync is handled automatically via the `storage` event.

---

## Component List

The library includes 41 high-fidelity components:

- Accordion: Vertically stacked interactive headings.
- Alert: Important messages for users to acknowledge.
- AspectRatio: Maintains a specific width/height ratio.
- Avatar: Visual representation of a user or entity.
- Badge: Status, category, or count indicator.
- Breadcrumb: Hierarchical navigation path.
- Button: Multi-variant interactive element.
- Calendar: Single, multiple, and range date selection.
- Card: Content container with consistent padding and borders.
- Carousel: Image or content slider with navigation.
- Checkbox: Squircular boolean input.
- Collapsible: Content that expands/contracts.
- ColorPicker: Curated presets and custom hex selection.
- Command: Fast, keyboard-driven command menu with filtering.
- ContextMenu: Custom right-click interaction menu.
- DatePicker: Inline or popover-based date selection.
- DropdownMenu: List of actions triggered by an element.
- HoverCard: Preview content on hover with a grace period.
- Input: Mono-styled text field with error handling.
- Kbd: Visual representation of keyboard shortcuts.
- Label: Semantic labeling for form controls.
- Menubar: Desktop-style horizontal navigation.
- Modal: Accessible dialog overlay with scroll locking.
- NavigationMenu: Site-wide navigation with rich dropdowns.
- Pagination: Page navigation controls.
- Popover: Rich content floating panel.
- Progress: Status indicator for task completion.
- RadioGroup: Exclusive choice selector.
- Resizable: Draggable panels with snap points.
- ScrollArea: Minimalist, cross-browser custom scrollbars.
- Select: Accessible dropdown replacement with search.
- Separator: Visual divider between content blocks.
- Sheet: Slide-over side panels with scroll locking.
- Skeleton: Animated loading placeholder.
- Slider: Visual range input with mono styling.
- Switch: High-fidelity toggle control.
- Table: Structured data display with mono alignment.
- Tabs: Layered sections of content.
- Textarea: Multi-line text input with vertical resizing.
- Toast: Fluid, animated notifications.
- Tooltip: Informative hover messages.

## Usage Example

```tsx
import { createSignal, createEffect } from 'solid-js';
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

## Design System

CDX Components relies on a specific set of Tailwind CSS variables. Ensure your `tailwind.config.js` is configured to support the library's aesthetics:

- Typography: Primarily uses `font-mono` for data values and inputs.
- Borders: Consistent `border-stroke` usage.
- Overlays: Glassmorphism and subtle shadows for `Modal`, `Sheet`, and `Popover`.

## Development

The library uses `vite-plus` for development, linting, and builds.

```bash
# Build the library
bun run build

# Run linting
bun run lint

# Format code
bun run fmt

# Run tests
bun run test
```

## License

MIT
