import { ChevronDown } from 'lucide-solid';
import {
  createContext,
  createSignal,
  type JSX,
  Show,
  splitProps,
  useContext,
  mergeProps,
} from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../uid';

interface AccordionContextValue {
  isExpanded: (id: string) => boolean;
  toggleItem: (id: string) => void;
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextValue>();

interface AccordionItemContextValue {
  id: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue>();

interface AccordionProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, multiple items can be expanded at once.
   * @default false
   */
  multiple?: boolean;
  /**
   * If true, an expanded item can be collapsed by clicking its trigger.
   * @default true
   */
  collapsible?: boolean;
  /**
   * The value of the expanded item(s).
   */
  value?: string | string[];
  /**
   * Callback fired when the expanded item(s) change.
   */
  onValueChange?: (value: string | string[]) => void;
}

/**
 * ### Accordion Component
 *
 * A vertically stacked set of interactive headings that each reveal a section of content.
 */
export const Accordion = (props: AccordionProps) => {
  const merged = mergeProps({ multiple: false, collapsible: true }, props);
  const [local, others] = splitProps(merged, [
    'multiple',
    'collapsible',
    'value',
    'onValueChange',
    'class',
    'children',
  ]);

  const [internalValue, setInternalValue] = createSignal<string | string[]>(
    local.value ?? (local.multiple ? [] : ''),
  );

  const value = () => local.value ?? internalValue();

  const isExpanded = (id: string) => {
    const current = value();
    return Array.isArray(current) ? current.includes(id) : current === id;
  };

  const toggleItem = (id: string) => {
    const current = value();
    let next: string | string[];

    if (local.multiple) {
      const arr = Array.isArray(current) ? current : [current].filter(Boolean) as string[];
      next = arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id];
    } else {
      next = current === id ? (local.collapsible ? '' : id) : id;
    }

    setInternalValue(next);
    local.onValueChange?.(next);
  };

  return (
    <AccordionContext.Provider value={{ isExpanded, toggleItem, collapsible: local.collapsible }}>
      <div class={twMerge('w-full border-t border-stroke', local.class)} {...others}>
        {local.children}
      </div>
    </AccordionContext.Provider>
  );
};

/**
 * Configuration properties for an individual accordion section.
 */
interface AccordionItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Unique value for the item. If not provided, a random ID is generated.
   */
  value?: string;
}

/**
 * ### AccordionItem Component
 *
 * An individual collapsible section.
 */
export const AccordionItem = (props: AccordionItemProps) => {
  const [local, others] = splitProps(props, ['children', 'value', 'class']);
  const id = local.value || uid('accordion');

  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div class={twMerge('border-b border-stroke', local.class)} {...others}>
        {local.children}
      </div>
    </AccordionItemContext.Provider>
  );
};

/**
 * ### AccordionTrigger Component
 *
 * The trigger button for the accordion item.
 */
export const AccordionTrigger = (props: JSX.HTMLAttributes<HTMLButtonElement>) => {
  const [local, others] = splitProps(props, ['class', 'children', 'onClick']);
  const root = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);

  if (!root || !item)
    throw new Error('AccordionTrigger must be used within Accordion and AccordionItem');

  const isOpen = () => root.isExpanded(item.id);

  return (
    <button
      type="button"
      id={`${item.id}-trigger`}
      aria-controls={`${item.id}-content`}
      aria-expanded={isOpen()}
      data-state={isOpen() ? 'open' : 'closed'}
      onClick={(e) => {
        root.toggleItem(item.id);
        if (typeof local.onClick === 'function') {
          local.onClick(e);
        } else if (local.onClick) {
          (local.onClick[0] as any)(local.onClick[1], e);
        }
      }}
      class={twMerge(
        'flex w-full flex-1 items-center justify-between py-4 text-sm font-semibold text-fg outline-none transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        local.class,
      )}
      {...others}
    >
      {local.children}
      <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200 text-muted" />
    </button>
  );
};

/**
 * ### AccordionContent Component
 *
 * The content section for the accordion item.
 */
export const AccordionContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  const root = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);

  if (!root || !item)
    throw new Error('AccordionContent must be used within Accordion and AccordionItem');

  const isOpen = () => root.isExpanded(item.id);

  return (
    <Show when={isOpen()}>
      <div
        id={`${item.id}-content`}
        role="region"
        aria-labelledby={`${item.id}-trigger`}
        data-state={isOpen() ? 'open' : 'closed'}
        class={twMerge(
          'overflow-hidden text-sm transition-all animate-in fade-in slide-in-from-top-2 text-muted',
          local.class,
        )}
        {...others}
      >
        <div class="pb-4 pt-0">{local.children}</div>
      </div>
    </Show>
  );
};
