import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and properties for the ScrollArea component.
 */
interface ScrollAreaProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The content tree that may exceed the container's height or width.
   */
  children: JSX.Element;

  /**
   * A CSS string representing the height limit of the container.
   * If the content exceeds this height, a scrollbar will appear.
   * @default "100%"
   */
  maxHeight?: string;
}

/**
 * ### ScrollArea Component
 *
 * A replacement for native browser scrollbars that provides a consistent, minimal visual style
 * across all platforms and browsers. It ensures the application maintains a technical
 * monospace aesthetic by using square, theme-aware scroll handles.
 *
 * @example
 * ```tsx
 * <ScrollArea maxHeight="200px" class="border p-2">
 *   <p>This is a long list of items...</p>
 *   {Array(20).fill(0).map((_, i) => (
 *     <div key={i}>Item {i + 1}</div>
 *   ))}
 * </ScrollArea>
 * ```
 *
 * **Design Specifications:**
 * - **Minimalism:** The scrollbar is intentionally thin (6px) and uses the theme's `stroke` color.
 * - **Square Handles:** Unlike OS-defaults, handles are square (no border radius) to match the squircular design system.
 * - **Consistency:** Overrides default WebKit scrollbar styles to prevent layout shifts and visual discrepancies.
 *
 * @param props - Customization options including `maxHeight` and container classes.
 */
export const ScrollArea = (props: ScrollAreaProps) => {
  const [local, others] = splitProps(props, ['children', 'maxHeight', 'class']);

  return (
    <div
      class={twMerge('relative overflow-auto custom-scrollbar', local.class)}
      style={{ 'max-height': local.maxHeight || '100%' }}
      {...others}
    >
      {local.children}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-stroke, #333);
          border-radius: 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-muted, #555);
        }
      `}</style>
    </div>
  );
};
