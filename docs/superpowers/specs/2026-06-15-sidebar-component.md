# Sidebar Component — Design Spec

## Overview

A composable, themeable, collapsible sidebar component for the CDX SolidJS library, porting the feature set and API ergonomics of shadcn-svelte's Sidebar into SolidJS compound-component patterns.

### Dependencies

- `@solid-primitives/keyboard` — keyboard shortcut (Cmd+B)
- `@solid-primitives/media` — mobile detection
- `@solid-primitives/storage` — cookie persistence for desktop state
- `lucide-solid` — icons (PanelLeft, ChevronRight, etc.)
- Existing UI: Tooltip, Collapsible, Separator, DropdownMenu, Button, Kbd, ScrollArea, Sheet, Skeleton

---

## API Surface

### `Sidebar.Provider`

Root context provider. MUST wrap all sidebar instances and the main content area.

| Prop           | Type                      | Default | Description                               |
| -------------- | ------------------------- | ------- | ----------------------------------------- |
| `defaultOpen`  | `boolean`                 | `true`  | Initial open state (uncontrolled)         |
| `open`         | `boolean`                 | —       | Controlled open state                     |
| `onOpenChange` | `(open: boolean) => void` | —       | Callback when open state changes          |
| `style`        | `JSX.CSSProperties`       | —       | CSS custom properties for width overrides |

Provides context: `{ state, open, setOpen, openMobile, setOpenMobile, isMobile, toggle }`

On desktop: persists state via cookie. Keyboard shortcut Cmd+B toggles open.

### `Sidebar` (Root, exported as `Sidebar`)

The sidebar `<aside>` element rendered either inline (desktop) or via Portal/Sheet (mobile).

| Prop          | Type                                 | Default     | Description                       |
| ------------- | ------------------------------------ | ----------- | --------------------------------- |
| `side`        | `'left' \| 'right'`                  | `'left'`    | Which side the sidebar appears on |
| `variant`     | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` | Layout variant                    |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'`    | `'icon'`    | Collapsible behavior              |
| `class`       | `string`                             | —           | Additional classes                |

**Desktop rendering:**

- `sidebar` variant: uses `data-sidebar` attribute + CSS for margin-based layout
- `floating` variant: positioned absolutely with shadow and border
- `inset` variant: rendered inside `Sidebar.Inset` wrapper with border

**Mobile rendering:** delegates to `Sheet` component with slide-from-left/right.

**Icon mode:** when `state === 'collapsed'` and `collapsible === 'icon'`, width is `--sidebar-width-icon` (3rem), items render with Tooltips.

### `Sidebar.Header`

Sticky top container inside the sidebar. Renders a `<div data-sidebar-header>`.

### `Sidebar.Footer`

Sticky bottom container. Renders a `<div data-sidebar-footer>`.

### `Sidebar.Content`

Scrollable content area. Wraps children in a custom-scrollbar div. Renders `<div data-sidebar-content>`.

### `Sidebar.Group`

Section within sidebar content. Wraps `GroupLabel`, `GroupContent`, and optional `GroupAction`.

Props: `class?: string`, `children: JSX.Element`

### `Sidebar.GroupLabel`

A heading/label for a group. Renders `<div data-sidebar-group-label>`.

Works with `Collapsible.Trigger` when wrapped in `Collapsible.Root`.

### `Sidebar.GroupContent`

Content body for a group. Renders `<div data-sidebar-group-content>`.

Works with `Collapsible.Content` when wrapped in `Collapsible.Root`.

### `Sidebar.GroupAction`

A small action button on the right side of the group label. Renders `<button data-sidebar-group-action>`.

### `Sidebar.Menu`

A `<nav>` / `<ul>` container for menu items.

### `Sidebar.MenuItem`

A single `<li>` in the menu. Supports optional submenu.

Props: `class?: string`, `children: JSX.Element`

### `Sidebar.MenuButton`

The primary interactive element inside a `MenuItem`. Polymorphic — renders a `<button>` by default but uses `as` prop pattern (like `Button`'s `Dynamic`).

| Prop       | Type      | Default    | Description                                                   |
| ---------- | --------- | ---------- | ------------------------------------------------------------- |
| `isActive` | `boolean` | `false`    | Whether the item is currently active/selected                 |
| `as`       | `string`  | `'button'` | Polymorphic component override                                |
| `class`    | `string`  | —          | Additional classes                                            |
| `tooltip`  | `string`  | —          | Override tooltip text in icon mode (defaults to text content) |

In icon mode, the button's text content is hidden and a `Tooltip` is rendered instead.

### `Sidebar.MenuAction`

A secondary action slot within a `MenuItem` (e.g., "more" button, "add" button). Positioned on the right edge, only visible on hover / when parent is active.

### `Sidebar.MenuSub`

Submenu container for nested navigation. Works with `Collapsible.Root` for show/hide.

### `Sidebar.MenuSubItem`

A single submenu item.

### `Sidebar.MenuSubButton`

The button/link inside a submenu item.

### `Sidebar.MenuBadge`

A small badge/count displayed at the right edge of a `MenuItem`. Uses the existing `Badge` component internally.

### `Sidebar.MenuSkeleton`

Loading placeholder for menu items. Renders a pulsing skeleton bar with icon space.

### `Sidebar.Separator`

Thin horizontal divider. Thin wrapper around the existing `Separator` with sidebar theming.

### `Sidebar.Trigger`

A toggle button placed outside the sidebar (e.g., in the main content area header). Shows `PanelLeft` icon. Must be used inside `Sidebar.Provider`.

Props: `class?: string` — renders a ghost `Button`.

### `Sidebar.Rail`

A narrow hover strip at the edge of the sidebar. When hovered (desktop), toggles the sidebar between expanded and icon mode. Shows a small chevron indicator.

### `Sidebar.Inset`

Wrapper for the main content area when using `variant="inset"`. Provides proper padding/border.

### `useSidebar` Hook

```ts
const sidebar = useSidebar();
// Returns: { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggle }
```

Must be called inside a `Sidebar.Provider`.

---

## CSS Variables

### Width

| Variable                 | Default |
| ------------------------ | ------- |
| `--sidebar-width`        | `16rem` |
| `--sidebar-width-mobile` | `18rem` |
| `--sidebar-width-icon`   | `3rem`  |

### Theme Colors (added to `theme.css`)

```css
--color-sidebar: var(--sidebar, #fafafa);
--color-sidebar-fg: var(--sidebar-fg, #0a0a0a);
--color-sidebar-primary: var(--sidebar-primary, #171717);
--color-sidebar-primary-fg: var(--sidebar-primary-fg, #fafafa);
--color-sidebar-accent: var(--sidebar-accent, #f5f5f5);
--color-sidebar-accent-fg: var(--sidebar-accent-fg, #171717);
--color-sidebar-border: var(--sidebar-border, #e5e5e5);
--color-sidebar-ring: var(--sidebar-ring, #a1a1a1);
```

---

## File Structure

Single file: `lib/ui/Sidebar.tsx` — ~600 lines. Exported from `lib/index.ts`.

No separate constants file — constants are inlined at the top of Sidebar.tsx.

---

## Edge Cases & States

- **No Provider**: `useSidebar` and `Sidebar.Trigger` throw a descriptive error.
- **Controlled + uncontrolled conflict**: If both `open` and `defaultOpen` are omitted, defaults to `defaultOpen={true}`. If `open` is provided, component is controlled and ignores internal state.
- **Mobile**: If mobile and `collapsible !== 'none'`, sidebar renders via Sheet/Portal overlay with backdrop.
- **Icon mode tooltips**: Auto-derived from child text content unless `tooltip` prop is provided on `MenuButton`.
- **No items**: Empty groups/menus render nothing (no placeholder).
- **Rail double-trigger**: Hovering rail toggles, but clicking Trigger also works — no conflict.

---

## Acceptance Criteria

1. Feature parity with shadcn-svelte sidebar API (all components listed above)
2. Follows existing SolidJS patterns: `splitProps`, `twMerge`, context, compound components
3. Desktop: three collapsible modes work correctly
4. Desktop: three variants render with correct layout
5. Mobile: sidebar opens as Sheet overlay
6. Keyboard shortcut Cmd+B toggles sidebar
7. State persists across page reloads (cookie)
8. Icon mode shows tooltips
9. Submenus work via Collapsible composition
10. Menu items with `isActive` show active styling
11. Theme CSS variables apply correctly
