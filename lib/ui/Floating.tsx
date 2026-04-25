import { createEffect, createSignal, type JSX, onCleanup, onMount, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

export type Alignment =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom';

interface FloatingProps {
  trigger: (ref: (el: HTMLElement) => void) => JSX.Element;
  children: JSX.Element;
  isOpen: boolean;
  align?: Alignment;
  sideOffset?: number;
  class?: string;
  id?: string;
  matchTriggerWidth?: boolean;
}

/**
 * ### Internal Floating Utility
 *
 * Handles Portal rendering and dynamic viewport-aware positioning.
 * Optimized for zero-latency, zero-animation rendering using fixed positioning.
 */
export const Floating = (props: FloatingProps) => {
  const [coords, setCoords] = createSignal<{ top: number; left: number } | null>(null);
  const [width, setWidth] = createSignal<string>('auto');

  let triggerEl: HTMLElement | undefined;
  let _contentEl: HTMLElement | undefined;

  const update = () => {
    if (!props.isOpen || !triggerEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const offset = props.sideOffset ?? 8;
    const align = props.align ?? 'bottom';

    if (props.matchTriggerWidth) {
      setWidth(`${triggerRect.width}px`);
    }

    let top = 0;
    let left = 0;

    // Viewport-relative base points (fixed)
    switch (align) {
      case 'top':
        top = triggerRect.top - offset;
        left = triggerRect.left + triggerRect.width / 2;
        break;
      case 'top-left':
        top = triggerRect.top - offset;
        left = triggerRect.left;
        break;
      case 'top-right':
        top = triggerRect.top - offset;
        left = triggerRect.right;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2;
        break;
      case 'bottom-left':
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        break;
      case 'bottom-right':
        top = triggerRect.bottom + offset;
        left = triggerRect.right;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.left - offset;
        break;
      case 'left-top':
        top = triggerRect.top;
        left = triggerRect.left - offset;
        break;
      case 'left-bottom':
        top = triggerRect.bottom;
        left = triggerRect.left - offset;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.right + offset;
        break;
      case 'right-top':
        top = triggerRect.top;
        left = triggerRect.right + offset;
        break;
      case 'right-bottom':
        top = triggerRect.bottom;
        left = triggerRect.right + offset;
        break;
    }

    setCoords({ top, left });
  };

  createEffect(() => {
    if (props.isOpen) {
      update();
      // Ensure positioning is fresh
      requestAnimationFrame(update);
    } else {
      setCoords(null);
    }
  });

  onMount(() => {
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
  });

  onCleanup(() => {
    window.removeEventListener('scroll', update, true);
    window.removeEventListener('resize', update);
  });

  const getTransform = () => {
    const align = props.align ?? 'bottom';
    switch (align) {
      case 'top':
        return 'translate(-50%, -100%)';
      case 'top-left':
        return 'translate(0, -100%)';
      case 'top-right':
        return 'translate(-100%, -100%)';
      case 'bottom':
        return 'translate(-50%, 0)';
      case 'bottom-left':
        return 'translate(0, 0)';
      case 'bottom-right':
        return 'translate(-100%, 0)';
      case 'left':
        return 'translate(-100%, -50%)';
      case 'left-top':
        return 'translate(-100%, 0)';
      case 'left-bottom':
        return 'translate(-100%, -100%)';
      case 'right':
        return 'translate(0, -50%)';
      case 'right-top':
        return 'translate(0, 0)';
      case 'right-bottom':
        return 'translate(0, -100%)';
      default:
        return 'translate(-50%, 0)';
    }
  };

  return (
    <>
      {props.trigger((el) => {
        triggerEl = el;
        if (props.isOpen) update();
      })}
      <Show when={props.isOpen && coords()}>
        <Portal>
          <div
            ref={(el) => {
              _contentEl = el;
              update();
            }}
            id={props.id}
            style={{
              position: 'fixed',
              top: `${coords()?.top}px`,
              left: `${coords()?.left}px`,
              width: width(),
              transform: getTransform(),
              'z-index': 100,
              'pointer-events': 'auto',
            }}
            class={twMerge(props.class)}
          >
            {props.children}
          </div>
        </Portal>
      </Show>
    </>
  );
};
