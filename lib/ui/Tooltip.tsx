import {
  type JSX,
  createContext,
  createSignal,
  splitProps,
  useContext,
} from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { type Alignment, Floating } from './Floating';

interface TooltipContextValue {
  isOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  align: Alignment;
}

const TooltipContext = createContext<TooltipContextValue>();

/**
 * Configuration and properties for the Tooltip component.
 */
interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The direction where the tooltip should appear relative to the trigger.
   * @default "top"
   */
  align?: Alignment;
  /**
   * The element that triggers the tooltip on hover.
   */
  trigger?: JSX.Element;
  /**
   * The content to display inside the tooltip.
   */
  content?: JSX.Element;
}

/**
 * ### Tooltip Component
 *
 * A compact floating label that provides additional context about an element when hovered.
 */
export const Tooltip = (props: TooltipProps) => {
  const [local, others] = splitProps(props, ['align', 'children', 'class', 'trigger', 'content']);
  const [isOpen, setIsOpen] = createSignal(false);
  const align = local.align || 'top';

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen, align }}>
      <Floating isOpen={isOpen()}>
        <div class={twMerge('inline-flex', local.class)} {...others}>
          <Show
            when={local.trigger}
            fallback={local.children}
          >
            <TooltipTrigger>{local.trigger}</TooltipTrigger>
            <TooltipContent>{local.content || local.children}</TooltipContent>
          </Show>
        </div>
      </Floating>
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onMouseEnter', 'onMouseLeave']);
  const context = useContext(TooltipContext);

  if (!context) throw new Error('TooltipTrigger must be used within Tooltip');

  return (
    <Floating.Trigger
      onMouseEnter={(e) => {
        context.setIsOpen(true);
        if (typeof local.onMouseEnter === 'function') {
          local.onMouseEnter(e);
        } else if (local.onMouseEnter) {
          (local.onMouseEnter[0] as any)(local.onMouseEnter[1], e);
        }
      }}
      onMouseLeave={(e) => {
        context.setIsOpen(false);
        if (typeof local.onMouseLeave === 'function') {
          local.onMouseLeave(e);
        } else if (local.onMouseLeave) {
          (local.onMouseLeave[0] as any)(local.onMouseLeave[1], e);
        }
      }}
      class={twMerge('inline-flex', local.class)}
      {...others}
    >
      {local.children}
    </Floating.Trigger>
  );
};

export const TooltipContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  const context = useContext(TooltipContext);

  if (!context) throw new Error('TooltipContent must be used within Tooltip');

  const getArrowClasses = () => {
    switch (context.align) {
      case 'top':
        return 'after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-fg';
      case 'bottom':
        return 'after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-fg';
      case 'left':
        return 'after:left-full after:top-1/2 after:-translate-y-1/2 after:border-l-fg';
      case 'right':
        return 'after:right-full after:top-1/2 after:-translate-y-1/2 after:border-r-fg';
    }
  };

  return (
    <Floating.Content
      isOpen={context.isOpen()}
      align={context.align}
      sideOffset={8}
      class={twMerge(
        'pointer-events-none whitespace-nowrap rounded-card border border-stroke bg-fg px-2.5 py-1.5 text-xs font-medium text-panel shadow-xl after:absolute after:border-4 after:border-transparent',
        getArrowClasses(),
        local.class,
      )}
      {...others}
    >
      {local.children}
    </Floating.Content>
  );
};

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
