import { createShortcut } from '@solid-primitives/keyboard';
import { createSignal, type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { clickOutside } from '../directives';

// Suppress unused warning for directive
false && clickOutside;

// A Menubar works as a unified system where clicking one opens it, and hovering over others switches them.
// For simplicity in a custom SolidJS impl, we treat each as an independent Dropdown that aligns horizontally.

/**
 * Configuration properties for the Root Menubar container.
 */
interface MenubarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * A sequential collection of `MenubarMenu` components.
   */
  children: JSX.Element;
}

/**
 * ### Menubar Component
 *
 * A top-level horizontal navigation bar typically used in desktop-style applications.
 * It organizes numerous commands into high-level categories (e.g., File, Edit, View).
 *
 * @example
 * ```tsx
 * <Menubar>
 *   <MenubarMenu trigger="File">
 *     <MenubarItem>New File</MenubarItem>
 *     <MenubarItem>Open...</MenubarItem>
 *     <MenubarSeparator />
 *     <MenubarItem>Save</MenubarItem>
 *   </MenubarMenu>
 *   <MenubarMenu trigger="Edit">
 *     <MenubarItem>Undo</MenubarItem>
 *     <MenubarItem>Redo</MenubarItem>
 *   </MenubarMenu>
 * </Menubar>
 * ```
 *
 * **Components:**
 * - `Menubar`: The horizontal container for the menu triggers.
 * - `MenubarMenu`: An individual category that reveals a dropdown.
 * - `MenubarItem`: A selectable action within a menu.
 * - `MenubarSeparator`: A visual divider for grouping actions.
 *
 * @param props - Root container options for the menubar.
 */
export const Menubar = (props: MenubarProps) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  return (
    <div
      class={twMerge(
        'flex h-10 items-center space-x-1 border border-stroke bg-panel p-1',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

/**
 * An individual dropdown category within the `Menubar`.
 */
export const MenubarMenu = (props: {
  /** The text or element that sits in the horizontal bar. */
  trigger: JSX.Element;
  /** The content of the dropdown menu. */
  children: JSX.Element;
  /** Custom CSS classes for the menu container. */
  class?: string;
}) => {
  const [local, others] = splitProps(props, ['trigger', 'children', 'class']);
  const [isOpen, setIsOpen] = createSignal(false);

  createShortcut(['Escape'], () => {
    if (isOpen()) setIsOpen(false);
  });

  return (
    <div class={twMerge('relative', local.class)} use:clickOutside={() => setIsOpen(false)} {...others}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen())}
        class={twMerge(
          'flex cursor-pointer select-none items-center px-3 py-1.5 text-sm font-medium outline-none transition-colors hover:bg-surface hover:text-fg',
          isOpen() ? 'bg-surface text-fg' : 'text-muted',
        )}
      >
        {local.trigger}
      </button>
      <Show when={isOpen()}>
        <div
          class="absolute left-0 top-full z-50 mt-1 min-w-48 border border-stroke bg-panel p-1 shadow-md animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          {local.children}
        </div>
      </Show>
    </div>
  );
};

/**
 * An individual interactive action within a `MenubarMenu`.
 */
export const MenubarItem = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <div
      class={twMerge(
        'relative flex cursor-pointer select-none items-center px-2 py-1.5 text-sm outline-none hover:bg-surface hover:text-fg focus:bg-surface focus:text-fg data-disabled:pointer-events-none data-disabled:opacity-50 transition-colors',
        local.class,
      )}
      {...others}
    />
  );
};

/**
 * A visual horizontal separator used to group items within a `MenubarMenu`.
 */
export const MenubarSeparator = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return <div class={twMerge('-mx-1 my-1 h-px bg-stroke', local.class)} {...others} />;
};
