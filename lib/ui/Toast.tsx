import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-solid';
import { For, type JSX, Show, createSignal, splitProps } from 'solid-js';
import { Dynamic, Portal } from 'solid-js/web';
import { TransitionGroup } from 'solid-transition-group';
import { twMerge } from 'tailwind-merge';

/**
 * Data structure representing a single notification item.
 */
export interface ToastData {
  /**
   * Internal unique identifier.
   * Generated automatically when using the `toast()` helper.
   */
  id: string;

  /**
   * The primary message heading.
   */
  title: string;

  /**
   * Secondary information or context.
   * Rendered in a smaller, monospace font.
   */
  description?: string;

  /**
   * The visual theme of the notification.
   * - `default`: Standard informational style.
   * - `info`: Blue theme, for general information.
   * - `success`: Positive confirmation.
   * - `warning`: Amber theme, for cautionary messages.
   * - `error`: Critical alert or failure.
   * @default "default"
   */
  type?: 'default' | 'info' | 'success' | 'warning' | 'error';
}

// Global state for toast management
const [toasts, setToasts] = createSignal<ToastData[]>([]);

/**
 * Arguments that can be passed to the toast functions.
 */
export type ToastArgs = string | Omit<ToastData, 'id'>;

/**
 * Programmatic helper to trigger notifications.
 */
const createToast = (data: ToastArgs) => {
  const payload = typeof data === 'string' ? { title: data } : data;
  const id = Math.random().toString(36).substring(2, 9);

  setToasts((prev) => [...prev, { type: 'default', ...payload, id }]);

  // Auto-dismiss logic
  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 4000);

  return id;
};

/**
 * ### toast Utility
 *
 * A programmatic helper to trigger notifications from anywhere in your application.
 * Notifications automatically dismiss after 4 seconds.
 *
 * @example
 * ```tsx
 * // Simple notification
 * toast("Profile updated");
 *
 * // Detailed notification
 * toast({
 *   title: "Export failed",
 *   description: "Reason: Timeout after 30s",
 *   type: "error"
 * });
 *
 * // Variants
 * toast.success("Changes saved successfully!");
 * toast.warning("Check your connection.");
 * toast.error("An unexpected error occurred.");
 * ```
 */
export const toast = Object.assign(createToast, {
  /**
   * Trigger an info notification.
   */
  info: (data: ToastArgs) => {
    const payload = typeof data === 'string' ? { title: data } : data;
    return createToast({ ...payload, type: 'info' });
  },

  /**
   * Trigger a success notification.
   */
  success: (data: ToastArgs) => {
    const payload = typeof data === 'string' ? { title: data } : data;
    return createToast({ ...payload, type: 'success' });
  },

  /**
   * Trigger a warning notification.
   */
  warning: (data: ToastArgs) => {
    const payload = typeof data === 'string' ? { title: data } : data;
    return createToast({ ...payload, type: 'warning' });
  },

  /**
   * Trigger an error notification.
   */
  error: (data: ToastArgs) => {
    const payload = typeof data === 'string' ? { title: data } : data;
    return createToast({ ...payload, type: 'error' });
  },
});

/**
 * ### Toaster Component
 *
 * The rendering engine for toast notifications.
 * **Important:** This component must be rendered exactly once in your application root (e.g., in `App.tsx`)
 * for notifications triggered by `toast()` to appear.
 *
 * @example
 * ```tsx
 * // root/App.tsx
 * function App() {
 *   return (
 *     <>
 *       <MyRouter />
 *       <Toaster />
 *     </>
 *   );
 * }
 * ```
 *
 * **Features:**
 * - **Stacking:** Newest notifications appear at the bottom.
 * - **Portal Support:** Renders outside the main DOM tree to prevent clipping.
 * - **Smooth Transitions:** Uses `TransitionGroup` for fluid enter/exit animations.
 * - **Auto-Placement:** Fixed to the bottom-right corner of the viewport.
 */
export const Toaster = () => {
  const icons = {
    default: Info,
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    error: CircleX,
  };

  const typeStyles = {
    default: 'text-primary',
    info: 'text-blue-500',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
  };

  return (
    <Portal>
      <div class="fixed bottom-4 right-4 z-100 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <TransitionGroup
          onEnter={(el, done) => {
            if (!el.animate) {
              done();
              return;
            }
            const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 200,
              easing: 'ease-out',
            });
            a.finished.then(done);
          }}
          onExit={(el, done) => {
            if (!el.animate) {
              done();
              return;
            }
            const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 200,
              easing: 'ease-in',
            });
            a.finished.then(done);
          }}
        >
          <For each={toasts()}>
            {(t) => (
              <div class="relative flex w-full gap-3 border border-stroke bg-panel p-4 shadow-lg pointer-events-auto">
                <div class={twMerge('shrink-0 pt-0.5', typeStyles[t.type || 'default'])}>
                  <Dynamic component={icons[t.type || 'default']} size={18} />
                </div>
                <div class="flex flex-col gap-1 pr-6 flex-1">
                  <ToastTitle>{t.title}</ToastTitle>
                  <Show when={t.description}>
                    <ToastDescription>{t.description}</ToastDescription>
                  </Show>
                </div>
                <button
                  type="button"
                  onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                  class="absolute right-2 top-2 text-muted hover:text-fg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </For>
        </TransitionGroup>
      </div>
    </Portal>
  );
};

/**
 * ### ToastTitle Component
 *
 * The primary heading of an individual toast notification.
 * Can be used inside a custom toast renderer or within the `Toaster`.
 *
 * @example
 * ```tsx
 * <ToastTitle>Profile updated successfully.</ToastTitle>
 * ```
 *
 * @param props - Standard HTML heading attributes.
 */
export const ToastTitle = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <h3 class={twMerge('text-sm font-semibold text-fg', local.class)} {...others}>
      {local.children}
    </h3>
  );
};

/**
 * ### ToastDescription Component
 *
 * Secondary descriptive text inside a toast notification, rendered in a smaller monospace style.
 *
 * @example
 * ```tsx
 * <ToastDescription>Reason: Connection timed out after 30s.</ToastDescription>
 * ```
 *
 * @param props - Standard HTML paragraph attributes.
 */
export const ToastDescription = (props: JSX.HTMLAttributes<HTMLParagraphElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <p class={twMerge('text-xs font-mono text-muted', local.class)} {...others}>
      {local.children}
    </p>
  );
};
