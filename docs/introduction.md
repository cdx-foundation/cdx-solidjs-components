# Introduction

Welcome to **CDX Solid.js Components** — an elegant, feature-rich UI component library for **SolidJS** and **Tailwind CSS v4**, meticulously crafted for the CDX ecosystem.

CDX Solid.js Components is designed for developers building complex, technical interfaces where precision, performance, and information density are paramount. The components favor a minimalist, "technical" aesthetic — featuring monospace typography, sharp corners, and high-contrast tokens.

---

## Philosophy

### Technical & Data-Driven

Professional tools should look like professional tools. CDX Components defaults to monospace fonts for data values, uses squircular or square radii, and prioritizes information density over white space. Every component is tuned for dashboards, IDEs, admin panels, and data-intensive applications.

### Built for SolidJS

Every component is authored in SolidJS, leveraging its fine-grained reactivity for zero-overhead updates. There is no virtual DOM and no heavy runtime — your UI stays responsive even under heavy data loads. Signals propagate directly to the DOM, so only the exact nodes that depend on changed state re-render.

### Tailwind CSS v4 First

The library is built on the latest Tailwind CSS v4 engine. Design tokens are exposed as CSS custom properties and registered with Tailwind's `@theme` directive, making customization as simple as updating a few variables in your CSS or via the `useTheme` hook at runtime.

### Accessible by Default

All interactive components adhere to WAI-ARIA design patterns with robust keyboard navigation, screen reader support, focus management, and focus trapping where appropriate. Roles, ARIA attributes, and semantic HTML are used throughout.

---

## Key Features

- **Fully Accessible** — Adheres to WAI-ARIA design patterns with robust keyboard navigation and screen reader support.
- **Performance First** — Side-effect free and fully tree-shakable. You only bundle what you use.
- **Modern Aesthetic** — Clean, monospace-leaning design system optimized for technical and data-heavy interfaces.
- **Compound Patterns** — Flexible API using compound components for maximum layout control.
- **Dark Mode Ready** — Built-in support for theme switching, dark-mode auto-derivation, and FOUC prevention.
- **Typed** — Written in TypeScript with exhaustive JSDoc documentation for a superior developer experience.
- **Reactive Theming** — Runtime theme control via CSS custom properties, with server-driven branding support and `localStorage` persistence.
- **Polymorphic** — Many components support an `as` prop for rendering as a different element or custom component.

---

## Component Catalog

The library ships **41+ high-fidelity components** organized into seven categories:

| Category         | Components                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| **Forms**        | Button, Input, Textarea, Checkbox, RadioGroup, Select, Slider, Switch, ColorPicker, DatePicker, Label, Calendar |
| **Data Display** | Table, Avatar, Badge, Kbd, Code, Progress, Skeleton, Separator                                                  |
| **Disclosure**   | Accordion, Collapsible, Tabs, HoverCard, Tooltip                                                                |
| **Feedback**     | Alert, Toast                                                                                                    |
| **Layout**       | Card, AspectRatio, ScrollArea, Resizable, SegmentedControl                                                      |
| **Navigation**   | Breadcrumb, Pagination, Menubar, NavigationMenu, Command, ContextMenu, DropdownMenu                             |
| **Overlays**     | Modal, Sheet, Popover, Carousel, Sidebar                                                                        |

Plus utility primitives: `Floating` (portal-based positioning), `createFocusTrap`, `useTheme`, `useDisclosure`, and four custom directives (`clickOutside`, `autofocus`, `clipboard`, `hover`).

---

## Design System

CDX Components relies on a set of Tailwind CSS v4 design tokens exposed via CSS custom properties. The key token categories are:

- **Colors** — `--color-primary`, `--color-bg`, `--color-fg`, `--color-stroke`, `--color-surface`, `--color-panel`, `--text-muted` (all settable at runtime via `useTheme`)
- **Fonts** — `--font-sans`, `--font-mono`, `--font-display` (11 font families available)
- **Radii** — `--radius-card`, `--radius-btn`, `--radius-input`, `--radius-badge`, `--radius-pill`
- **Shadows** — `--shadow-main`, `--shadow-btn` (9 shadow levels from `none` to `hard`)

See the [Theming](./theming.md) guide for the complete token reference and customization API.

---

## Browser Support

CDX Solid.js Components supports all modern browsers (Chrome, Firefox, Safari, Edge — latest two versions). The library uses modern CSS features including `color-mix()`, CSS custom properties, and `scrollbar-width`. SSR is supported — all `document`/`window` access is guarded.

---

## License

MIT © CDX Foundation
