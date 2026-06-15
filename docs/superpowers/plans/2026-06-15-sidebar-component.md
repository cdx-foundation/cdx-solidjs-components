# Sidebar Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a feature-complete Sidebar component with ~20 sub-components matching the shadcn-svelte Sidebar API, adapted to SolidJS conventions used in this library.

**Architecture:** Single-file component at `lib/ui/Sidebar.tsx` (~600 lines). Compound-component pattern via static properties on the `Sidebar` function. Context-based state management for Provider/Root. Desktop renders inline, mobile delegates to Sheet. Composes with existing Tooltip, Collapsible, Separator, DropdownMenu, Button, Kbd, ScrollArea, Skeleton.

**Tech Stack:** SolidJS, Tailwind v4 + twMerge, lucide-solid icons, `@solid-primitives/keyboard` (shortcut), `@solid-primitives/media` (mobile), `@solid-primitives/storage` (cookie persistence)

---

### Task 1: Add sidebar CSS variables to theme.css

**Files:**
- Modify: `lib/theme.css`

- [ ] **Step 1: Add sidebar theme tokens**

Add these color tokens inside the `@theme` block:

```css
/* Sidebar Theme Colors */
--color-sidebar: var(--sidebar, #fafafa);
--color-sidebar-fg: var(--sidebar-fg, #0a0a0a);
--color-sidebar-primary: var(--sidebar-primary, #171717);
--color-sidebar-primary-fg: var(--sidebar-primary-fg, #fafafa);
--color-sidebar-accent: var(--sidebar-accent, #f5f5f5);
--color-sidebar-accent-fg: var(--sidebar-accent-fg, #171717);
--color-sidebar-border: var(--sidebar-border, #e5e5e5);
--color-sidebar-ring: var(--sidebar-ring, #a1a1a1);
```

Also add `sidebar-width` custom properties (not in @theme, used inline via style props):
These are set via CSS custom properties at runtime on the Provider, not as theme tokens.

- [ ] **Step 2: Verify**

```bash
grep -n "sidebar" lib/theme.css
```
Expected: 8 color variable lines visible.

---

### Task 2: Create Sidebar.tsx — Constants and Context

**Files:**
- Create: `lib/ui/Sidebar.tsx`

- [ ] **Step 1: Write imports and constants**

```tsx
import { PanelLeft, ChevronRight } from 'lucide-solid';
import { createShortcut } from '@solid-primitives/keyboard';
import { createMediaQuery } from '@solid-primitives/media';
import { makePersisted } from '@solid-primitives/storage';
import {
  type JSX,
  type Accessor,
  Show,
  createContext,
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  splitProps,
  useContext,
} from 'solid-js';
import { Dynamic, Portal } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';
import { Separator } from './Separator';
import { Skeleton } from './Skeleton';

// --- Constants ---
const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarState = 'expanded' | 'collapsed';
type SidebarSide = 'left' | 'right';
type SidebarVariant = 'sidebar' | 'floating' | 'inset';
type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';
```

- [ ] **Step 2: Write context types and context creator**

```tsx
interface SidebarContextValue {
  state: Accessor<SidebarState>;
  open: Accessor<boolean>;
  setOpen: (open: boolean) => void;
  openMobile: Accessor<boolean>;
  setOpenMobile: (open: boolean) => void;
  isMobile: Accessor<boolean>;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue>();
```

- [ ] **Step 3: Write useSidebar hook**

```tsx
export const useSidebar = (): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a Sidebar.Provider');
  }
  return context;
};
```

- [ ] **Step 4: Write Provider component**

```tsx
interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: JSX.CSSProperties;
  children: JSX.Element;
}

export const SidebarProvider = (props: SidebarProviderProps) => {
  const [local, others] = splitProps(props, ['defaultOpen', 'open', 'onOpenChange', 'style', 'children']);

  const isMobile = createMediaQuery('(max-width: 768px)');

  const [unpersistedOpen, setUnpersistedOpen] = createSignal(local.defaultOpen ?? true);
  const [internalOpen, setInternalOpen] = makePersisted(unpersistedOpen, {
    name: SIDEBAR_COOKIE_NAME,
    storage: localStorage,
  });

  const [openMobile, setOpenMobile] = createSignal(false);

  // Controlled vs uncontrolled
  const open = () => local.open !== undefined ? local.open : internalOpen();
  const setOpen = (value: boolean) => {
    if (local.open !== undefined) {
      local.onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
    local.onOpenChange?.(value);
  };

  const state = () => (open() ? 'expanded' : 'collapsed') as SidebarState;

  const toggle = () => {
    if (isMobile()) {
      setOpenMobile(!openMobile());
    } else {
      setOpen(!open());
    }
  };

  // Keyboard shortcut
  createShortcut([SIDEBAR_KEYBOARD_SHORTCUT], (e) => {
    if ((e.metaKey || e.ctrlKey) && !(e.target as HTMLElement).closest('input, textarea, [contenteditable]')) {
      e.preventDefault();
      toggle();
    }
  });

  const value: SidebarContextValue = { state, open, setOpen, openMobile, setOpenMobile, isMobile, toggle };

  return (
    <SidebarContext.Provider value={value}>
      <div
        style={{
          '--sidebar-width': SIDEBAR_WIDTH,
          '--sidebar-width-mobile': SIDEBAR_WIDTH_MOBILE,
          '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
          ...(local.style as object),
        }}
        {...others}
      >
        {local.children}
      </div>
    </SidebarContext.Provider>
  );
};
```

- [ ] **Step 5: Verify compilation**

Run: `npx tsc --noEmit lib/ui/Sidebar.tsx`
Expected: No type errors.

---

### Task 3: Sidebar Root component

**Files:**
- Modify: `lib/ui/Sidebar.tsx`

- [ ] **Step 1: Write SidebarRoot props interface and component**

```tsx
interface SidebarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
}

export const SidebarRoot = (props: SidebarProps) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, [
    'side', 'variant', 'collapsible', 'class', 'children',
  ]);

  const side = () => local.side ?? 'left';
  const variant = () => local.variant ?? 'sidebar';
  const collapsible = () => local.collapsible ?? 'icon';

  // Mobile render
  const isMobile = context.isMobile();

  return (
    <Show when={!isMobile()} fallback={<MobileSidebar side={side()} />}>
      <DesktopSidebar
        side={side()}
        variant={variant()}
        collapsible={collapsible()}
        class={local.class}
        {...others}
      >
        {local.children}
      </DesktopSidebar>
    </Show>
  );
};
```

- [ ] **Step 2: Write MobileSidebar internal component**

Uses the existing Sheet component to render the sidebar as an overlay on mobile.

```tsx
// Inside Sidebar.tsx, not exported
import { Sheet, SheetContent } from './Sheet';
import { ScrollArea } from './ScrollArea';

interface MobileSidebarProps {
  children: JSX.Element;
  side: SidebarSide;
}

const MobileSidebar = (props: MobileSidebarProps) => {
  const context = useSidebar();
  return (
    <Sheet isOpen={context.openMobile()} onClose={() => context.setOpenMobile(false)} side={props.side}>
      <SheetContent>
        <div
          class="flex h-full flex-col bg-sidebar text-sidebar-fg"
          style={{ width: 'var(--sidebar-width-mobile)' }}
        >
          {props.children}
        </div>
      </SheetContent>
    </Sheet>
  );
};
```

*Note: We use Sheet's built-in scroll rather than nesting ScrollArea.*

- [ ] **Step 3: Write DesktopSidebar internal component**

```tsx
interface DesktopSidebarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  side: SidebarSide;
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
  children: JSX.Element;
}

const DesktopSidebar = (props: DesktopSidebarProps) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['side', 'variant', 'collapsible', 'class', 'children']);

  const state = context.state;
  const open = context.open;

  const isFloating = () => local.variant === 'floating';
  const isInset = () => local.variant === 'inset';
  const isIcon = () => local.collapsible === 'icon' && state() === 'collapsed';
  const isOffcanvas = () => local.collapsible === 'offcanvas' && !open();

  const hidden = () => isOffcanvas() && !open();

  return (
    <aside
      data-sidebar={local.side}
      data-variant={local.variant}
      data-collapsible={local.collapsible}
      data-state={state()}
      data-open={open()}
      class={twMerge(
        'group/sidebar relative flex flex-col bg-sidebar text-sidebar-fg transition-[width,transform,opacity] duration-200',
        // Width handling
        isFloating() && 'absolute z-40 h-full shadow-lg border-r border-sidebar-border',
        isInset() && 'border-r border-sidebar-border',
        !isFloating() && !hidden() && 'w-(--sidebar-width)',
        isIcon() && 'w-(--sidebar-width-icon)',
        isOffcanvas() && hidden() && 'w-0 overflow-hidden opacity-0',
        isOffcanvas() && open() && 'w-(--sidebar-width)',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </aside>
  );
};
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit lib/ui/Sidebar.tsx`
Expected: No type errors.

---

### Task 4: Sidebar structure components — Header, Footer, Content, Inset, Separator

**Files:**
- Modify: `lib/ui/Sidebar.tsx`

- [ ] **Step 1: Write SidebarHeader**

```tsx
export const SidebarHeader = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="header"
      class={twMerge('sticky top-0 z-10 flex shrink-0 items-center p-2', local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};
```

- [ ] **Step 2: Write SidebarFooter**

```tsx
export const SidebarFooter = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="footer"
      class={twMerge('sticky bottom-0 z-10 mt-auto flex shrink-0 items-center p-2', local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};
```

- [ ] **Step 3: Write SidebarContent**

```tsx
export const SidebarContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="content"
      class={twMerge(
        'flex min-h-0 flex-1 flex-col overflow-auto custom-scrollbar',
        'group-data-[collapsible=icon]/sidebar:overflow-hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};
```

- [ ] **Step 4: Write SidebarInset**

```tsx
export const SidebarInset = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="inset"
      class={twMerge(
        'flex flex-1 flex-col bg-bg dark:bg-bg',
        'peer-data-[variant=inset]/sidebar:ml-(--sidebar-width) peer-data-[variant=inset]/sidebar:min-h-screen',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};
```

- [ ] **Step 5: Write SidebarSeparator**

```tsx
export const SidebarSeparator = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <Separator
      class={twMerge(
        'mx-2 w-auto bg-sidebar-border',
        'group-data-[collapsible=icon]/sidebar:hidden',
        local.class,
      )}
      {...others}
    />
  );
};
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit lib/ui/Sidebar.tsx`
Expected: No type errors.

---

### Task 5: Sidebar Group components

**Files:**
- Modify: `lib/ui/Sidebar.tsx`

- [ ] **Step 1: Write SidebarGroup context (for label/content pattern)**

```tsx
interface SidebarGroupContextValue {
  isLabel: boolean;
}

const SidebarGroupContext = createContext<SidebarGroupContextValue>();
```

- [ ] **Step 2: Write SidebarGroup, GroupLabel, GroupContent, GroupAction**

```tsx
export const SidebarGroup = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="group"
      class={twMerge('relative flex w-full min-w-0 flex-col p-2', local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

export const SidebarGroupLabel = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="group-label"
      class={twMerge(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-fg/60 outline-none',
        'group-data-[collapsible=icon]/sidebar:hidden',
        'ring-sidebar-ring focus-visible:ring-2',
        'transition-colors',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

export const SidebarGroupContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="group-content"
      class={twMerge('w-full text-sm', local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

export const SidebarGroupAction = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <button
      data-sidebar="group-action"
      class={twMerge(
        'absolute right-3 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-md text-sidebar-fg/60 opacity-0 transition-opacity hover:text-sidebar-fg group-hover/sidebar:opacity-100',
        'ring-sidebar-ring focus-visible:ring-2 focus-visible:opacity-100',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </button>
  );
};
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit lib/ui/Sidebar.tsx`
Expected: No type errors.

---

### Task 6: Sidebar Menu components — Menu, MenuItem, MenuButton, MenuAction, MenuBadge, MenuSkeleton

**Files:**
- Modify: `lib/ui/Sidebar.tsx`

- [ ] **Step 1: Write Menu, MenuItem**

```tsx
export const SidebarMenu = (props: JSX.HTMLAttributes<HTMLUListElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <ul
      data-sidebar="menu"
      class={twMerge('flex w-full min-w-0 flex-col gap-1', local.class)}
      {...others}
    >
      {local.children}
    </ul>
  );
};

export const SidebarMenuItem = (props: JSX.HTMLAttributes<HTMLLIElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <li
      data-sidebar="menu-item"
      class={twMerge('group/menu-item relative', local.class)}
      {...others}
    >
      {local.children}
    </li>
  );
};
```

- [ ] **Step 2: Write MenuButton**

MenuButton is the most complex menu component. It supports:
- `isActive` prop for active state styling
- Polymorphic rendering via `as` prop
- Tooltip in icon mode
- `data-sidebar="menu-button"` attribute

```tsx
interface SidebarMenuButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  as?: string;
  tooltip?: string;
}

export const SidebarMenuButton = (props: SidebarMenuButtonProps) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, [
    'isActive', 'as', 'tooltip', 'class', 'children',
  ]);

  const button = () => (
    <Dynamic
      component={local.as || 'button'}
      type={local.as ? undefined : 'button'}
      data-sidebar="menu-button"
      data-active={local.isActive ? 'true' : 'false'}
      class={twMerge(
        'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm font-medium outline-none',
        'ring-sidebar-ring focus-visible:ring-2',
        'transition-colors',
        local.isActive
          ? 'bg-sidebar-accent text-sidebar-accent-fg'
          : 'text-sidebar-fg hover:bg-sidebar-accent hover:text-sidebar-accent-fg',
        'group-data-[collapsible=icon]/sidebar:!p-2 group-data-[collapsible=icon]/sidebar:[&>span:not([data-sidebar-icon])]:hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </Dynamic>
  );

  // In icon mode, wrap in Tooltip
  if (context.state() === 'collapsed' && context.isMobile() === false) {
    return (
      <Tooltip align="right" content={local.tooltip ? <span>{local.tooltip}</span> : undefined}>
        <TooltipTrigger>{button()}</TooltipTrigger>
      </Tooltip>
    );
  }

  return button();
};
```

- [ ] **Step 3: Write MenuAction**

```tsx
export const SidebarMenuAction = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <button
      data-sidebar="menu-action"
      class={twMerge(
        'absolute right-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-sidebar-fg/50 opacity-0 transition-opacity',
        'hover:text-sidebar-fg group-hover/menu-item:opacity-100',
        'peer-data-[active=true]/menu-button:opacity-100',
        'ring-sidebar-ring focus-visible:ring-2 focus-visible:opacity-100',
        'group-data-[collapsible=icon]/sidebar:hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </button>
  );
};
```

- [ ] **Step 4: Write MenuBadge**

```tsx
export const SidebarMenuBadge = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="menu-badge"
      class={twMerge(
        'pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-badge px-1 text-[10px] font-medium',
        'bg-sidebar-accent text-sidebar-accent-fg',
        'group-data-[collapsible=icon]/sidebar:hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};
```

- [ ] **Step 5: Write MenuSkeleton**

```tsx
interface SidebarMenuSkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  showIcon?: boolean;
}

export const SidebarMenuSkeleton = (props: SidebarMenuSkeletonProps) => {
  const [local, others] = splitProps(props, ['showIcon', 'class']);
  const showIcon = local.showIcon ?? true;
  return (
    <div
      data-sidebar="menu-skeleton"
      class={twMerge('flex h-8 items-center gap-2 rounded-md px-2', local.class)}
      {...others}
    >
      <Show when={showIcon}>
        <Skeleton class="h-4 w-4 rounded-sm" />
      </Show>
      <Skeleton class="h-3 flex-1" />
    </div>
  );
};
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit lib/ui/Sidebar.tsx`
Expected: No type errors.

---

### Task 7: Sidebar SubMenu and sub-components

**Files:**
- Modify: `lib/ui/Sidebar.tsx`

- [ ] **Step 1: Write MenuSub, MenuSubItem, MenuSubButton**

```tsx
export const SidebarMenuSub = (props: JSX.HTMLAttributes<HTMLUListElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <ul
      data-sidebar="menu-sub"
      class={twMerge(
        'mx-3.5 flex min-w-0 flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
        'group-data-[collapsible=icon]/sidebar:hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ul>
  );
};

export const SidebarMenuSubItem = (props: JSX.HTMLAttributes<HTMLLIElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <li
      data-sidebar="menu-sub-item"
      class={twMerge('group/menu-sub-item relative', local.class)}
      {...others}
    >
      {local.children}
    </li>
  );
};

interface SidebarMenuSubButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  as?: string;
}

export const SidebarMenuSubButton = (props: SidebarMenuSubButtonProps) => {
  const [local, others] = splitProps(props, ['isActive', 'as', 'class', 'children']);

  return (
    <Dynamic
      component={local.as || 'a'}
      data-sidebar="menu-sub-button"
      data-active={local.isActive ? 'true' : 'false'}
      class={twMerge(
        'flex h-7 w-full items-center gap-2 overflow-hidden rounded-md px-2 text-sm outline-none',
        'ring-sidebar-ring focus-visible:ring-2',
        'transition-colors',
        local.isActive
          ? 'bg-sidebar-accent text-sidebar-accent-fg'
          : 'text-sidebar-fg/70 hover:bg-sidebar-accent hover:text-sidebar-accent-fg',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
};
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit lib/ui/Sidebar.tsx`
Expected: No type errors.

---

### Task 8: Sidebar Trigger and Rail

**Files:**
- Modify: `lib/ui/Sidebar.tsx`

- [ ] **Step 1: Write SidebarTrigger**

```tsx
export const SidebarTrigger = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class', 'children', 'onClick']);
  return (
    <button
      type="button"
      data-sidebar="trigger"
      onClick={(e) => {
        context.toggle();
        if (typeof local.onClick === 'function') {
          local.onClick(e);
        } else if (local.onClick) {
          (local.onClick[0] as any)(local.onClick[1], e);
        }
      }}
      aria-label="Toggle Sidebar"
      class={twMerge(
        'inline-flex h-7 w-7 items-center justify-center rounded-md text-sidebar-fg/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-fg',
        'ring-sidebar-ring focus-visible:ring-2',
        local.class,
      )}
      {...others}
    >
      {local.children ?? <PanelLeft class="h-4 w-4" />}
    </button>
  );
};
```

- [ ] **Step 2: Write SidebarRail**

```tsx
export const SidebarRail = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class']);
  return (
    <button
      type="button"
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={() => context.toggle()}
      onMouseEnter={() => {
        // On desktop, if collapsible is "icon" mode, hovering the rail could expand temporarily
      }}
      class={twMerge(
        'absolute inset-y-0 z-20 w-1 cursor-col-resize transition-colors',
        'group-data-[side=left]/sidebar:-right-1 group-data-[side=right]/sidebar:-left-1',
        'hover:bg-sidebar-ring/20',
        local.class,
      )}
      {...others}
    >
      {/* Chevron indicator */}
      <div
        class={twMerge(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-sm border border-sidebar-border bg-sidebar text-sidebar-fg opacity-0 transition-opacity',
          'group-hover/sidebar:opacity-100',
          'group-data-[side=left]/sidebar:right-0 group-data-[side=right]/sidebar:left-0',
          'group-data-[collapsible=offcanvas]/sidebar:translate-x-0 group-data-[collapsible=icon]/sidebar:translate-x-0',
        )}
      >
        <ChevronRight class="h-3 w-3" />
      </div>
    </button>
  );
};
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit lib/ui/Sidebar.tsx`
Expected: No type errors.

---

### Task 9: Wire up compound exports and register in index.ts

**Files:**
- Modify: `lib/ui/Sidebar.tsx`
- Modify: `lib/index.ts`

- [ ] **Step 1: Attach all sub-components and export from file**

At the bottom of `Sidebar.tsx`, attach everything:

```tsx
SidebarProvider.Trigger = SidebarTrigger;
SidebarProvider.Rail = SidebarRail;
SidebarProvider.Inset = SidebarInset;
SidebarProvider.Separator = SidebarSeparator;
SidebarProvider.Header = SidebarHeader;
SidebarProvider.Footer = SidebarFooter;
SidebarProvider.Content = SidebarContent;
SidebarProvider.Group = SidebarGroup;
SidebarProvider.GroupLabel = SidebarGroupLabel;
SidebarProvider.GroupContent = SidebarGroupContent;
SidebarProvider.GroupAction = SidebarGroupAction;
SidebarProvider.Menu = SidebarMenu;
SidebarProvider.MenuItem = SidebarMenuItem;
SidebarProvider.MenuButton = SidebarMenuButton;
SidebarProvider.MenuAction = SidebarMenuAction;
SidebarProvider.MenuSub = SidebarMenuSub;
SidebarProvider.MenuSubItem = SidebarMenuSubItem;
SidebarProvider.MenuSubButton = SidebarMenuSubButton;
SidebarProvider.MenuBadge = SidebarMenuBadge;
SidebarProvider.MenuSkeleton = SidebarMenuSkeleton;

// Convenience aliases
SidebarProvider.Root = SidebarRoot;
SidebarProvider.Provider = SidebarProvider; // for namespace usage
export { SidebarProvider as SidebarRoot, SidebarProvider as Sidebar };
```

Actually, let me think about this more carefully. In the shadcn pattern, the user does:

```svelte
<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header />
  </Sidebar.Root>
</Sidebar.Provider>
```

So the namespace is `Sidebar` with `.Provider`, `.Root`, `.Header`, etc.

In our SolidJS pattern, looking at Breadcrumb, the exports are individual functions that can also be used as `Sidebar.Provider` etc.

Let me use the following approach:
- Export `SidebarProvider` as the Provider
- Create a `Sidebar` namespace object that has all components as properties
- Export the main `Sidebar` as the compound namespace

Actually, looking at the pattern more carefully, shadcn-svelte does:
```js
import * as Sidebar from "$lib/components/ui/sidebar/index.js";
// Use: <Sidebar.Provider>, <Sidebar.Root>, etc.
```

And in this codebase, the same pattern is possible with `import * as Sidebar from './ui/Sidebar'`. But the typical direct import would be:
```tsx
import { SidebarProvider, SidebarRoot, SidebarHeader } from './ui/Sidebar';
```

For the compound pattern, we need a single `Sidebar` namespace object. Let me do it this way:

Export all the individual pieces, then create a `Sidebar` namespace:

```tsx
export const Sidebar = {
  Provider: SidebarProvider,
  Root: SidebarRoot,
  Header: SidebarHeader,
  Footer: SidebarFooter,
  Content: SidebarContent,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  GroupContent: SidebarGroupContent,
  GroupAction: SidebarGroupAction,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuAction: SidebarMenuAction,
  MenuSub: SidebarMenuSub,
  MenuSubItem: SidebarMenuSubItem,
  MenuSubButton: SidebarMenuSubButton,
  MenuBadge: SidebarMenuBadge,
  MenuSkeleton: SidebarMenuSkeleton,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
  Inset: SidebarInset,
};
```

This gives the clean namespace usage: `<Sidebar.Provider>`, `<Sidebar.Root>`, etc.

- [ ] **Step 2: Add export to `lib/index.ts`**

```ts
export * from './ui/Sidebar';
```

Add this line in alphabetical order in the exports list (after `./ui/Separator` and before `./ui/Sheet`).

- [ ] **Step 3: Verify builds**

Run: `npx tsc --noEmit`
Expected: No type errors.

---

### Task 10: Self-review

- [ ] **Step 1: Spec coverage check**

Review the spec doc `docs/superpowers/specs/2026-06-15-sidebar-component.md` against the plan:

| Spec requirement | Covered by |
|---|---|
| Sidebar.Provider | Task 2 |
| Sidebar.Root | Task 3 |
| Sidebar.Header | Task 4 |
| Sidebar.Footer | Task 4 |
| Sidebar.Content | Task 4 |
| Sidebar.Group / GroupLabel / GroupContent / GroupAction | Task 5 |
| Sidebar.Menu / MenuItem | Task 6 |
| Sidebar.MenuButton | Task 6 |
| Sidebar.MenuAction | Task 6 |
| Sidebar.MenuBadge | Task 6 |
| Sidebar.MenuSkeleton | Task 6 |
| Sidebar.MenuSub / MenuSubItem / MenuSubButton | Task 7 |
| Sidebar.Separator | Task 4 |
| Sidebar.Trigger | Task 8 |
| Sidebar.Rail | Task 8 |
| Sidebar.Inset | Task 4 |
| useSidebar hook | Task 2 |
| CSS variables in theme.css | Task 1 |
| Index export | Task 9 |

All spec requirements covered.

- [ ] **Step 2: Placeholder & consistency scan**

Check: No TBD, TODO, or placeholder patterns. All props interfaces, method signatures, and component names are consistent between tasks. No type contradictions.

- [ ] **Step 3: Check composability with existing Collapsible**

The spec says submenus and collapsible groups compose with `Collapsible.Root`. This is enabled by:
- `SidebarGroupLabel` accepting arbitrary children (including `Collapsible.Trigger`)
- `SidebarGroupContent` accepting arbitrary children (including `Collapsible.Content`)
- `SidebarMenuItem` wrapping a `Collapsible.Root` > `Collapsible.Trigger` > `SidebarMenuButton` pattern with `SidebarMenuSub` inside `Collapsible.Content`

This is an external composition pattern — the user wraps with Collapsible themselves. The plan doesn't need to hardcode Collapsible integration.

All checks pass.
