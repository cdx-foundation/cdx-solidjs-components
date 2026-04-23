import { type JSX, Show, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Collapsible component.
 */
interface CollapsibleProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The interactive element (e.g., a Button or Text) that toggles the open state when clicked.
   */
  trigger: JSX.Element;

  /**
   * The content to be conditionally rendered when the component is in its expanded state.
   */
  children: JSX.Element;

  /**
   * Determines if the content is visible upon initial mount.
   * @default false
   */
  defaultOpen?: boolean;
}

/**
 * ### Collapsible Component
 *
 * An interactive component used to show or hide content.
 * Ideal for "Show More" summaries, advanced configuration sections, or simple expandable panels.
 *
 * @example
 * ```tsx
 * <Collapsible
 *   trigger={<Button variant="outline">View Technical Details</Button>}
 *   defaultOpen={false}
 * >
 *   <div class="p-4 mt-2 border rounded-lg bg-surface">
 *     <p>Node Version: v20.10.0</p>
 *     <p>Memory Usage: 45MB</p>
 *   </div>
 * </Collapsible>
 * ```
 *
 * **Design Principles:**
 * - **Decoupled Trigger:** The trigger can be any valid JSX, allowing for high customization of the interactive area.
 * - **Animation:** Includes a subtle vertical slide and fade animation when appearing.
 * - **Uncontrolled State:** Manages its own expansion state internally for simplicity in basic use cases.
 *
 * @param props - Customization options including `trigger` and `defaultOpen`.
 */
export const Collapsible = (props: CollapsibleProps) => {
  const [local, others] = splitProps(props, ['trigger', 'children', 'defaultOpen', 'class']);
  const [isOpen, setIsOpen] = createSignal(local.defaultOpen || false);

  return (
    <div class={twMerge('flex flex-col', local.class)} {...others}>
      <div onClick={() => setIsOpen(!isOpen())} class="cursor-pointer">
        {local.trigger}
      </div>
      <Show when={isOpen()}>
        <div class="overflow-hidden animate-in fade-in slide-in-from-top-1">{local.children}</div>
      </Show>
    </div>
  );
};
