import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-solid';
import {
  createEffect,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
  Show,
  splitProps,
} from 'solid-js';
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
   * The display duration in milliseconds.
   * If not provided, the `Toaster`'s global duration is used.
   */
  duration?: number;

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

// Global configuration for toast behavior, updated via Toaster component
const [toastConfig, setToastConfig] = createSignal({
  duration: 4000,
  maxToasts: 5,
});

// Toaster instance management to prevent duplicates
const [activeToasters, setActiveToasters] = createSignal<string[]>([]);

/**
 * Arguments that can be passed to the toast functions.
 */
export type ToastArgs = string | Omit<ToastData, 'id'>;

/**
 * Programmatic helper to trigger notifications.
 */
const createToast = (data: ToastArgs) => {
  const payload: Omit<ToastData, 'id'> = typeof data === 'string' ? { title: data } : data;
  const id = Math.random().toString(36).substring(2, 9);
  const config = toastConfig();
  const duration = payload.duration ?? config.duration;

  setToasts((prev) => {
    const item: ToastData = { type: 'default', ...payload, id };
    const next = [...prev, item];
    if (next.length > config.maxToasts) {
      return next.slice(next.length - config.maxToasts);
    }
    return next;
  });

  // Auto-dismiss logic
  if (duration > 0) {
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }

  return id;
};

/**
 * ### toast Utility
 *
 * A programmatic helper to trigger notifications from anywhere in your application.
 * Notifications automatically dismiss after a duration (default 4 seconds).
 *
 * @example
 * ```tsx
 * // Simple notification
 * toast("Profile updated");
 *
 * // Detailed notification with custom duration
 * toast({
 *   title: "Export failed",
 *   description: "Reason: Timeout after 30s",
 *   type: "error",
 *   duration: 10000
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
 * Possible positions for the Toaster to appear on the screen.
 */
export type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Configuration options for the Toaster component.
 */
export interface ToasterProps {
  /**
   * The corner of the screen where notifications will appear.
   * @default "bottom-right"
   */
  position?: ToasterPosition;

  /**
   * Global default duration for all toasts in milliseconds.
   * @default 4000
   */
  duration?: number;

  /**
   * Maximum number of toasts visible at once.
   * @default 5
   */
  maxToasts?: number;
}

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
 *       <Toaster position="top-right" duration={5000} maxToasts={3} />
 *     </>
 *   );
 * }
 * ```
 *
 * **Features:**
 * - **Stacking:** Newest notifications appear at the bottom (for bottom positions) or top (for top positions).
 * - **Portal Support:** Renders outside the main DOM tree to prevent clipping.
 * - **Smooth Transitions:** Uses `TransitionGroup` for fluid enter/exit animations.
 * - **Custom Placement:** Support for six screen positions.
 * - **Capacity Control:** Limit the number of concurrent notifications via `maxToasts`.
 */
export const Toaster = (props: ToasterProps) => {
  const id = Math.random().toString(36).substring(2, 9);
  const [local] = splitProps(props, ['position', 'duration', 'maxToasts']);
  const position = () => local.position || 'bottom-right';

  onMount(() => {
    setActiveToasters((prev) => [...prev, id]);
  });

  onCleanup(() => {
    setActiveToasters((prev) => prev.filter((t) => t !== id));
  });

  const isMaster = () => {
    const stack = activeToasters();
    return stack[stack.length - 1] === id;
  };

  createEffect(() => {
    if (isMaster()) {
      setToastConfig({
        duration: local.duration ?? 4000,
        maxToasts: local.maxToasts ?? 5,
      });
    }
  });

  const positionClasses = {
    'top-left': 'top-4 left-4 flex-col-reverse',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 flex-col-reverse',
    'top-right': 'top-4 right-4 flex-col-reverse',
    'bottom-left': 'bottom-4 left-4 flex-col',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 flex-col',
    'bottom-right': 'bottom-4 right-4 flex-col',
  };

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
    <Show when={isMaster()}>
      <Portal>
        <div
          class={twMerge(
            'fixed z-100 flex gap-2 w-full max-w-sm pointer-events-none',
            positionClasses[position()],
          )}
        >
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
    </Show>
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
