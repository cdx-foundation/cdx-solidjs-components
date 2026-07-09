import { makeEventListener } from '@solid-primitives/event-listener';
import { createShortcut } from '@solid-primitives/keyboard';
import { type JSX, createEffect, createSignal, onCleanup, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { Floating } from './Floating';

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
 * - **Dismissal:** Uses a document-level `mousedown` listener and `Escape` key for reliable closure.
 * - **Portal rendering:** Uses the `Floating` component to escape parent `overflow: hidden` clipping.
 * - **Animations:** Subtle fade and vertical slide-in transition.
 * - **Aesthetics:** Uses the `panel` background and `stroke` border for a clean, consistent look.
 *
 * @param props - Root configuration including the `trigger` element.
 */
export const DropdownMenu = (props: DropdownMenuProps) => {
  const [local, others] = splitProps(props, ['trigger', 'children', 'class']);
  const [isOpen, setIsOpen] = createSignal(false);
  let triggerRef: HTMLDivElement | undefined;
  let contentRef: HTMLDivElement | undefined;

  createShortcut(['Escape'], () => {
    if (isOpen()) setIsOpen(false);
  });

  // Click outside detection: only active when the menu is open
  createEffect(() => {
    if (!isOpen()) return;
    const dispose = makeEventListener(document, 'mousedown', (e: MouseEvent) => {
      if (
        triggerRef &&
        !triggerRef.contains(e.target as Node) &&
        contentRef &&
        !contentRef.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    });
    onCleanup(dispose);
  });

  return (
    <Floating isOpen={isOpen()}>
      <div class="inline-block text-left" {...others}>
        <Floating.Trigger>
          <div
            ref={(el) => {
              triggerRef = el as HTMLDivElement;
            }}
            onClick={() => setIsOpen(!isOpen())}
            class="cursor-pointer"
          >
            {local.trigger}
          </div>
        </Floating.Trigger>
        <Floating.Content
          isOpen={isOpen()}
          align="bottom-right"
          sideOffset={8}
          class={twMerge(
            'w-48 border border-stroke bg-panel p-1 shadow-md animate-in fade-in duration-100',
            local.class,
          )}
          ref={(el) => {
            contentRef = el as HTMLDivElement;
          }}
          onClick={() => setIsOpen(false)}
        >
          {local.children}
        </Floating.Content>
      </div>
    </Floating>
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
  const [local, others] = splitProps(props, ['class']);
  return <div class={twMerge('my-1 h-px bg-stroke', local.class)} {...others} />;
};
