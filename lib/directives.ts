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

/**
 * ### autofocus Directive
 *
 * Automatically focuses the element when it is mounted to the DOM.
 *
 * @example
 * ```tsx
 * <input use:autofocus />
 * ```
 */
export function autofocus(el: HTMLElement) {
  el.focus();
}

/**
 * ### clipboard Directive
 *
 * Copies the provided text to the clipboard when the element is clicked.
 *
 * @example
 * ```tsx
 * <button use:clipboard={() => "Text to copy"}>Copy</button>
 * ```
 */
export function clipboard(el: HTMLElement, accessor: () => string | (() => string)) {
  const onClick = async () => {
    const text =
      typeof accessor() === 'function' ? (accessor() as () => string)() : (accessor() as string);
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  el.addEventListener('click', onClick);
  onCleanup(() => el.removeEventListener('click', onClick));
}

/**
 * ### hover Directive
 *
 * Executes a callback when the hover state of the element changes.
 *
 * @example
 * ```tsx
 * <div use:hover={(isHovering) => console.log(isHovering)}>...</div>
 * ```
 */
export function hover(el: HTMLElement, accessor: () => (isHovering: boolean) => void) {
  const onMouseEnter = () => accessor()(true);
  const onMouseLeave = () => accessor()(false);

  el.addEventListener('mouseenter', onMouseEnter);
  el.addEventListener('mouseleave', onMouseLeave);

  onCleanup(() => {
    el.removeEventListener('mouseenter', onMouseEnter);
    el.removeEventListener('mouseleave', onMouseLeave);
  });
}

// Add to global JSX namespace for type safety
declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: (e: MouseEvent) => void;
      autofocus: boolean;
      clipboard: string | (() => string);
      hover: (isHovering: boolean) => void;
    }
  }
}
