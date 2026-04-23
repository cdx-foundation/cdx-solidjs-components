import { ChevronDown } from 'lucide-solid';
import { type JSX, Show, createContext, createSignal, splitProps, useContext } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../uid';

const AccordionItemContext = createContext<{
  isOpen: () => boolean;
  setIsOpen: (v: boolean) => void;
  id: string;
}>();

/**
 * Configuration properties for an individual accordion section.
 */
interface AccordionItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, the accordion item will start in its expanded state upon mounting.
   * @default false
   */
  isOpen?: boolean;
}

/**
 * ### AccordionItem Component
 *
 * An individual collapsible section. It manages its own expanded state and provides
 * a smooth transition for its content.
 *
 * @example
 * ```tsx
 * <AccordionItem isOpen={true}>
 *   <AccordionTrigger>Is it accessible?</AccordionTrigger>
 *   <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
 * </AccordionItem>
 * ```
 */
export const AccordionItem = (props: AccordionItemProps) => {
  const [local, others] = splitProps(props, ['children', 'isOpen', 'class']);
  const [isOpen, setIsOpen] = createSignal(local.isOpen || false);
  const id = uid('accordion');

  return (
    <AccordionItemContext.Provider value={{ isOpen, setIsOpen, id }}>
      <div class={twMerge('border-b border-stroke', local.class)} {...others}>
        {local.children}
      </div>
    </AccordionItemContext.Provider>
  );
};

interface AccordionProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Defines whether an open accordion item can be closed by clicking its trigger.
   * In a multiple-open accordion (which this component implements implicitly),
   * this controls whether items can be toggled closed at all.
   * @default true
   */
  collapsible?: boolean;
}

/**
 * ### Accordion Component
 *
 * A vertically stacked set of interactive headings that each reveal a section of content.
 * Ideal for FAQs, settings groups, or collapsing complex information.
 *
 * @example
 * ```tsx
 * <Accordion collapsible>
 *   <AccordionItem>
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Detailed content for section 1.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 *
 * **Design Patterns:**
 * - **Uncontrolled:** Each item manages its own state by default.
 * - **Aesthetics:** Uses a subtle bottom border and rotation chevron.
 *
 * @param props - Root container options for the accordion group.
 */
export const Accordion = (props: AccordionProps) => {
  const [local, others] = splitProps(props, ['collapsible', 'class', 'children']);
  return (
    <div class={twMerge('w-full border-t border-stroke', local.class)} {...others}>
      {local.children}
    </div>
  );
};

/**
 * ### AccordionTrigger Component
 *
 * The trigger button for the accordion item.
 *
 * @example
 * ```tsx
 * <AccordionTrigger>Is it accessible?</AccordionTrigger>
 * ```
 *
 * @param props - Standard HTML button attributes.
 */
export const AccordionTrigger = (props: JSX.HTMLAttributes<HTMLButtonElement>) => {
  const [local, others] = splitProps(props, ['class', 'children', 'onClick']);
  const ctx = useContext(AccordionItemContext);

  if (!ctx) throw new Error('AccordionTrigger must be used within an AccordionItem');

  return (
    <button
      type="button"
      id={`${ctx.id}-trigger`}
      aria-controls={`${ctx.id}-content`}
      aria-expanded={ctx.isOpen()}
      data-state={ctx.isOpen() ? 'open' : 'closed'}
      onClick={(e) => {
        ctx.setIsOpen(!ctx.isOpen());
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
 *
 * @example
 * ```tsx
 * <AccordionContent>
 *   Yes. It adheres to the WAI-ARIA design pattern.
 * </AccordionContent>
 * ```
 *
 * @param props - Standard HTML div attributes.
 */
export const AccordionContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  const ctx = useContext(AccordionItemContext);

  if (!ctx) throw new Error('AccordionContent must be used within an AccordionItem');

  return (
    <Show when={ctx.isOpen()}>
      <div
        id={`${ctx.id}-content`}
        aria-labelledby={`${ctx.id}-trigger`}
        data-state={ctx.isOpen() ? 'open' : 'closed'}
        class={twMerge(
          'overflow-hidden text-sm transition-all animate-in fade-in text-muted',
          local.class,
        )}
        {...others}
      >
        <div class="pb-4 pt-0">{local.children}</div>
      </div>
    </Show>
  );
};
