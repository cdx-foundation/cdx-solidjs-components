import {
  type JSX,
  Show,
  createContext,
  createSignal,
  splitProps,
  useContext,
} from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { type Alignment, Floating } from './Floating';

interface HoverCardContextValue {
  isOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  align: Alignment;
}

const HoverCardContext = createContext<HoverCardContextValue>();

interface HoverCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  align?: Alignment;
  trigger?: JSX.Element;
}

/**
 * ### HoverCard Component
 *
 * Provides a non-interactive preview of content that appears when hovering over a trigger.
 */
export const HoverCard = (props: HoverCardProps) => {
  const [local, others] = splitProps(props, ['align', 'children', 'class', 'trigger']);
  const [isOpen, setIsOpen] = createSignal(false);
  const align = local.align || 'top';

  return (
    <HoverCardContext.Provider value={{ isOpen, setIsOpen, align }}>
      <Floating isOpen={isOpen()}>
        <div class={twMerge('inline-block', local.class)} {...others}>
          <Show
            when={local.trigger}
            fallback={local.children}
          >
            <HoverCardTrigger>{local.trigger}</HoverCardTrigger>
            <HoverCardContent>{local.children}</HoverCardContent>
          </Show>
        </div>
      </Floating>
    </HoverCardContext.Provider>
  );
};

export const HoverCardTrigger = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onMouseEnter', 'onMouseLeave']);
  const context = useContext(HoverCardContext);
  if (!context) throw new Error('HoverCardTrigger must be used within HoverCard');

  let timeoutId: number | undefined;

  const callHandler = (handler: any, ev: Event) => {
    if (typeof handler === 'function') handler(ev);
    else if (handler) handler[0](handler[1], ev);
  };

  return (
    <Floating.Trigger
      onMouseEnter={(e) => {
        clearTimeout(timeoutId);
        context.setIsOpen(true);
        callHandler(local.onMouseEnter, e);
      }}
      onMouseLeave={(e) => {
        timeoutId = window.setTimeout(() => context.setIsOpen(false), 200);
        callHandler(local.onMouseLeave, e);
      }}
      class={twMerge('inline-block cursor-help', local.class)}
      {...others}
    >
      {local.children}
    </Floating.Trigger>
  );
};

export const HoverCardContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onMouseEnter', 'onMouseLeave']);
  const context = useContext(HoverCardContext);
  if (!context) throw new Error('HoverCardContent must be used within HoverCard');

  let timeoutId: number | undefined;

  const callHandler = (handler: any, ev: Event) => {
    if (typeof handler === 'function') handler(ev);
    else if (handler) handler[0](handler[1], ev);
  };

  return (
    <Floating.Content
      isOpen={context.isOpen()}
      align={context.align}
      sideOffset={8}
      class={twMerge(
        'w-64 border border-stroke bg-panel p-4 shadow-xl rounded-card animate-in fade-in zoom-in-95',
        local.class,
      )}
      onMouseEnter={(e) => {
        clearTimeout(timeoutId);
        callHandler(local.onMouseEnter, e);
      }}
      onMouseLeave={(e) => {
        timeoutId = window.setTimeout(() => context.setIsOpen(false), 200);
        callHandler(local.onMouseLeave, e);
      }}
      {...others}
    >
      {local.children}
    </Floating.Content>
  );
};

HoverCard.Trigger = HoverCardTrigger;
HoverCard.Content = HoverCardContent;
