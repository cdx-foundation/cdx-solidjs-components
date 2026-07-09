# Overlay Components

Components that render above the main content — modals, sheets, popovers, carousels, and the sidebar system.

---

## Modal

An accessible dialog overlay with scroll locking and focus trapping.

```tsx
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
} from '@cdx-foundation/cdx-solidjs-components';

const [isOpen, setIsOpen] = createSignal(false);

<Modal isOpen={isOpen()} onClose={() => setIsOpen(false)}>
  <ModalHeader>
    <ModalTitle>Settings</ModalTitle>
    <ModalDescription>Configure your preferences.</ModalDescription>
  </ModalHeader>
  <ModalContent>
    <p>Settings content here.</p>
  </ModalContent>
  <ModalFooter>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={() => setIsOpen(false)}>Save</Button>
  </ModalFooter>
</Modal>;
```

### Components

#### `Modal`

`ModalProps` extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop            | Type                                 | Required | Default | Description                                                      |
| --------------- | ------------------------------------ | -------- | ------- | ---------------------------------------------------------------- |
| `isOpen`        | `boolean`                            | Yes      | —       | Controls visibility state of the modal                           |
| `onClose`       | `() => void`                         | Yes      | —       | Handler triggered on close (X button, backdrop click, or Escape) |
| `backdropClass` | `string`                             | No       | —       | Custom CSS classes for the backdrop (dimmed area)                |
| _(inherited)_   | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —       | All standard div attributes                                      |

#### `ModalHeader`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Renders `flex flex-col gap-1.5 mb-5 pr-8`.

#### `ModalTitle`

Props: `JSX.HTMLAttributes<HTMLHeadingElement>`. Renders `<h3>` with `text-lg font-bold leading-none tracking-tight`.

#### `ModalDescription`

Props: `JSX.HTMLAttributes<HTMLParagraphElement>`. Renders `<p>` with `text-sm text-muted`.

#### `ModalContent`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Renders `flex-1`.

#### `ModalFooter`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Renders `flex items-center justify-end gap-2`.

### Behavior

- **Close triggers:** X button, backdrop click, and Escape key all call `onClose`.
- **Accessibility:** `role="dialog"`, `aria-modal="true"` on the panel; `aria-label="Close"` on the X button.
- **Focus trapping:** Uses `createFocusTrap` to keep Tab/Shift+Tab cycling within the modal.
- **Scroll locking:** Prevents body scroll while open.
- **Animation:** `animate-in fade-in duration-200` on backdrop and panel.
- No polymorphic `as` prop.

---

## Sheet

A slide-over side panel with scroll locking and focus trapping.

```tsx
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetFooter,
} from '@cdx-foundation/cdx-solidjs-components';

const [isOpen, setIsOpen] = createSignal(false);

<Sheet isOpen={isOpen()} onClose={() => setIsOpen(false)} side="right">
  <SheetHeader>
    <SheetTitle>Filters</SheetTitle>
    <SheetDescription>Refine your search results.</SheetDescription>
  </SheetHeader>
  <SheetContent>
    <p>Filter options here.</p>
  </SheetContent>
  <SheetFooter>
    <Button onClick={() => setIsOpen(false)}>Apply</Button>
  </SheetFooter>
</Sheet>;
```

### Components

#### `Sheet`

`SheetProps` extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop            | Type                                 | Required | Default   | Description                                       |
| --------------- | ------------------------------------ | -------- | --------- | ------------------------------------------------- |
| `isOpen`        | `boolean`                            | Yes      | —         | Controls visibility state of the slide-over panel |
| `onClose`       | `() => void`                         | Yes      | —         | Handler triggered when the user initiates closure |
| `side`          | `'left' \| 'right'`                  | No       | `'right'` | Viewport edge the sheet emerges from              |
| `backdropClass` | `string`                             | No       | —         | Custom CSS classes for the backdrop               |
| _(inherited)_   | `JSX.HTMLAttributes<HTMLDivElement>` | —        | —         | All standard div attributes                       |

#### `SheetHeader`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Renders `flex flex-col gap-1.5 p-6 pb-0 pr-12`.

#### `SheetTitle`

Props: `JSX.HTMLAttributes<HTMLHeadingElement>`. Renders `<h2>` with `text-lg font-semibold text-fg`.

#### `SheetDescription`

Props: `JSX.HTMLAttributes<HTMLParagraphElement>`. Renders `<p>` with `text-sm font-mono text-muted`.

#### `SheetContent`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Renders `flex-1 overflow-y-auto p-6`.

#### `SheetFooter`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Renders action button container.

### Behavior

- **Side variants:** `side="right"` slides in from the right (`slide-in-from-right-full`); `side="left"` slides in from the left (`slide-in-from-left-full`).
- **Close button:** X icon button (`<X size={20} />`) top-right of the panel.
- **Accessibility:** `role="dialog"`, `aria-modal="true"` on the panel; `aria-label="Close"` on close button.
- **Responsive:** Full-width on small screens (`w-full`), max-width `sm:max-w-md` on larger screens.
- **Focus trapping:** Uses `createFocusTrap`.
- **Scroll locking:** Prevents body scroll while open.
- **Animation:** `animate-in fade-in duration-200` on backdrop; `transition ease-in-out duration-300 animate-in` on panel with directional slide classes.

---

## Popover

A rich content floating panel with click-to-toggle behavior and outside-click dismissal.

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@cdx-foundation/cdx-solidjs-components';

// Composable pattern
<Popover align="bottom">
  <PopoverTrigger>
    <Button>Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div class="p-4">
      <h4>Popover Title</h4>
      <p>Popover content goes here.</p>
    </div>
  </PopoverContent>
</Popover>

// Trigger prop pattern
<Popover trigger={<Button>Open</Button>} align="bottom">
  <div class="p-4">Content</div>
</Popover>
```

### Components

#### `Popover`

`PopoverProps` extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Default    | Description                                                                                    |
| ------------- | ------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------- |
| `align`       | `Alignment`                          | `'bottom'` | Anchor point of the content relative to the trigger                                            |
| `trigger`     | `JSX.Element`                        | —          | Optional trigger element (if provided, renders `PopoverTrigger` + `PopoverContent` internally) |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —          | All standard div attributes                                                                    |

#### `PopoverTrigger`

Props: `JSX.HTMLAttributes<HTMLDivElement>`.

| Event       | Behavior                                                |
| ----------- | ------------------------------------------------------- |
| `onClick`   | Toggles `isOpen`, composed with user's `onClick`        |
| `onKeyDown` | Enter/Space handling (composed with user's `onKeyDown`) |

Has `role="button"`, `tabIndex={0}`, `cursor-pointer`.

#### `PopoverContent`

Props: `JSX.HTMLAttributes<HTMLDivElement>`. Rendered via `Floating.Content` with `sideOffset={8}`.

### Behavior

- **Context API:** Uses `createContext<PopoverContextValue>()` with `isOpen`, `setIsOpen`, and `align`.
- **Floating utility:** Delegates positioning to the `Floating` component (portal, dynamic viewport-aware positioning, 12 alignment directions).
- **Controlled internally:** Manages its own `isOpen` state via `createSignal(false)`. No external open/onOpenChange props.
- **Dual-mode:** If `trigger` prop is provided, renders `PopoverTrigger` + `PopoverContent` internally; otherwise renders children directly.
- **Outside click:** Closes on `mousedown` outside both trigger and content.
- **Escape key:** Uses `createShortcut(['Escape'], ...)` from `@solid-primitives/keyboard`.
- **Side offset:** `Floating.Content` called with `sideOffset={8}`.
- **Accessibility:** `PopoverTrigger` has `role="button"`, `tabIndex={0}`, keyboard handling for Enter/Space.
- **Animation:** `animate-in fade-in slide-in-from-top-2` on content.

---

## Carousel

An image or content slider with snap-scrolling and navigation buttons.

```tsx
import { Carousel } from '@cdx-foundation/cdx-solidjs-components';

<Carousel
  items={[<img src="/slide1.jpg" />, <img src="/slide2.jpg" />, <img src="/slide3.jpg" />]}
/>;
```

### Props

`CarouselProps` extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Required | Description                                                                                                   |
| ------------- | ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| `items`       | `JSX.Element[]`                      | Yes      | An ordered list of content elements for individual slides. Each is automatically wrapped in a snap-container. |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —        | All standard div attributes                                                                                   |

### Behavior

- **Navigation:** `scroll('left' \| 'right')` scrolls by `0.8 * clientWidth` using `scrollBy({ behavior: 'smooth' })`.
- **Scrollbar hiding:** `scrollbar-hide` utility class plus inline styles `scrollbar-width: none; -ms-overflow-style: none`.
- **Accessibility:** Buttons have `aria-label="Previous slide"` / `aria-label="Next slide"`.
- No portal, no focus trap, no `as` prop. Minimal, purely presentational.

---

## Sidebar

A comprehensive, responsive sidebar system with desktop and mobile modes, collapsible variants, keyboard shortcuts, and persistent state. This is the most feature-rich component in the library.

```tsx
import {
  Sidebar,
  SidebarProvider,
  SidebarRoot,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@cdx-foundation/cdx-solidjs-components';

function AppLayout() {
  return (
    <SidebarProvider>
      <SidebarRoot>
        <SidebarHeader>
          <span>My App</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive href="/dashboard">
                    Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/settings">Settings</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <span>v1.0.0</span>
        </SidebarFooter>
      </SidebarRoot>
      <SidebarInset>
        <header>
          <SidebarTrigger />
        </header>
        <main>{/* page content */}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### Types

```ts
type SidebarState = 'expanded' | 'collapsed';
type SidebarSide = 'left' | 'right';
type SidebarVariant = 'sidebar' | 'floating' | 'inset';
type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';
```

### Constants

| Name                        | Value             |
| --------------------------- | ----------------- |
| `SIDEBAR_COOKIE_NAME`       | `'sidebar:state'` |
| `SIDEBAR_WIDTH`             | `'16rem'`         |
| `SIDEBAR_WIDTH_MOBILE`      | `'18rem'`         |
| `SIDEBAR_WIDTH_ICON`        | `'3rem'`          |
| `SIDEBAR_KEYBOARD_SHORTCUT` | `'b'`             |

### Components

#### `SidebarProvider`

`SidebarProviderProps` extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop           | Type                                 | Default | Description                                |
| -------------- | ------------------------------------ | ------- | ------------------------------------------ |
| `defaultOpen`  | `boolean`                            | `true`  | Initial open state (uncontrolled)          |
| `open`         | `boolean`                            | —       | Controlled open state (overrides internal) |
| `onOpenChange` | `(open: boolean) => void`            | —       | Callback when open state changes           |
| _(inherited)_  | `JSX.HTMLAttributes<HTMLDivElement>` | —       | All standard div attributes                |

#### `SidebarRoot`

`SidebarRootProps` extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Default     | Description                 |
| ------------- | ------------------------------------ | ----------- | --------------------------- |
| `side`        | `'left' \| 'right'`                  | `'left'`    | Which viewport edge         |
| `variant`     | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` | Visual variant              |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'`    | `'icon'`    | Collapse behavior           |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —           | All standard div attributes |

#### `SidebarMenuButton`

`SidebarMenuButtonProps` extends `JSX.HTMLAttributes<HTMLElement>`.

| Prop          | Type                              | Default | Description                               |
| ------------- | --------------------------------- | ------- | ----------------------------------------- |
| `isActive`    | `boolean`                         | —       | Highlights the button as the active route |
| `as`          | `string`                          | `'a'`   | Polymorphic underlying element            |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>` | —       | All standard HTML attributes              |

#### Other Sub-Components

All accept standard HTML attributes for their underlying element and carry a `data-sidebar` attribute:

| Component              | Element             | `data-sidebar`      |
| ---------------------- | ------------------- | ------------------- |
| `SidebarHeader`        | `<div>`             | `"header"`          |
| `SidebarFooter`        | `<div>`             | `"footer"`          |
| `SidebarContent`       | `<div>`             | `"content"`         |
| `SidebarInset`         | `<div>`             | `"inset"`           |
| `SidebarSeparator`     | wraps `<Separator>` | —                   |
| `SidebarGroup`         | `<div>`             | `"group"`           |
| `SidebarGroupLabel`    | `<div>`             | `"group-label"`     |
| `SidebarGroupContent`  | `<div>`             | `"group-content"`   |
| `SidebarGroupAction`   | `<button>`          | `"group-action"`    |
| `SidebarMenu`          | `<ul>`              | `"menu"`            |
| `SidebarMenuItem`      | `<li>`              | `"menu-item"`       |
| `SidebarMenuAction`    | `<button>`          | `"menu-action"`     |
| `SidebarMenuBadge`     | `<div>`             | `"menu-badge"`      |
| `SidebarMenuSub`       | `<ul>`              | `"menu-sub"`        |
| `SidebarMenuSubItem`   | `<li>`              | `"menu-sub-item"`   |
| `SidebarMenuSubButton` | `<a>` (polymorphic) | `"menu-sub-button"` |
| `SidebarTrigger`       | `<button>`          | —                   |
| `SidebarRail`          | `<button>`          | —                   |

### Hooks

#### `useSidebar`

```ts
function useSidebar(): {
  state: Accessor<SidebarState>;
  open: Accessor<boolean>;
  setOpen: (open: boolean) => void;
  openMobile: Accessor<boolean>;
  setOpenMobile: (open: boolean) => void;
  isMobile: Accessor<boolean>;
  toggle: () => void;
};
```

#### `useSidebarTab`

```ts
function useSidebarTab(defaultTab: string, storageKey?: string): [Accessor<string>, Setter<string>];
```

Persists the active sidebar tab key across page reloads. `storageKey` defaults to `'sidebar:tab'`. Uses `makePersisted` from `@solid-primitives/storage` with `localStorage`.

### Behavior

- **Controlled/uncontrolled:** `SidebarProvider` supports `open` (controlled) and `defaultOpen` (uncontrolled). Internal state uses `makePersisted` keyed to `'sidebar:state'` in `localStorage`.
- **Mobile detection:** Uses `createMediaQuery('(max-width: 768px)')` from `@solid-primitives/media`. On mobile, `SidebarRoot` renders a `MobileSidebar` (wraps content in `Sheet`/`SheetContent`). On desktop, renders `DesktopSidebar`.
- **Desktop variants:**
  - `'sidebar'` — border-right, static
  - `'floating'` — absolute, shadow, overlay
  - `'inset'` — used with `SidebarInset` which uses `peer-data-[variant=inset]/sidebar:ml-(--sidebar-width)`
- **Collapsible modes:**
  - `'icon'` — collapses to `3rem` width, shows icons only
  - `'offcanvas'` — slides out of view (`w-0 overflow-hidden opacity-0`)
  - `'none'` — always expanded
- **Polymorphic `as`:** `SidebarMenuButton` uses `<Dynamic>`; defaults `'a'`. `SidebarMenuSubButton` defaults `'a'`.
- **Tooltip integration:** `SidebarMenuButton` auto-wraps `<Tooltip>` when collapsed in icon mode on desktop (uses `tooltip` prop or extracts text from children).
- **Keyboard shortcut:** `Cmd/Ctrl + B` toggles the sidebar (via `createShortcut` from `@solid-primitives/keyboard`). Won't fire when focus is in `input, textarea, [contenteditable]`.
- **CSS custom properties:** `--sidebar-width` (16rem), `--sidebar-width-icon` (3rem) set on the provider.
- **Namespace:** `Sidebar` is a namespace object mapping all sub-components (e.g. `Sidebar.Provider`, `Sidebar.Root`, `Sidebar.Menu`, etc.).
