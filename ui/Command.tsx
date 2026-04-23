import { Search, X } from 'lucide-solid';
import {
  type Accessor,
  type JSX,
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  useContext,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

// --- Context & Types ---

/**
 * Internal data structure for maintaining state across command items.
 */
interface CommandItemData {
  /** Unique numeric identifier for the item. */
  index: number;
  /** Reactive accessor checking if the item matches current filter criteria. */
  isVisible: Accessor<boolean>;
  /** Reference to the physical DOM element for auto-scrolling. */
  ref?: HTMLElement;
}

/**
 * The shared state interface for the Command registry.
 */
interface CommandContextValue {
  /** The current user-inputted search string. */
  search: Accessor<string>;
  /** Updates the global search string across all components. */
  setSearch: (v: string) => void;
  /** The index of the item currently being keyboard-navigated. */
  activeIndex: Accessor<number>;
  /** Updates the focused item index. */
  setActiveIndex: (i: number) => void;
  /** Adds a new `CommandItem` to the active registry. */
  registerItem: (item: CommandItemData) => void;
  /** Removes an item from the registry on component unmount. */
  unregisterItem: (index: number) => void;
}

const CommandContext = createContext<CommandContextValue>();

// --- Main Component ---

/**
 * Configuration and lifecycle properties for the Command component.
 */
interface CommandProps {
  /**
   * Toggles the visibility of the command palette overlay.
   * Typically triggered via a keyboard shortcut (e.g., Cmd/Ctrl + K).
   */
  isOpen: boolean;
  /**
   * Handler called when the user presses 'ESC' or clicks the backdrop.
   */
  onClose: () => void;
  /**
   * Custom hint text shown in the search input when empty.
   * @default "Type a command or search..."
   */
  placeholder?: string;
  /**
   * The tree of `CommandGroup` and `CommandItem` children.
   */
  children: JSX.Element;
  /**
   * Custom CSS classes for the modal container.
   */
  class?: string;
  /**
   * Optional event listener that fires when an item is confirmed (via Click or Enter).
   */
  onSelect?: (value: string) => void;
}

/**
 * ### Command Component (CMDK)
 *
 * A high-performance, accessible command palette and menu system.
 * It handles fuzzy filtering, global keyboard navigation, and intelligent scroll-management out of the box.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = createSignal(false);
 *
 * <Command isOpen={open()} onClose={() => setOpen(false)}>
 *   <CommandGroup heading="Actions">
 *     <CommandItem index={0} value="create-project" onSelect={doCreate}>
 *       Create New Project...
 *     </CommandItem>
 *     <CommandItem index={1} value="settings" onSelect={openSettings}>
 *       Preferences
 *     </CommandItem>
 *   </CommandGroup>
 * </Command>
 * ```
 *
 * **Keyboard Shortcuts:**
 * - `ArrowDown` / `ArrowUp`: Navigate through filtered items.
 * - `Enter`: Select the currently highlighted item.
 * - `ESC`: Close the palette.
 *
 * @param props - Customization options for the palette overlay.
 */
export const Command = (props: CommandProps) => {
  const [local, others] = splitProps(props, [
    'isOpen',
    'onClose',
    'placeholder',
    'children',
    'class',
    'onSelect',
  ]);

  const [search, setSearch] = createSignal('');
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [items, setItems] = createSignal<CommandItemData[]>([]);

  const registerItem = (item: CommandItemData) => {
    setItems((prev) => [...prev, item].sort((a, b) => a.index - b.index));
  };

  const unregisterItem = (index: number) => {
    setItems((prev) => prev.filter((item) => item.index !== index));
  };

  const visibleItems = createMemo(() => items().filter((item) => item.isVisible()));

  let inputRef: HTMLInputElement | undefined;

  // Reset state when opening/closing
  createEffect(() => {
    if (local.isOpen) {
      setSearch('');
      setActiveIndex(0);
      // Use requestAnimationFrame for cleaner focus timing
      requestAnimationFrame(() => inputRef?.focus());
    }
  });

  // Handle scrolling active item into view
  createEffect(() => {
    const idx = activeIndex();
    const activeItem = items().find((it) => it.index === idx);
    if (activeItem?.ref) {
      activeItem.ref.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    const vItems = visibleItems();
    if (vItems.length === 0) {
      if (e.key === 'Escape') local.onClose();
      return;
    }

    const currentVisibleIdx = vItems.findIndex((item) => item.index === activeIndex());

    switch (e.key) {
      case 'Escape':
        local.onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(vItems[(currentVisibleIdx + 1) % vItems.length].index);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(vItems[(currentVisibleIdx - 1 + vItems.length) % vItems.length].index);
        break;
      case 'Enter':
        e.preventDefault();
        vItems[currentVisibleIdx]?.ref?.click();
        break;
    }
  };

  return (
    <Show when={local.isOpen}>
      <Portal>
        <div
          class="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4"
          onKeyDown={handleKeyDown}
        >
          <div
            class="fixed inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={local.onClose}
          />

          <div
            class={twMerge(
              'relative z-101 flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-stroke bg-panel shadow-2xl animate-in fade-in zoom-in-95 duration-200',
              local.class,
            )}
            {...others}
          >
            <CommandContext.Provider
              value={{
                search,
                setSearch,
                activeIndex,
                setActiveIndex,
                registerItem,
                unregisterItem,
              }}
            >
              <div class="flex items-center border-b border-stroke px-4">
                <Search class="mr-3 h-4 w-4 shrink-0 opacity-50" />
                <input
                  ref={inputRef}
                  class="flex h-14 w-full rounded-none bg-transparent py-4 text-base font-medium outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={local.placeholder || 'Type a command or search...'}
                  value={search()}
                  onInput={(e) => {
                    const val = e.currentTarget.value;
                    setSearch(val);
                    // Reset to first visible item after filtering
                    requestAnimationFrame(() => {
                      const v = visibleItems();
                      if (v.length > 0) setActiveIndex(v[0].index);
                    });
                  }}
                />
                <div class="flex items-center gap-2">
                  <kbd class="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-stroke bg-surface px-1.5 font-mono text-[10px] font-medium text-muted opacity-100">
                    ESC
                  </kbd>
                  <button
                    type="button"
                    onClick={local.onClose}
                    class="ml-2 text-muted hover:text-fg outline-none transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div class="max-h-[380px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar scroll-smooth">
                {local.children}
              </div>
            </CommandContext.Provider>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

// --- Sub-Components ---

/**
 * Visual grouping component for organizing `CommandItem` elements.
 */
export const CommandGroup = (props: {
  /** Section title displayed in bold uppercase above the group. */
  heading: string;
  /** A collection of `CommandItem` components. */
  children: JSX.Element;
}) => (
  <div class="overflow-hidden px-1 py-2">
    <div class="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted/60">
      {props.heading}
    </div>
    <div class="flex flex-col gap-0.5">{props.children}</div>
  </div>
);

/**
 * Customization options for individual palette items.
 */
interface CommandItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * A numeric index used for deterministic keyboard navigation.
   * Should be unique within the palette.
   */
  index: number;
  /**
   * A programmatic value returned via `onSelect`. Also used for searching if provided.
   */
  value?: string;
  /**
   * An array of additional terms that will trigger visibility for this item.
   * Useful for matching synonyms (e.g., "prefs" for "settings").
   */
  keywords?: string[];
}

/**
 * An individual interactive entry in the Command palette.
 * It automatically registers itself with the parent `Command` and handles its own visibility logic.
 */
export const CommandItem = (props: CommandItemProps) => {
  const context = useContext(CommandContext);
  const [local, others] = splitProps(props, ['class', 'index', 'value', 'keywords', 'children']);

  if (!context) return null;

  let itemRef: HTMLDivElement | undefined;

  const isVisible = createMemo(() => {
    const s = context.search().toLowerCase();
    if (!s) return true;

    const v = (local.value || '').toLowerCase();
    const c = typeof local.children === 'string' ? local.children.toLowerCase() : '';
    const k = (local.keywords || []).join(' ').toLowerCase();

    return v.includes(s) || c.includes(s) || k.includes(s);
  });

  onMount(() => {
    context.registerItem({
      index: local.index,
      isVisible,
      ref: itemRef,
    });
    onCleanup(() => context.unregisterItem(local.index));
  });

  const isActive = () => context.activeIndex() === local.index;

  return (
    <Show when={isVisible()}>
      <div
        ref={itemRef}
        class={twMerge(
          'relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-all duration-150',
          isActive()
            ? 'bg-primary text-white shadow-md'
            : 'text-fg/80 hover:bg-surface hover:text-fg',
          local.class,
        )}
        data-active={isActive()}
        onMouseEnter={() => context.setActiveIndex(local.index)}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  );
};
