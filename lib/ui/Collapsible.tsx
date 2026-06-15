import {
  type JSX,
  Show,
  createContext,
  createSignal,
  splitProps,
  useContext,
} from 'solid-js';
import { twMerge } from 'tailwind-merge';

interface CollapsibleContextValue {
  isOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue>();

interface CollapsibleProps extends JSX.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
}

/**
 * ### Collapsible Component
 *
 * An interactive component used to show or hide content.
 */
export const Collapsible = (props: CollapsibleProps) => {
  const [local, others] = splitProps(props, ['defaultOpen', 'children', 'class']);
  const [isOpen, setIsOpen] = createSignal(local.defaultOpen || false);

  return (
    <CollapsibleContext.Provider value={{ isOpen, setIsOpen }}>
      <div class={twMerge('flex flex-col', local.class)} {...others}>
        {local.children}
      </div>
    </CollapsibleContext.Provider>
  );
};

export const CollapsibleTrigger = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class', 'onClick']);
  const context = useContext(CollapsibleContext);

  if (!context) throw new Error('CollapsibleTrigger must be used within Collapsible');

  return (
    <div
      onClick={(e) => {
        context.setIsOpen(!context.isOpen());
        if (typeof local.onClick === 'function') {
          local.onClick(e);
        } else if (local.onClick) {
          (local.onClick[0] as any)(local.onClick[1], e);
        }
      }}
      class={twMerge('cursor-pointer', local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

export const CollapsibleContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['children', 'class']);
  const context = useContext(CollapsibleContext);

  if (!context) throw new Error('CollapsibleContent must be used within Collapsible');

  return (
    <Show when={context.isOpen()}>
      <div class={twMerge('overflow-hidden animate-in fade-in', local.class)} {...others}>
        {local.children}
      </div>
    </Show>
  );
};

Collapsible.Trigger = CollapsibleTrigger;
Collapsible.Content = CollapsibleContent;
