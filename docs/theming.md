# Theming

Starling UI uses a CSS variable-based design system, allowing for deep customization without leaving your CSS files.

## Design Tokens

The library defines core tokens in the `@theme` block of Tailwind. You can override these by setting the corresponding CSS variables in your global CSS.

### Core Colors

| Variable | Description | Default |
| :--- | :--- | :--- |
| `--color-primary` | The main accent color used for actions and highlights. | `#c62828` |
| `--color-bg` | The primary application background. | `#ffffff` |
| `--color-fg` | The primary text color. | `#1a1a1a` |
| `--color-stroke` | Default border color for inputs, cards, and separators. | `#e5e5e5` |
| `--color-panel` | Background for floating elements (dropdowns, modals). | `#ffffff` |
| `--color-surface` | Subtle background for hover states and secondary areas. | `#f7f7f7` |

### Typography

Starling UI defaults to high-legibility fonts with a strong preference for monospace in data-heavy areas.

| Variable | Default |
| :--- | :--- |
| `--font-display` | `"Inter", system-ui, sans-serif` |
| `--font-sans` | `"Inter", system-ui, sans-serif` |
| `--font-mono` | `"JetBrains Mono", ui-monospace, monospace` |

### Border Radii

We use a "technical" radius system. By default, most radii are set to `0px` for a sharp, professional look.

| Variable | Default |
| :--- | :--- |
| `--radius-card` | `0px` |
| `--radius-btn` | `0px` |
| `--radius-input` | `0px` |
| `--radius-badge` | `0px` |

## Customizing the Theme

### Via Global CSS

The most straightforward way to customize the theme is to define your own values for the variables:

```css
:root {
  --primary-color: #0070f3; /* Custom blue accent */
  --radius-card: 8px;       /* Softer corners */
  --radius-btn: 4px;
}

.dark {
  --bg-main: #000000;
  --fg-main: #ffffff;
  --border-main: #333333;
}
```

### Via `useTheme` Hook

Starling UI provides a built-in `useTheme` hook that handles dark mode persistence and programmatic accent color updates.

```tsx
import { useTheme } from 'starling-components/hooks';

function ThemeToggle() {
  const { isDark, toggleTheme, setAccentColor } = useTheme();

  return (
    <div class="flex gap-4">
      <Button onClick={toggleTheme}>
        Switch to {isDark() ? 'Light' : 'Dark'} Mode
      </Button>
      <Button onClick={() => setAccentColor('#3b82f6')}>
        Set Blue Theme
      </Button>
    </div>
  );
}
```
