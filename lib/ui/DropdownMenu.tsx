import { createShortcut } from '@solid-primitives/keyboard';
import { type JSX, Show, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { clickOutside } from '../directives';

// Suppress unused warning for directive
false && clickOutside;

/**
 * Configuration properties for the Root DropdownMenu container.
 */
interface DropdownMenuProps {
  /**
   * The interactive element (e.g., Button or Avatar) that toggles the menu when clicked.
   */
  trigger: JSX.Element;

  /**
   * The list of items, separators, or custom content to display within the menu.
   * Usually a collection of `DropdownMenuItem` components.
   */
  children: JSX.Element;

  /**
   * Custom CSS classes for the floating menu panel.
   */
  class?: string;
}

/**
 * ### DropdownMenu Component
 *
 * A versatile menu that displays a list of actions or options when triggered.
 * Built with the compound component pattern, it handles its own visibility state and
 * automatically closes when clicking outside or selecting an item.
 *
 * @example
 * ```tsx
 * <DropdownMenu trigger={<Button>Actions</Button>}>
 *   <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
 *   <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuItem variant="destructive" onClick={handleDelete}>
 *     Delete
 *   </DropdownMenuItem>
 * </DropdownMenu>
 * ```
 *
 * **Components:**
 * - `DropdownMenu`: Root container for state and trigger.
 * - `DropdownMenuItem`: An individual interactive entry in the menu.
 * - `DropdownMenuSeparator`: A thin visual divider used to group related items.
 *
 * **Behaviors:**
 * - **Dismissal:** Uses the `clickOutside` directive and `Escape` key for reliable closure.
 * - **Animations:** Subtle fade and vertical slide-in transition.
 * - **Aesthetics:** Uses the `panel` background and `stroke` border for a clean, consistent look.
 *
 * @param props - Root configuration including the `trigger` element.
 */
export const DropdownMenu = (props: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  createShortcut(['Escape'], () => {
    if (isOpen()) setIsOpen(false);
  });

  return (
    <div class="relative inline-block text-left" use:clickOutside={() => setIsOpen(false)}>
      <div onClick={() => setIsOpen(!isOpen())} class="cursor-pointer">
        {props.trigger}
      </div>
      <Show when={isOpen()}>
        <div
          class={twMerge(
            'absolute right-0 z-50 mt-2 w-48 border border-stroke bg-panel p-1 shadow-md animate-in fade-in slide-in-from-top-2 duration-150',
            props.class,
          )}
          onClick={() => setIsOpen(false)}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
};

/**
 * An individual interactive element within the `DropdownMenu`.
 */
export const DropdownMenuItem = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <div
      class={twMerge(
        'relative flex cursor-pointer select-none items-center px-2 py-1.5 text-sm outline-none transition-colors hover:bg-surface hover:text-fg data-disabled:pointer-events-none data-disabled:opacity-50',
        local.class,
      )}
      {...others}
    />
  );
};

/**
 * A visual horizontal separator for grouping items within the `DropdownMenu`.
 */
export const DropdownMenuSeparator = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  return <div class="my-1 h-px bg-stroke" {...props} />;
};
