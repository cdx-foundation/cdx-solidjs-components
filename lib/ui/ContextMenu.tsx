import { type JSX, Show, createSignal, onCleanup, onMount, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration properties for the ContextMenu component.
 */
interface ContextMenuProps {
  /**
   * The trigger area. Right-clicking anywhere within this element will open the menu.
   */
  children: JSX.Element;

  /**
   * The content to render inside the floating menu.
   * Usually a collection of `DropdownItem` or similar menu entries.
   */
  menu: JSX.Element;

  /**
   * Custom CSS classes for the wrapper element.
   */
  class?: string;
}

/**
 * ### ContextMenu Component
 *
 * Replaces the browser's default right-click menu with a custom interactive interface.
 * It intelligently positions itself at the exact coordinates of the mouse cursor and
 * provides a seamless transition.
 *
 * @example
 * ```tsx
 * <ContextMenu
 *   menu={
 *     <div class="flex flex-col">
 *       <button class="p-2 hover:bg-surface text-left">Copy</button>
 *       <button class="p-2 hover:bg-surface text-left">Paste</button>
 *     </div>
 *   }
 * >
 *   <div class="p-20 border border-dashed border-stroke text-center">
 *     Right click me to see the magic.
 *   </div>
 * </ContextMenu>
 * ```
 *
 * **Functionality:**
 * - **Dynamic Positioning:** Calculates `clientX` and `clientY` to anchor the menu.
 * - **Portal Injection:** Prevents parent container clipping or z-index conflicts.
 * - **Smart Dismissal:** Automatically closes when the user clicks elsewhere or opens another context menu.
 * - **Animations:** Features a subtle zoom and fade entry.
 *
 * @param props - Customization options including `menu` and `children`.
 */
export const ContextMenu = (props: ContextMenuProps) => {
  const [local, others] = splitProps(props, ['children', 'menu', 'class']);
  const [isOpen, setIsOpen] = createSignal(false);
  const [pos, setPos] = createSignal({ x: 0, y: 0 });

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const handleClickOutside = () => {
    if (isOpen()) setIsOpen(false);
  };

  const handleGlobalContextMenu = () => {
    setIsOpen(false);
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleGlobalContextMenu);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('contextmenu', handleGlobalContextMenu);
  });

  return (
    <div onContextMenu={handleContextMenu} class={twMerge('relative', local.class)} {...others}>
      {local.children}

      <Show when={isOpen()}>
        <Portal>
          <div
            class="fixed z-100 min-w-48 border border-stroke bg-panel p-1 shadow-md animate-in fade-in duration-100"
            style={{ left: `${pos().x}px`, top: `${pos().y}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            {local.menu}
          </div>
        </Portal>
      </Show>
    </div>
  );
};
