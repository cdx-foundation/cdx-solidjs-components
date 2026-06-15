import {
  type JSX,
  Show,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  useContext,
} from 'solid-js';
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

interface FloatingContextValue {
  triggerEl: () => HTMLElement | undefined;
  setTriggerEl: (el: HTMLElement) => void;
  isOpen: () => boolean;
}

const FloatingContext = createContext<FloatingContextValue>();

/**
 * ### Internal Floating Utility
 *
 * Handles Portal rendering and dynamic viewport-aware positioning.
 */
export const Floating = (props: { children: JSX.Element; isOpen?: boolean }) => {
  const [triggerEl, setTriggerEl] = createSignal<HTMLElement>();
  const isOpen = () => props.isOpen ?? false;

  return (
    <FloatingContext.Provider value={{ triggerEl, setTriggerEl, isOpen }}>
      {props.children}
    </FloatingContext.Provider>
  );
};

export const FloatingTrigger = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children']);
  const context = useContext(FloatingContext);
  if (!context) throw new Error('FloatingTrigger must be used within Floating');

  return (
    <div ref={context.setTriggerEl} {...others}>
      {local.children}
    </div>
  );
};

interface FloatingContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  align?: Alignment;
  sideOffset?: number;
  matchTriggerWidth?: boolean;
}

export const FloatingContent = (props: FloatingContentProps) => {
  const [local, others] = splitProps(props, [
    'children',
    'isOpen',
    'align',
    'sideOffset',
    'class',
    'matchTriggerWidth',
  ]);
  const context = useContext(FloatingContext);
  if (!context) throw new Error('FloatingContent must be used within Floating');

  const [coords, setCoords] = createSignal<{ top: number; left: number } | null>(null);
  const [width, setWidth] = createSignal<string>('auto');

  const update = () => {
    const triggerEl = context.triggerEl();
    if (!local.isOpen || !triggerEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const offset = local.sideOffset ?? 8;
    const align = local.align ?? 'bottom';

    if (local.matchTriggerWidth) {
      setWidth(`${triggerRect.width}px`);
    }

    let top = 0;
    let left = 0;

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
    if (local.isOpen) {
      update();
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
    const align = local.align ?? 'bottom';
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
    <Show when={local.isOpen && coords()}>
      <Portal>
        <div
          style={{
            position: 'fixed',
            top: `${coords()?.top}px`,
            left: `${coords()?.left}px`,
            width: width(),
            transform: getTransform(),
            'z-index': 100,
            'pointer-events': 'auto',
          }}
          class={twMerge(local.class)}
          {...others}
        >
          {local.children}
        </div>
      </Portal>
    </Show>
  );
};

Floating.Trigger = FloatingTrigger;
Floating.Content = FloatingContent;
