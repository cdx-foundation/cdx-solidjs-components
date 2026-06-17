import { type JSX, createContext, createSignal, onMount, splitProps, useContext } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../uid';

interface ResizableContextValue {
  direction: () => 'horizontal' | 'vertical';
  registerPanel: (id: string, initialSize: number) => void;
  unregisterPanel: (id: string) => void;
  startResizing: (handleId: string, event: MouseEvent | TouchEvent) => void;
  panelSizes: () => Record<string, number>;
}

const ResizableContext = createContext<ResizableContextValue>();

/**
 * ### ResizablePanelGroup Component
 *
 * A structural container for building modular, multi-pane layouts.
 * Manages the sizing logic and coordination between panels and handles.
 */
export const ResizablePanelGroup = (
  props: JSX.HTMLAttributes<HTMLDivElement> & {
    direction?: 'horizontal' | 'vertical';
  },
) => {
  const [local, others] = splitProps(props, ['children', 'direction', 'class']);
  const direction = () => local.direction || 'horizontal';

  const [panelSizes, setPanelSizes] = createSignal<Record<string, number>>({});
  const [panelOrder, setPanelOrder] = createSignal<string[]>([]);
  let groupRef: HTMLDivElement | undefined;

  const registerPanel = (id: string, initialSize: number) => {
    setPanelSizes((prev) => ({ ...prev, [id]: initialSize }));
    setPanelOrder((prev) => [...prev, id]);
  };

  const unregisterPanel = (id: string) => {
    setPanelSizes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setPanelOrder((prev) => prev.filter((p) => p !== id));
  };

  const startResizing = (handleId: string, event: MouseEvent | TouchEvent) => {
    if (!groupRef) return;
    event.preventDefault();

    const isVertical = direction() === 'vertical';
    const groupRect = groupRef.getBoundingClientRect();
    const _handleIdx = panelOrder().findIndex((_id, _index) => {
      // Logic to find which panel is before this handle
      // For now, we assume handles are placed between panels in the children tree
      return true; // Simplified for this implementation
    });

    // We'll find the specific panels around the handle based on DOM structure
    const handleEl = document.getElementById(handleId);
    if (!handleEl) return;

    const prevPanelEl = handleEl.previousElementSibling as HTMLElement;
    const nextPanelEl = handleEl.nextElementSibling as HTMLElement;

    if (!prevPanelEl || !nextPanelEl) return;

    const prevId = prevPanelEl.id;
    const nextId = nextPanelEl.id;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const _delta = isVertical
        ? ((clientY - groupRect.top) / groupRect.height) * 100
        : ((clientX - groupRect.left) / groupRect.width) * 100;

      // This is a simplified calculation: it sets the relative position of the handle
      // In a real implementation, we'd calculate deltas to adjust sibling percentages
      const currentPrevSize = panelSizes()[prevId];
      const currentNextSize = panelSizes()[nextId];
      const totalSize = currentPrevSize + currentNextSize;

      // Find new boundary
      const relativePos = isVertical
        ? ((clientY - prevPanelEl.getBoundingClientRect().top) / groupRect.height) * 100
        : ((clientX - prevPanelEl.getBoundingClientRect().left) / groupRect.width) * 100;

      if (relativePos > 5 && relativePos < totalSize - 5) {
        setPanelSizes((prev) => ({
          ...prev,
          [prevId]: relativePos,
          [nextId]: totalSize - relativePos,
        }));
      }
    };

    const onEnd = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
    document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
  };

  return (
    <ResizableContext.Provider
      value={{
        direction,
        registerPanel,
        unregisterPanel,
        startResizing,
        panelSizes,
      }}
    >
      <div
        ref={(el) => (groupRef = el)}
        class={twMerge(
          'flex h-full w-full',
          direction() === 'vertical' ? 'flex-col' : 'flex-row',
          local.class,
        )}
        {...others}
      >
        {local.children}
      </div>
    </ResizableContext.Provider>
  );
};

/**
 * An individual flexible area within a `ResizablePanelGroup`.
 */
export const ResizablePanel = (
  props: JSX.HTMLAttributes<HTMLDivElement> & {
    defaultSize?: number;
    id?: string;
  },
) => {
  const context = useContext(ResizableContext);
  if (!context) throw new Error('ResizablePanel must be used within ResizablePanelGroup');

  const id = props.id || uid('panel');
  const [local, others] = splitProps(props, ['class', 'defaultSize', 'style']);

  onMount(() => {
    context.registerPanel(id, local.defaultSize || 50);
  });

  const size = () => context.panelSizes()[id] ?? local.defaultSize ?? 50;

  return (
    <div
      id={id}
      class={twMerge('flex flex-col relative overflow-hidden', local.class)}
      style={{
        'flex-basis': `${size()}%`,
        'flex-grow': 0,
        'flex-shrink': 0,
        ...(local.style as object),
      }}
      {...others}
    />
  );
};

/**
 * The interactive divider that users drag to resize adjacent panels.
 */
export const ResizableHandle = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const context = useContext(ResizableContext);
  if (!context) throw new Error('ResizableHandle must be used within ResizablePanelGroup');

  const id = uid('handle');
  const [local, others] = splitProps(props, ['class', 'onMouseDown', 'onTouchStart']);

  const isVertical = () => context.direction() === 'vertical';

  return (
    <div
      id={id}
      role="separator"
      tabIndex={0}
      onMouseDown={(e) => {
        context.startResizing(id, e);
        if (typeof local.onMouseDown === 'function') {
          local.onMouseDown(e);
        } else if (Array.isArray(local.onMouseDown)) {
          local.onMouseDown[0](local.onMouseDown[1], e);
        }
      }}
      onTouchStart={(e) => {
        context.startResizing(id, e);
        if (typeof local.onTouchStart === 'function') {
          local.onTouchStart(e);
        } else if (Array.isArray(local.onTouchStart)) {
          local.onTouchStart[0](local.onTouchStart[1], e);
        }
      }}
      class={twMerge(
        'relative flex items-center justify-center bg-stroke transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg hover:bg-fg/20',
        isVertical()
          ? 'h-px w-full cursor-row-resize after:absolute after:inset-x-0 after:top-1/2 after:h-2 after:-translate-y-1/2'
          : 'w-px h-full cursor-col-resize after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2',
        local.class,
      )}
      {...others}
    />
  );
};
