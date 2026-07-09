# Getting Started

Learn how to install, configure, and start building with **CDX Solid.js Components** — an elegant, accessible UI component library for SolidJS and Tailwind CSS v4.

---

## Installation

Install the package from npm using your preferred package manager:

```bash
# npm
npm install @cdx-foundation/cdx-solidjs-components

# bun
bun add @cdx-foundation/cdx-solidjs-components

# pnpm
pnpm add @cdx-foundation/cdx-solidjs-components

# yarn
yarn add @cdx-foundation/cdx-solidjs-components
```

---

## Peer Dependencies

CDX Solid.js Components relies on a few peer dependencies that must be installed in your project. Most SolidJS projects already have these, but ensure the following versions are present:

| Package                            | Minimum Version | Purpose                                   |
| ---------------------------------- | --------------- | ----------------------------------------- |
| `solid-js`                         | `^1.9.12`       | The SolidJS reactive framework            |
| `tailwindcss`                      | `^4.3.1`        | Utility-first CSS engine (v4 required)    |
| `tailwind-merge`                   | `^3.6.0`        | Intelligent Tailwind class merging        |
| `class-variance-authority`         | `^0.7.1`        | Variant management for components         |
| `solid-transition-group`           | `^0.3.0`        | Animation transitions (Toast, overlays)   |
| `@solid-primitives/event-listener` | `^2.4.5`        | Declarative event listeners               |
| `@solid-primitives/keyboard`       | `^1.3.5`        | Keyboard shortcut handling                |
| `@solid-primitives/media`          | `^2.3.5`        | Reactive media queries (Sidebar mobile)   |
| `@solid-primitives/storage`        | `^4.3.4`        | Persisted reactive state (theme, sidebar) |

Install them all at once:

```bash
npm install solid-js tailwindcss tailwind-merge class-variance-authority \
  solid-transition-group @solid-primitives/event-listener @solid-primitives/keyboard \
  @solid-primitives/media @solid-primitives/storage
```

---

## Setup

### 1. Fonts

The library's default design uses Google Fonts. You must load them in your app — the library no longer includes a CSS `@import` to avoid bundler warnings.

Add the following to your `index.html`:

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300..900&family=JetBrains+Mono:wght@400..800&family=Archivo+Black&family=Bebas+Neue&family=Oxanium:wght@200..800&display=swap"
  rel="stylesheet"
/>
```

Alternatively, self-host the fonts or use Vite's `@font-face` inlining. If you only use a subset of fonts via the theme API, load only what you need. See the [Theming](./theming.md) guide for the full list of available font families.

### 2. Tailwind CSS v4 Configuration

CDX Solid.js Components is built for **Tailwind CSS v4**. In your main CSS entry point, import the library so Tailwind scans the library's components for utility classes and applies the default design tokens:

```css
/* app.css */
@import 'tailwindcss';
@import '@cdx-foundation/cdx-solidjs-components';
```

This single import:

- Registers the library's `@theme` design tokens (colors, fonts, radii, shadows) with Tailwind.
- Applies base layer styles (themed body defaults, scrollbar styling).
- Exposes utility classes like `bg-primary`, `text-fg`, `rounded-card`, `font-mono`, `shadow-btn`, and the custom `.clean-panel` / `.hud` utilities.

> **Note:** If you are using Tailwind's JIT scanner and want the library's utility classes to be detected, you may also add a source directive:
>
> ```css
> @source "../node_modules/@cdx-foundation/cdx-solidjs-components/lib/ui/**/*.tsx";
> ```

### 3. Theme Provider (Optional but Recommended)

The `useTheme` hook provides reactive theming with persistent light/dark overrides, FOUC prevention, and CSS custom property injection. Initialize it at your app root:

```tsx
import { useTheme } from '@cdx-foundation/cdx-solidjs-components/hooks';

function App() {
  const theme = useTheme();

  // Optionally fetch theme config from your server on mount
  createEffect(async () => {
    const res = await fetch('/api/theme');
    const serverTheme = await res.json();
    theme.setTheme(serverTheme);
  });

  return <YourApp />;
}
```

See the [Theming](./theming.md) guide for the complete theme API, FOUC prevention, and dark-mode auto-derivation.

### 4. Toaster Setup (Optional)

If you plan to use toast notifications, mount the `<Toaster>` component once at the root of your application:

```tsx
import { Toaster } from '@cdx-foundation/cdx-solidjs-components';

function App() {
  return (
    <>
      <Toaster />
      <YourApp />
    </>
  );
}
```

---

## FOUC Prevention (Flash of Unstyled Content)

To prevent a flash of the wrong theme on first paint, add a blocking inline script to your `index.html` `<head>` that reads the persisted theme from `localStorage` and applies CSS custom properties before any rendering:

```html
<head>
  <script>
    // Generated by useTheme.getScript() — paste the output here
    // or inline it at build time.
  </script>
</head>
```

You can generate the script string at build time:

```ts
import { useTheme } from '@cdx-foundation/cdx-solidjs-components/hooks';

const script = useTheme.getScript({ accent: '#c62828' });
// Inject into your HTML template
```

Pass optional defaults as the argument — these are applied before any persisted overrides.

---

## Import Patterns

CDX Solid.js Components supports multiple import paths for flexibility and tree-shaking:

### Barrel import (most convenient)

```tsx
import { Button, Modal, Card, useTheme } from '@cdx-foundation/cdx-solidjs-components';
```

### Direct component import (best tree-shaking)

```tsx
import { Button } from '@cdx-foundation/cdx-solidjs-components/ui/Button';
import { Card, CardTitle, CardContent } from '@cdx-foundation/cdx-solidjs-components/ui/Card';
```

### Hooks import

```tsx
import { useTheme, useDisclosure } from '@cdx-foundation/cdx-solidjs-components/hooks';
```

### Theme CSS import

```css
@import '@cdx-foundation/cdx-solidjs-components/theme';
```

---

## Basic Usage

```tsx
import { createSignal } from 'solid-js';
import { Button, Card, CardTitle, CardContent } from '@cdx-foundation/cdx-solidjs-components';

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <Card class="max-w-sm">
      <CardTitle>Welcome to CDX Components</CardTitle>
      <CardContent>
        <p class="mb-4">A data-heavy component library for SolidJS.</p>
        <Button variant="primary" onClick={() => setCount((c) => c + 1)}>
          Clicked {count()} times
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## TypeScript

The library is written in TypeScript and ships with full type definitions. All component props are strongly typed with exhaustive JSDoc annotations. When using the polymorphic `as` prop, the library forwards arbitrary props via `Dynamic`, so you may need to cast in strict mode.

The package's `exports` map provides `"types"` resolution automatically — no additional `@types` package is needed.

---

## Package Exports

| Subpath                                        | Description                                           |
| ---------------------------------------------- | ----------------------------------------------------- |
| `@cdx-foundation/cdx-solidjs-components`       | All components, hooks, directives, theme tokens       |
| `@cdx-foundation/cdx-solidjs-components/ui/*`  | Individual component source (for dev / direct import) |
| `@cdx-foundation/cdx-solidjs-components/hooks` | `useTheme`, `useDisclosure`                           |
| `@cdx-foundation/cdx-solidjs-components/theme` | The `theme.css` stylesheet                            |

---

## Development Workflow

If you are contributing to the library itself:

```bash
# Install dependencies
vp install

# Start the demo dev server
vp dev

# Build the library (outputs dist/ + type declarations)
vp build && tsc -p tsconfig.prod.json

# Lint, format, type-check
vp check

# Run tests
vp test
```

---

## Next Steps

- [Introduction](./introduction.md) — Design philosophy and feature overview
- [Theming](./theming.md) — Complete theme API, tokens, and dark mode
- [Utilities](./utilities.md) — Hooks, directives, and the Floating positioning primitive
- [Form Components](./components/forms.md) — Buttons, inputs, selects, and more
- [Data Display](./components/data-display.md) — Tables, badges, progress, and more
- [Disclosure](./components/disclosure.md) — Accordions, tabs, tooltips
- [Feedback](./components/feedback.md) — Alerts and toasts
- [Layout](./components/layout.md) — Cards, scroll areas, resizable panels
- [Navigation](./components/navigation.md) — Breadcrumbs, menus, command palette
- [Overlays](./components/overlays.md) — Modals, sheets, popovers, sidebar
