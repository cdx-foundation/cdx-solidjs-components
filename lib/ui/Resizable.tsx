import { type JSX, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration for the Root Resizable container.
 */
interface ResizablePanelGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * A combination of `ResizablePanel` and `ResizableHandle` components.
   */
  children: JSX.Element;

  /**
   * The axis along which the panels are arranged.
   * - `horizontal`: Panels are side-by-side (left to right).
   * - `vertical`: Panels are stacked (top to bottom).
   * @default "horizontal"
   */
  direction?: 'horizontal' | 'vertical';
}

/**
 * ### ResizablePanelGroup Component
 *
 * A structural container for building modular, multi-pane layouts (e.g., Sidebars, IDE editors).
 * It organizes content into flex-based sections that can be dynamically resized.
 *
 * @example
 * ```tsx
 * <ResizablePanelGroup direction="horizontal">
 *   <ResizablePanel defaultSize={20}>
 *     Sidebar Content
 *   </ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel defaultSize={80}>
 *     Main Editor Content
 *   </ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 *
 * **Components:**
 * - `ResizablePanelGroup`: The outer layout engine.
 * - `ResizablePanel`: An individual section with flexible sizing.
 * - `ResizableHandle`: The interactive divider used to adjust sibling sizes.
 *
 * @param props - Root configuration including `direction`.
 */
export const ResizablePanelGroup = (props: ResizablePanelGroupProps) => {
  const [local, others] = splitProps(props, ['children', 'direction', 'class']);
  const isVertical = () => local.direction === 'vertical';

  return (
    <div
      class={twMerge('flex h-full w-full', isVertical() ? 'flex-col' : 'flex-row', local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

/**
 * An individual flexible area within a `ResizablePanelGroup`.
 */
export const ResizablePanel = (
  props: JSX.HTMLAttributes<HTMLDivElement> & {
    /** The initial percentage of the group width/height this panel should occupy. */
    defaultSize?: number;
  },
) => {
  const [local, others] = splitProps(props, ['class', 'defaultSize', 'style']);
  const [size, _setSize] = createSignal(local.defaultSize || 50);

  return (
    <div
      class={twMerge('flex flex-col relative', local.class)}
      style={{
        'flex-basis': `${size()}%`,
        'flex-grow': 1,
        'flex-shrink': 1,
        ...(local.style as object),
      }}
      {...others}
    />
  );
};

/**
 * The interactive divider that users drag to resize adjacent panels.
 * Features a large invisible hover area to ensure easy "grabbing".
 */
export const ResizableHandle = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <div
      class={twMerge(
        'relative flex w-px items-center justify-center bg-stroke after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg hover:bg-fg/20 transition-colors cursor-col-resize',
        local.class,
      )}
      {...others}
    />
  );
};
