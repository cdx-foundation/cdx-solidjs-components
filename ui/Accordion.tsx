import { ChevronDown } from 'lucide-solid';
import { type JSX, Show, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../lib/uid';

/**
 * Configuration properties for an individual accordion section.
 */
interface AccordionItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * The clickable heading of the accordion.
   * Supports both plain text strings and complex JSX elements (like icons with text).
   */
  title: string | JSX.Element;

  /**
   * The hidden panel content that expands when the item is toggled.
   */
  children: JSX.Element;

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
 * <AccordionItem title="Is it accessible?" isOpen={true}>
 *   Yes. It adheres to the WAI-ARIA design pattern for accordions.
 * </AccordionItem>
 * ```
 */
export const AccordionItem = (props: AccordionItemProps) => {
  const [local, others] = splitProps(props, ['title', 'children', 'isOpen', 'class']);
  const [isOpen, setIsOpen] = createSignal(local.isOpen || false);
  const id = uid('accordion');

  return (
    <div class={twMerge('border-b border-stroke', local.class)} {...others}>
      <button
        type="button"
        aria-expanded={isOpen()}
        aria-controls={`${id}-content`}
        id={`${id}-trigger`}
        onClick={() => setIsOpen(!isOpen())}
        class="flex w-full items-center justify-between py-4 text-sm font-semibold transition-all hover:underline text-fg outline-none"
      >
        {local.title}
        <ChevronDown
          class={twMerge(
            'h-4 w-4 shrink-0 transition-transform duration-200 text-muted',
            isOpen() && 'rotate-180',
          )}
        />
      </button>
      <Show when={isOpen()}>
        <section
          id={`${id}-content`}
          aria-labelledby={`${id}-trigger`}
          class="overflow-hidden text-sm text-muted animate-in fade-in slide-in-from-top-1 pb-4"
        >
          {local.children}
        </section>
      </Show>
    </div>
  );
};

/**
 * ### Accordion Component
 *
 * A vertically stacked set of interactive headings that each reveal a section of content.
 * Ideal for FAQs, settings groups, or collapsing complex information.
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionItem title="Section 1">
 *     Detailed content for section 1.
 *   </AccordionItem>
 *   <AccordionItem title="Section 2">
 *     Detailed content for section 2.
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
export const Accordion = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div class={twMerge('w-full border-t border-stroke', local.class)} {...others}>
      {local.children}
    </div>
  );
};
