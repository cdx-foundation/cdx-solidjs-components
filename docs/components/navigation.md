# Navigation Components

Components for navigating between pages, sections, and actions — breadcrumbs, pagination, menus, and command palettes.

---

## Breadcrumb

A hierarchical navigation path showing the user's location within a site.

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@cdx-foundation/cdx-solidjs-components';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Item</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>;
```

### Components

| Component             | Underlying Element | Props                                                              |
| --------------------- | ------------------ | ------------------------------------------------------------------ |
| `Breadcrumb`          | `<nav>`            | `JSX.HTMLAttributes<HTMLElement>` — has `aria-label="breadcrumb"`  |
| `BreadcrumbList`      | `<ol>`             | `JSX.HTMLAttributes<HTMLOListElement>`                             |
| `BreadcrumbItem`      | `<li>`             | `JSX.HTMLAttributes<HTMLLIElement>`                                |
| `BreadcrumbLink`      | `<a>`              | `JSX.AnchorHTMLAttributes<HTMLAnchorElement>`                      |
| `BreadcrumbSeparator` | `<li>`             | `JSX.HTMLAttributes<HTMLLIElement>` — `children` defaults to `'/'` |
| `BreadcrumbPage`      | `<span>`           | `JSX.HTMLAttributes<HTMLSpanElement>` — current page (non-link)    |

### Behavior

- `Breadcrumb` renders with `aria-label="breadcrumb"` for accessibility.
- `BreadcrumbSeparator` has `role="presentation"` and `aria-hidden="true"`.
- Default separator character is `'/'` if no children are provided.
- All components use `splitProps` for `class`/`children` extraction and `twMerge` for class merging.

---

## Pagination

Page navigation controls with prev/next buttons and numbered pages.

```tsx
import { Pagination } from '@cdx-foundation/cdx-solidjs-components';

<Pagination currentPage={page()} totalPages={20} onPageChange={(p) => setPage(p)} />;
```

### Props

Extends `JSX.HTMLAttributes<HTMLElement>`.

| Prop           | Type                              | Required | Default | Description                                               |
| -------------- | --------------------------------- | -------- | ------- | --------------------------------------------------------- |
| `currentPage`  | `number`                          | Yes      | —       | The current active page (1-indexed)                       |
| `totalPages`   | `number`                          | Yes      | —       | Total count of pages available                            |
| `onPageChange` | `(page: number) => void`          | No       | —       | Callback fired when a page number or Prev/Next is clicked |
| `class`        | `string`                          | No       | —       | Custom CSS classes                                        |
| _(inherited)_  | `JSX.HTMLAttributes<HTMLElement>` | —        | —       | All standard nav attributes                               |

### Behavior

- Renders a `<nav>` with numbered page buttons and `ChevronLeft`/`ChevronRight` prev/next icons (from `lucide-solid`).
- `onPageChange` fires with the target page number (1-indexed).
- Current page is visually highlighted.

---

## Menubar

A desktop-style horizontal navigation bar with dropdown menus.

```tsx
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@cdx-foundation/cdx-solidjs-components';

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem onClick={() => console.log('new')}>New</MenubarItem>
      <MenubarItem onClick={() => console.log('open')}>Open</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem onClick={() => console.log('undo')}>Undo</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>;
```

### Components

#### `Menubar`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Required | Description                                         |
| ------------- | ------------------------------------ | -------- | --------------------------------------------------- |
| `children`    | `JSX.Element`                        | Yes      | A sequential collection of `MenubarMenu` components |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | —        | All standard div attributes                         |

#### `MenubarMenu`

| Prop       | Type          | Required | Description                               |
| ---------- | ------------- | -------- | ----------------------------------------- |
| `trigger`  | `JSX.Element` | Yes      | The text or element in the horizontal bar |
| `children` | `JSX.Element` | Yes      | The content of the dropdown menu          |
| `class`    | `string`      | No       | Custom CSS classes for the menu container |

#### `MenubarTrigger`

Extends `JSX.HTMLAttributes<HTMLDivElement>`. The clickable bar element.

#### `MenubarContent`

Extends `JSX.HTMLAttributes<HTMLDivElement>`. The dropdown panel.

#### `MenubarItem`

Extends `JSX.HTMLAttributes<HTMLDivElement>`. Individual menu entry.

### Behavior

- Uses the `clickOutside` directive (from `../directives`) for outside-click dismissal.
- Uses `createShortcut` from `@solid-primitives/keyboard` for Escape-to-close.
- `onClick` on `MenubarTrigger` toggles `isOpen()`.
- `onClick` on `MenubarItem` closes the menu (`setIsOpen(false)`) then fires the user handler.
- Closes on outside `mousedown`.
- Animation: `animate-in fade-in`.

---

## NavigationMenu

Site-wide navigation with rich dropdown panels that open on hover with a grace period.

```tsx
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@cdx-foundation/cdx-solidjs-components';

<NavigationMenu>
  <NavigationMenuItem trigger="Products">
    <div class="p-4 w-[400px]">
      <h4>Our Products</h4>
      <NavigationMenuLink href="/widget">Widget</NavigationMenuLink>
      <NavigationMenuLink href="/gadget">Gadget</NavigationMenuLink>
    </div>
  </NavigationMenuItem>
  <NavigationMenuItem trigger="Docs">
    <div class="p-4">
      <NavigationMenuLink href="/getting-started">Getting Started</NavigationMenuLink>
    </div>
  </NavigationMenuItem>
</NavigationMenu>;
```

### Components

#### `NavigationMenu`

Extends `JSX.HTMLAttributes<HTMLElement>`.

| Prop          | Type                              | Required | Description                                     |
| ------------- | --------------------------------- | -------- | ----------------------------------------------- |
| `children`    | `JSX.Element`                     | Yes      | A collection of `NavigationMenuItem` components |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLElement>` | —        | All standard HTML attributes                    |

#### `NavigationMenuItem`

| Prop       | Type          | Required | Description                               |
| ---------- | ------------- | -------- | ----------------------------------------- |
| `trigger`  | `JSX.Element` | Yes      | The text or element in the navigation bar |
| `children` | `JSX.Element` | Yes      | The content panel displayed on hover      |

#### `NavigationMenuLink`

Extends `JSX.AnchorHTMLAttributes<HTMLAnchorElement>`. A styled anchor link.

### Behavior

- **Hover open with grace period:** `onMouseEnter` clears timeout and sets `isOpen(true)`; `onMouseLeave` sets a 200ms timeout before closing.
- Uses `createSignal` for open state.
- Animation: `animate-in fade-in`.
- Semantic `<nav>`/`<ul>`/`<li>` structure.

---

## Command

A fast, keyboard-driven command menu with filtering — ideal for Cmd/Ctrl+K palettes.

```tsx
import { Command, CommandGroup, CommandItem } from '@cdx-foundation/cdx-solidjs-components';

function CommandPalette() {
  const [open, setOpen] = createSignal(false);

  // Bind Cmd/Ctrl+K
  createShortcut(['Meta', 'k'], () => setOpen(true));

  return (
    <Command
      isOpen={open()}
      onClose={() => setOpen(false)}
      placeholder="Type a command or search..."
    >
      <CommandGroup heading="Actions">
        <CommandItem value="new-file" keywords={['create', 'add']}>
          New File
        </CommandItem>
        <CommandItem value="settings" keywords={['prefs', 'config']}>
          Settings
        </CommandItem>
      </CommandGroup>
    </Command>
  );
}
```

### Components

#### `Command`

| Prop          | Type                      | Required | Default                         | Description                                       |
| ------------- | ------------------------- | -------- | ------------------------------- | ------------------------------------------------- |
| `isOpen`      | `boolean`                 | Yes      | —                               | Toggles visibility of the command palette overlay |
| `onClose`     | `() => void`              | Yes      | —                               | Handler called on ESC or backdrop click           |
| `placeholder` | `string`                  | No       | `'Type a command or search...'` | Custom hint text in the search input              |
| `children`    | `JSX.Element`             | Yes      | —                               | Tree of `CommandGroup` and `CommandItem` children |
| `class`       | `string`                  | No       | —                               | Custom CSS classes for the modal container        |
| `onSelect`    | `(value: string) => void` | No       | —                               | Fires when an item is confirmed (click or Enter)  |

#### `CommandItem`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Description                                                                      |
| ------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| `value`       | `string`                             | Programmatic value returned via `onSelect`. Also used for searching if provided. |
| `keywords`    | `string[]`                           | Additional terms that trigger visibility (e.g. `['prefs']` for `'settings'`)     |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | All standard div attributes                                                      |

#### `CommandGroup`

| Prop       | Type          | Required | Description                                |
| ---------- | ------------- | -------- | ------------------------------------------ |
| `heading`  | `string`      | Yes      | Section title displayed in bold uppercase  |
| `children` | `JSX.Element` | Yes      | Collection of `CommandItem` components     |
| `class`    | `string`      | No       | Custom CSS classes for the group container |

### Keyboard Navigation

| Key         | Behavior                             |
| ----------- | ------------------------------------ |
| `ArrowDown` | Move focus to next item              |
| `ArrowUp`   | Move focus to previous item          |
| `Enter`     | Confirm selection (fires `onSelect`) |
| `Escape`    | Close (fires `onClose`)              |

### Behavior

- **Context-based item registry:** Uses `createContext` to share `search`, `setSearch`, `isActive`, `setActiveId`, `registerItem`, `unregisterItem` across `CommandItem` instances.
- **Filtering:** Items match against `value`, `keywords`, and children text.
- `CommandItem.onMouseEnter` sets the active ID on hover.
- `CommandItem.onClick` triggers `onSelect` via `itemRef.click()`.
- Renders in a `<Portal>` with a backdrop.
- Animation: `animate-in fade-in duration-200`.

---

## ContextMenu

A custom right-click interaction menu that opens at the cursor position.

```tsx
import { ContextMenu, ContextMenuItem } from '@cdx-foundation/cdx-solidjs-components';

<ContextMenu
  menu={
    <>
      <ContextMenuItem onClick={() => console.log('copy')}>Copy</ContextMenuItem>
      <ContextMenuItem onClick={() => console.log('paste')}>Paste</ContextMenuItem>
    </>
  }
>
  <div class="p-8 border">Right-click here</div>
</ContextMenu>;
```

### Props

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop       | Type          | Required | Description                                                                       |
| ---------- | ------------- | -------- | --------------------------------------------------------------------------------- |
| `children` | `JSX.Element` | Yes      | The trigger area — right-clicking anywhere within opens the menu                  |
| `menu`     | `JSX.Element` | Yes      | Content to render inside the floating menu (usually `ContextMenuItem` components) |
| `class`    | `string`      | No       | Custom CSS classes for the wrapper element                                        |

### `ContextMenuItem`

Extends `JSX.HTMLAttributes<HTMLDivElement>`. Individual menu entry.

### Behavior

- **Right-click:** `onContextMenu` calls `e.preventDefault()` then opens the menu at `e.clientX`, `e.clientY`.
- **Global `click` listener:** Closes the menu if open.
- **Global `contextmenu` listener:** Closes the menu if any other context menu opens.
- Renders in a `<Portal>`.
- Animation: `animate-in fade-in`.

---

## DropdownMenu

A list of actions triggered by an element click.

```tsx
import { DropdownMenu, DropdownMenuItem } from '@cdx-foundation/cdx-solidjs-components';

<DropdownMenu trigger={<Button>Open Menu</Button>}>
  <DropdownMenuItem onClick={() => console.log('edit')}>Edit</DropdownMenuItem>
  <DropdownMenuItem onClick={() => console.log('duplicate')}>Duplicate</DropdownMenuItem>
  <DropdownMenuItem disabled>Delete</DropdownMenuItem>
</DropdownMenu>;
```

### Components

#### `DropdownMenu`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop       | Type          | Required | Description                                                               |
| ---------- | ------------- | -------- | ------------------------------------------------------------------------- |
| `trigger`  | `JSX.Element` | Yes      | The interactive element (e.g. Button or Avatar) that toggles the menu     |
| `children` | `JSX.Element` | Yes      | List of items, separators, or custom content (usually `DropdownMenuItem`) |
| `class`    | `string`      | No       | Custom CSS classes for the floating menu panel                            |

#### `DropdownMenuItem`

Extends `JSX.HTMLAttributes<HTMLDivElement>`.

| Prop          | Type                                 | Description                                       |
| ------------- | ------------------------------------ | ------------------------------------------------- |
| _(inherited)_ | `JSX.HTMLAttributes<HTMLDivElement>` | All standard div attributes (supports `disabled`) |

### Behavior

- `onClick` on trigger toggles `isOpen()`.
- `onClick` on `DropdownMenuItem` closes the menu (`setIsOpen(false)`) then fires the user handler.
- **Outside click:** Closes if `mousedown` is outside both trigger and content (via `createEffect`).
- **Escape:** Closes when Escape is pressed (via `createShortcut` from `@solid-primitives/keyboard`).
- Uses the `Floating` component for portal-based positioning.
- Animation: `animate-in fade-in`.
- Disabled state: `disabled:opacity-50 disabled:cursor-not-allowed` on buttons; `data-disabled:pointer-events-none data-disabled:opacity-50` on div-based items.
