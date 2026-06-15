import { createShortcut } from '@solid-primitives/keyboard';
import {
  type JSX,
  createContext,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
} from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { type Alignment, Floating } from './Floating';

interface PopoverContextValue {
  isOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  align: Alignment;
  triggerEl: () => HTMLElement | undefined;
  setTriggerEl: (el: HTMLElement) => void;
}

const PopoverContext = createContext<PopoverContextValue>();

interface PopoverProps extends JSX.HTMLAttributes<HTMLDivElement> {
  align?: Alignment;
}

/**
 * ### Popover Component
 *
 * A floating container used to display rich content or additional options.
 */
export const Popover = (props: PopoverProps) => {
  const [local, others] = splitProps(props, ['align', 'children', 'class']);
  const [isOpen, setIsOpen] = createSignal(false);
  const [triggerEl, setTriggerEl] = createSignal<HTMLElement>();
  const align = local.align || 'bottom';

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen, align, triggerEl, setTriggerEl }}>
      <div class={twMerge('inline-block', local.class)} {...others}>
        {local.children}
      </div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick']);
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  return (
    <Floating.Trigger
      onClick={(e) => {
        context.setIsOpen(!context.isOpen());
        if (typeof local.onClick === 'function') {
          local.onClick(e);
        } else if (local.onClick) {
          (local.onClick[0] as any)(local.onClick[1], e);
        }
      }}
      class={twMerge('inline-block cursor-pointer', local.class)}
      {...others}
    >
      {local.children}
    </Floating.Trigger>
  );
};

export const PopoverContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverContent must be used within Popover');

  let containerRef: HTMLDivElement | undefined;

  const onClickOutside = (e: MouseEvent) => {
    const triggerEl = context.triggerEl();
    if (
      context.isOpen() &&
      containerRef &&
      !containerRef.contains(e.target as Node) &&
      triggerEl &&
      !triggerEl.contains(e.target as Node)
    ) {
      context.setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', onClickOutside);
  onCleanup(() => document.removeEventListener('mousedown', onClickOutside));

  createShortcut(['Escape'], () => {
    if (context.isOpen()) context.setIsOpen(false);
  });

  return (
    <Floating.Content
      isOpen={context.isOpen()}
      align={context.align}
      sideOffset={8}
      class={twMerge(
        'border border-stroke bg-panel p-4 shadow-xl rounded-card animate-in fade-in slide-in-from-top-2',
        local.class,
      )}
      {...others}
    >
      <div ref={containerRef}>{local.children}</div>
    </Floating.Content>
  );
};

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
