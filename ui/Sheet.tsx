import { X } from 'lucide-solid';
import { type JSX, Show, createEffect, onCleanup, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Sheet component.
 */
interface SheetProps {
  /**
   * Controls the visibility state of the slide-over panel.
   */
  isOpen: boolean;

  /**
   * Event handler triggered when the user initiates a closure (e.g., clicking the backdrop).
   */
  onClose: () => void;

  /**
   * A prominent heading displayed at the top of the sheet.
   */
  title?: string;

  /**
   * Supporting text displayed directly under the title in a monospace font.
   */
  description?: string;

  /**
   * The content to render within the scrollable panel body.
   */
  children: JSX.Element;

  /**
   * The viewport edge from which the sheet will emerge.
   * @default "right"
   */
  side?: 'left' | 'right';

  /**
   * Custom CSS classes for the panel container.
   */
  class?: string;
}

/**
 * ### Sheet Component (Slide-over)
 *
 * An extended dialog that slides in from the edge of the screen.
 * Often used for complex forms, navigation menus, or filtering sidebars where the context of the
 * main page needs to remain partially visible.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = createSignal(false);
 *
 * <Button onClick={() => setOpen(true)}>Edit Settings</Button>
 *
 * <Sheet
 *   isOpen={open()}
 *   onClose={() => setOpen(false)}
 *   side="right"
 *   title="Global Settings"
 *   description="Configure your workspace preferences."
 * >
 *   <SettingsForm onSave={() => setOpen(false)} />
 * </Sheet>
 * ```
 *
 * **Behaviors:**
 * - **Scroll Locking:** Automatically disables scrolling on `document.body` while the sheet is active.
 * - **Dismissal:** Features a clear 'X' button and closes when the dimmed backdrop is clicked.
 * - **Portal Rendering:** Injected at the root of the DOM to avoid clipping by parent containers.
 * - **Animations:** Uses Tailwind `slide-in-from-*` transitions tailored to the chosen `side`.
 *
 * @param props - Customization options including `side`, `title`, and `isOpen`.
 */
export const Sheet = (props: SheetProps) => {
  const [local, others] = splitProps(props, [
    'isOpen',
    'onClose',
    'title',
    'description',
    'children',
    'side',
    'class',
  ]);
  const side = local.side || 'right';

  // Robust Body Scroll Lock
  createEffect(() => {
    if (local.isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      onCleanup(() => {
        document.body.style.overflow = originalStyle;
      });
    }
  });

  return (
    <Show when={local.isOpen}>
      <Portal>
        <div
          class={twMerge(
            'fixed inset-0 z-50 flex',
            side === 'right' ? 'justify-end' : 'justify-start',
          )}
        >
          {/* Backdrop */}
          <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={local.onClose}
          />
          {/* Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={local.title ? 'sheet-title' : undefined}
            aria-describedby={local.description ? 'sheet-desc' : undefined}
            class={twMerge(
              'fixed z-50 h-full w-full sm:max-w-md border-stroke bg-panel p-6 shadow-lg transition ease-in-out duration-300 animate-in focus:outline-none',
              side === 'right'
                ? 'right-0 border-l slide-in-from-right-full'
                : 'left-0 border-r slide-in-from-left-full',
              local.class,
            )}
            {...others}
          >
            <button
              type="button"
              onClick={local.onClose}
              class="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 outline-none"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div class="flex flex-col gap-1.5 mb-6">
              <Show when={local.title}>
                <h2 id="sheet-title" class="text-lg font-semibold text-fg">
                  {local.title}
                </h2>
              </Show>
              <Show when={local.description}>
                <p id="sheet-desc" class="text-sm font-mono text-muted">
                  {local.description}
                </p>
              </Show>
            </div>
            <div class="h-full overflow-y-auto pb-10">{local.children}</div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
