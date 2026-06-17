# CDX Solid.js Components

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

### 1. Tailwind CSS v4 Configuration

To ensure styles are computed correctly, import the library in your main CSS file. This automatically configures Tailwind to scan the library's components for utility classes and provides default design tokens.

```css
@import 'tailwindcss';
@import '@cdx-foundation/cdx-solidjs-components';
```

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
import { createSignal } from 'solid-js';
import { Button, Modal } from '@cdx-foundation/cdx-solidjs-components';
import { useTheme } from '@cdx-foundation/cdx-solidjs-components/hooks';

export const MyComponent = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div class="p-8">
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} title="Settings">
        <div class="p-4 space-y-4">
          <p>Configure your application preferences here.</p>
          <Button onClick={toggleTheme}>Switch to {isDark() ? 'Light' : 'Dark'} Mode</Button>
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
