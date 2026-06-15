import { createShortcut } from '@solid-primitives/keyboard';
import { createMediaQuery } from '@solid-primitives/media';
import { makePersisted } from '@solid-primitives/storage';
import { ChevronRight, PanelLeft } from 'lucide-solid';
import {
  type Accessor,
  type JSX,
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
import { ScrollArea } from './ScrollArea';
import { Separator } from './Separator';
import { Sheet, SheetContent } from './Sheet';
import { Skeleton } from './Skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

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

export const useSidebar = (): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a Sidebar.Provider');
  }
  return context;
};

interface SidebarProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SidebarProvider = (props: SidebarProviderProps) => {
  const [local, others] = splitProps(props, [
    'defaultOpen',
    'open',
    'onOpenChange',
    'style',
    'children',
  ]);

  const isMobile = createMediaQuery('(max-width: 768px)');

  const [internalOpen, setInternalOpen] = makePersisted(createSignal(local.defaultOpen ?? true), {
    name: SIDEBAR_COOKIE_NAME,
    storage: localStorage,
  });

  const [openMobile, setOpenMobile] = createSignal(false);

  // Controlled vs uncontrolled
  const open = () => (local.open !== undefined ? local.open : internalOpen());
  const setOpen = (value: boolean) => {
    if (local.open !== undefined) {
      local.onOpenChange?.(value);
    } else {
      setInternalOpen(value);
      local.onOpenChange?.(value);
    }
  };

  const state = () => (open() ? 'expanded' : 'collapsed') as SidebarState;

  const toggle = () => {
    if (isMobile()) {
      setOpenMobile(!openMobile());
    } else {
      setOpen(!open());
    }
  };

  // Keyboard shortcut: Cmd+B or Ctrl+B
  createShortcut([SIDEBAR_KEYBOARD_SHORTCUT], (e) => {
    if (
      e &&
      (e.metaKey || e.ctrlKey) &&
      !(e.target as HTMLElement).closest('input, textarea, [contenteditable]')
    ) {
      e.preventDefault();
      toggle();
    }
  });

  const value: SidebarContextValue = {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggle,
  };

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

// ─── Sidebar Root ──────────────────────────────────────────────────────────────

export interface SidebarRootProps extends JSX.HTMLAttributes<HTMLDivElement> {
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
}

export const SidebarRoot = (props: SidebarRootProps) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, [
    'side',
    'variant',
    'collapsible',
    'class',
    'children',
  ]);

  const side = () => local.side ?? 'left';
  const variant = () => local.variant ?? 'sidebar';
  const collapsible = () => local.collapsible ?? 'icon';

  return (
    <Show
      when={!context.isMobile()}
      fallback={<MobileSidebar side={side()}>{local.children}</MobileSidebar>}
    >
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

// ─── Mobile Sidebar (internal) ─────────────────────────────────────────────────

const MobileSidebar = (props: { children: JSX.Element; side: SidebarSide }) => {
  const context = useSidebar();
  return (
    <Sheet
      isOpen={context.openMobile()}
      onClose={() => context.setOpenMobile(false)}
      side={props.side}
    >
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

// ─── Desktop Sidebar (internal) ───────────────────────────────────────────────

const DesktopSidebar = (props: {
  side: SidebarSide;
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
  class?: string;
  children: JSX.Element;
  [key: string]: unknown;
}) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, [
    'side',
    'variant',
    'collapsible',
    'class',
    'children',
  ]);

  const state = context.state;
  const open = context.open;

  const isFloating = () => local.variant === 'floating';
  const isOffcanvas = () => local.collapsible === 'offcanvas' && !open();

  return (
    <aside
      data-sidebar={local.side}
      data-variant={local.variant}
      data-collapsible={local.collapsible}
      data-state={state()}
      data-open={open()}
      class={twMerge(
        'group/sidebar relative flex flex-col bg-sidebar text-sidebar-fg transition-[width,transform,opacity] duration-200',
        // Width
        isFloating()
          ? 'absolute z-40 h-full shadow-lg border-r border-sidebar-border'
          : 'border-r border-sidebar-border',
        // Expanded width
        'w-(--sidebar-width)',
        // Icon mode collapse
        state() === 'collapsed' && local.collapsible === 'icon' && 'w-(--sidebar-width-icon)',
        // Offcanvas hidden
        isOffcanvas() && 'w-0 overflow-hidden opacity-0',
        local.class,
      )}
      {...others}
    >
      {context.state() === 'collapsed' && local.collapsible === 'icon' ? (
        <div class="flex flex-col h-full w-full items-center px-1">{local.children}</div>
      ) : (
        local.children
      )}
    </aside>
  );
};

// ─── Sidebar Header ────────────────────────────────────────────────────────────

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

// ─── Sidebar Footer ────────────────────────────────────────────────────────────

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

// ─── Sidebar Content ───────────────────────────────────────────────────────────

export const SidebarContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="content"
      class={twMerge(
        'flex min-h-0 flex-1 flex-col overflow-auto custom-scrollbar',
        context.state() === 'collapsed' && 'overflow-hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

// ─── Sidebar Inset ─────────────────────────────────────────────────────────────

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

// ─── Sidebar Separator ─────────────────────────────────────────────────────────

export const SidebarSeparator = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class']);
  return (
    <Separator
      class={twMerge(
        'mx-2 w-auto bg-sidebar-border',
        context.state() === 'collapsed' && 'hidden',
        local.class,
      )}
      {...others}
    />
  );
};

// ─── Sidebar Group ─────────────────────────────────────────────────────────────

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

// ─── Sidebar Group Label ───────────────────────────────────────────────────────

export const SidebarGroupLabel = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="group-label"
      class={twMerge(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-fg/60 outline-none',
        context.state() === 'collapsed' && 'hidden',
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

// ─── Sidebar Group Content ─────────────────────────────────────────────────────

export const SidebarGroupContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div data-sidebar="group-content" class={twMerge('w-full text-sm', local.class)} {...others}>
      {local.children}
    </div>
  );
};

// ─── Sidebar Group Action ──────────────────────────────────────────────────────

export const SidebarGroupAction = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <button
      data-sidebar="group-action"
      class={twMerge(
        'absolute right-3 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-md text-sidebar-fg/60 opacity-0 transition-opacity hover:text-sidebar-fg group-hover/sidebar:opacity-100',
        'ring-sidebar-ring focus-visible:ring-2 focus-visible:opacity-100',
        context.state() === 'collapsed' && 'hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </button>
  );
};

// ─── Sidebar Menu ──────────────────────────────────────────────────────────────

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

// ─── Sidebar Menu Item ─────────────────────────────────────────────────────────

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

// ─── Sidebar Menu Button ───────────────────────────────────────────────────────

interface SidebarMenuButtonProps extends JSX.HTMLAttributes<HTMLElement> {
  isActive?: boolean;
  as?: string;
  tooltip?: string;
  [key: string]: unknown;
}

export const SidebarMenuButton = (props: SidebarMenuButtonProps) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['isActive', 'as', 'tooltip', 'class', 'children']);

  const isCollapsed = () => context.state() === 'collapsed';

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
        // Icon-mode compact layout only when actually collapsed
        isCollapsed() &&
          '!p-2 w-(--sidebar-width-icon) justify-center [&>span:not([data-sidebar-icon])]:hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </Dynamic>
  );

  // In icon mode, wrap with Tooltip when collapsed on desktop
  if (context.state() === 'collapsed' && !context.isMobile()) {
    const tooltipText = () => {
      if (local.tooltip) return local.tooltip;
      // Try to extract text from children as fallback
      return '';
    };
    return (
      <Tooltip
        trigger={button()}
        content={<span>{tooltipText()}</span>}
        align="right"
        class="w-full"
      />
    );
  }

  return button();
};

// ─── Sidebar Menu Action ───────────────────────────────────────────────────────

export const SidebarMenuAction = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <button
      data-sidebar="menu-action"
      class={twMerge(
        'absolute right-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-sidebar-fg/50 opacity-0 transition-opacity',
        'hover:text-sidebar-fg group-hover/menu-item:opacity-100',
        'peer-data-[active=true]/menu-button:opacity-100',
        'ring-sidebar-ring focus-visible:ring-2 focus-visible:opacity-100',
        context.state() === 'collapsed' && 'hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </button>
  );
};

// ─── Sidebar Menu Badge ────────────────────────────────────────────────────────

export const SidebarMenuBadge = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      data-sidebar="menu-badge"
      class={twMerge(
        'pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-badge px-1 text-[10px] font-medium',
        'bg-sidebar-accent text-sidebar-accent-fg',
        context.state() === 'collapsed' && 'hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

// ─── Sidebar Menu Skeleton ─────────────────────────────────────────────────────

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

// ─── Sidebar Menu Sub ──────────────────────────────────────────────────────────

export const SidebarMenuSub = (props: JSX.HTMLAttributes<HTMLUListElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <ul
      data-sidebar="menu-sub"
      class={twMerge(
        'mx-3.5 flex min-w-0 flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
        context.state() === 'collapsed' && 'hidden',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ul>
  );
};

// ─── Sidebar Menu Sub Item ─────────────────────────────────────────────────────

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

// ─── Sidebar Menu Sub Button ───────────────────────────────────────────────────

interface SidebarMenuSubButtonProps extends JSX.HTMLAttributes<HTMLElement> {
  isActive?: boolean;
  as?: string;
  [key: string]: unknown;
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

// ─── Sidebar Trigger ───────────────────────────────────────────────────────────

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

// ─── Sidebar Rail ──────────────────────────────────────────────────────────────

export const SidebarRail = (props: JSX.HTMLAttributes<HTMLButtonElement>) => {
  const context = useSidebar();
  const [local, others] = splitProps(props, ['class']);
  return (
    <button
      type="button"
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={() => context.toggle()}
      class={twMerge(
        'absolute inset-y-0 z-20 w-1.5 cursor-col-resize transition-colors',
        'group-data-[side=left]/sidebar:-right-1.5 group-data-[side=right]/sidebar:-left-1.5',
        'hover:bg-sidebar-ring/20',
        'group-data-[collapsible=none]/sidebar:hidden',
        local.class,
      )}
      {...others}
    >
      <div
        class={twMerge(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-sm border border-sidebar-border bg-sidebar text-sidebar-fg opacity-0 transition-opacity',
          'group-hover/sidebar:opacity-100',
          'group-data-[side=left]/sidebar:right-0 group-data-[side=right]/sidebar:left-0',
          'group-data-[collapsible=offcanvas]/sidebar:[&>svg]:rotate-180',
        )}
      >
        <ChevronRight class="h-3 w-3" />
      </div>
    </button>
  );
};

// ─── Sidebar Namespace ─────────────────────────────────────────────────────────
// Enables usage: <Sidebar.Provider>, <Sidebar.Root>, <Sidebar.Menu>, etc.

export const Sidebar = {
  Provider: SidebarProvider,
  Root: SidebarRoot,
  Header: SidebarHeader,
  Footer: SidebarFooter,
  Content: SidebarContent,
  Inset: SidebarInset,
  Separator: SidebarSeparator,
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
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
};
