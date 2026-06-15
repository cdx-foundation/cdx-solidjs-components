import {
  type JSX,
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

  const handleMouseEnter = (e: any) => {
    clearTimeout(timeoutId);
    context.setIsOpen(true);
    if (typeof local.onMouseEnter === 'function') {
      local.onMouseEnter(e);
    } else if (local.onMouseEnter) {
      (local.onMouseEnter[0] as any)(local.onMouseEnter[1], e);
    }
  };

  const handleMouseLeave = (e: any) => {
    timeoutId = window.setTimeout(() => context.setIsOpen(false), 200);
    if (typeof local.onMouseLeave === 'function') {
      local.onMouseLeave(e);
    } else if (local.onMouseLeave) {
      (local.onMouseLeave[0] as any)(local.onMouseLeave[1], e);
    }
  };

  return (
    <Floating.Trigger
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        if (typeof local.onMouseEnter === 'function') {
          local.onMouseEnter(e);
        } else if (local.onMouseEnter) {
          (local.onMouseEnter[0] as any)(local.onMouseEnter[1], e);
        }
      }}
      onMouseLeave={(e) => {
        timeoutId = window.setTimeout(() => context.setIsOpen(false), 200);
        if (typeof local.onMouseLeave === 'function') {
          local.onMouseLeave(e);
        } else if (local.onMouseLeave) {
          (local.onMouseLeave[0] as any)(local.onMouseLeave[1], e);
        }
      }}
      {...others}
    >
      {local.children}
    </Floating.Content>
  );
};

HoverCard.Trigger = HoverCardTrigger;
HoverCard.Content = HoverCardContent;
