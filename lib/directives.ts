import { onCleanup } from 'solid-js';

/**
 * ### clickOutside Directive
 *
 * A SolidJS directive that detects clicks outside of the element it is attached to.
 * Useful for closing menus, modals, and popovers.
 *
 * @example
 * ```tsx
 * <div use:clickOutside={() => setIsOpen(false)}>...</div>
 * ```
 */
export function clickOutside(el: Element, accessor: () => any) {
  const onClick = (e: MouseEvent) => !el.contains(e.target as Node) && accessor()?.(e);
  document.addEventListener('click', onClick);

  onCleanup(() => document.removeEventListener('click', onClick));
}

// Add to global JSX namespace for type safety
declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: (e: MouseEvent) => void;
    }
  }
}
