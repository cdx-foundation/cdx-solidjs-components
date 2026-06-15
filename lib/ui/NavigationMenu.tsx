import { ChevronDown } from 'lucide-solid';
import { type JSX, Show, createSignal, onCleanup, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the Root NavigationMenu container.
 */
interface NavigationMenuProps extends JSX.HTMLAttributes<HTMLElement> {
  /**
   * A collection of `NavigationMenuItem` components.
   */
  children: JSX.Element;
}

/**
 * ### NavigationMenu Component
 *
 * A high-level site navigation component that supports hover-activated dropdown menus.
 * Designed for primary application layouts, it combines interactive triggers with rich
 * content panels to provide a structured navigation experience.
 *
 * @example
 * ```tsx
 * <NavigationMenu>
 *   <NavigationMenuItem trigger="Products">
 *     <div class="grid w-[400px] gap-3 p-4">
 *       <NavigationMenuLink href="/seeker">Seeker Explorer</NavigationMenuLink>
 *       <NavigationMenuLink href="/antigravity">Antigravity AI</NavigationMenuLink>
 *     </div>
 *   </NavigationMenuItem>
 *   <NavigationMenuItem trigger="Company">
 *     <div class="flex flex-col w-[200px] p-2">
 *       <NavigationMenuLink href="/about">About Us</NavigationMenuLink>
 *       <NavigationMenuLink href="/careers">Careers</NavigationMenuLink>
 *     </div>
 *   </NavigationMenuItem>
 * </NavigationMenu>
 * ```
 *
 * **Behaviors:**
 * - **Intent-based Hover:** Uses a 200ms grace period on mouse leave to prevent accidental menu closure.
 * - **Visual State:** Includes a rotating chevron icon that indicates whether a menu is expanded.
 * - **Transitions:** Employs a slide-down and fade animation when a menu appears.
 *
 * @param props - Root container options including the navigation items.
 */
export const NavigationMenu = (props: NavigationMenuProps) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  return (
    <nav
      class={twMerge(
        'relative z-10 flex max-w-max flex-1 items-center justify-center',
        local.class,
      )}
      {...others}
    >
      <ul class="group flex flex-1 list-none items-center justify-center space-x-1">
        {local.children}
      </ul>
    </nav>
  );
};

/**
 * An individual interactive category within the `NavigationMenu`.
 */
export const NavigationMenuItem = (props: {
  /** The text or element sitting in the navigation bar. */
  trigger: JSX.Element;
  /** The content panel displayed on hover. */
  children: JSX.Element;
}) => {
  const [isOpen, setIsOpen] = createSignal(false);
  let timeoutId: number | undefined;
  onCleanup(() => clearTimeout(timeoutId));

  const handleEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };
  const handleLeave = () => {
    timeoutId = window.setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <li class="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        class={twMerge(
          'group inline-flex h-10 w-max items-center justify-center bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-surface hover:text-fg focus:bg-surface focus:text-fg outline-none disabled:pointer-events-none disabled:opacity-50',
          isOpen() ? 'bg-surface text-fg' : 'text-muted',
        )}
      >
        {props.trigger}
        <ChevronDown
          class={twMerge(
            'relative top-px ml-1 h-3 w-3 transition duration-200',
            isOpen() && 'rotate-180',
          )}
        />
      </button>
      <Show when={isOpen()}>
        <div class="absolute left-0 top-full flex justify-center w-max animate-in fade-in duration-100 pt-2">
          <div class="overflow-hidden border border-stroke bg-panel shadow-lg">
            {props.children}
          </div>
        </div>
      </Show>
    </li>
  );
};

/**
 * A standard link within a `NavigationMenuItem` dropdown.
 */
export const NavigationMenuLink = (props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <a
      class={twMerge(
        'block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:bg-surface focus:bg-surface text-fg',
        local.class,
      )}
      {...others}
    />
  );
};
