import { createShortcut } from '@solid-primitives/keyboard';
import {
  type JSX,
  Show,
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
}

const PopoverContext = createContext<PopoverContextValue>();

interface PopoverProps extends JSX.HTMLAttributes<HTMLDivElement> {
  align?: Alignment;
  trigger?: JSX.Element;
}

/**
 * ### Popover Component
 *
 * A floating container used to display rich content or additional options.
 */
export const Popover = (props: PopoverProps) => {
  const [local, others] = splitProps(props, ['align', 'children', 'class', 'trigger']);
  const [isOpen, setIsOpen] = createSignal(false);
  const align = local.align || 'bottom';

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen, align }}>
      <Floating isOpen={isOpen()}>
        <div class={twMerge('inline-block', local.class)} {...others}>
          <Show
            when={local.trigger}
            fallback={local.children}
          >
            <PopoverTrigger>{local.trigger}</PopoverTrigger>
            <PopoverContent>{local.children}</PopoverContent>
          </Show>
        </div>
      </Floating>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick', 'onKeyDown']);
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  const toggle = () => context.setIsOpen(!context.isOpen());

  return (
    <Floating.Trigger
      onClick={(e) => {
        toggle();
        const fn = local.onClick;
        if (typeof fn === 'function') fn(e);
        else if (fn) fn[0](fn[1], e);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // If the event target is a button, it will likely trigger a click.
          // We avoid double-toggling by checking the target.
          if ((e.target as HTMLElement).tagName === 'BUTTON' && e.currentTarget !== e.target) {
            return;
          }
          e.preventDefault();
          toggle();
        }
        const fn = local.onKeyDown;
        if (typeof fn === 'function') fn(e);
        else if (fn) fn[0](fn[1], e);
      }}
      class={twMerge('inline-block cursor-pointer', local.class)}
      {...{
        role: 'button',
        tabIndex: 0
      }}
      {...others}
    >
      {local.children}
    </Floating.Trigger>
  );
};

export const PopoverContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  const context = useContext(PopoverContext);
  const floating = Floating.useContext();

  if (!context) throw new Error('PopoverContent must be used within Popover');

  let containerRef: HTMLDivElement | undefined;

  const onClickOutside = (e: MouseEvent) => {
    const triggerEl = floating.triggerEl();
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
