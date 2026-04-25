import { X } from 'lucide-solid';
import { createEffect, type JSX, onCleanup, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Sheet component.
 */
interface SheetProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Controls the visibility state of the slide-over panel.
   */
  isOpen: boolean;

  /**
   * Event handler triggered when the user initiates a closure.
   */
  onClose: () => void;

  /**
   * The viewport edge from which the sheet will emerge.
   * @default "right"
   */
  side?: 'left' | 'right';

  /**
   * Custom CSS classes for the backdrop (the dimmed area behind the sheet).
   */
  backdropClass?: string;
}

/**
 * ### Sheet Component (Slide-over)
 *
 * A composable slide-over panel. Use `SheetHeader`, `SheetTitle`, `SheetDescription`,
 * `SheetContent`, and `SheetFooter` to structure the layout.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = createSignal(false);
 *
 * <Button onClick={() => setOpen(true)}>Edit Settings</Button>
 *
 * <Sheet isOpen={open()} onClose={() => setOpen(false)} side="right">
 *   <SheetHeader>
 *     <SheetTitle>Global Settings</SheetTitle>
 *     <SheetDescription>Configure your workspace preferences.</SheetDescription>
 *   </SheetHeader>
 *   <SheetContent>
 *     <SettingsForm />
 *   </SheetContent>
 *   <SheetFooter>
 *     <Button onClick={() => setOpen(false)}>Save</Button>
 *   </SheetFooter>
 * </Sheet>
 * ```
 *
 * @param props - Customization options including `side`, `isOpen`, and `onClose`.
 */
export const Sheet = (props: SheetProps) => {
  const [local, others] = splitProps(props, [
    'isOpen',
    'onClose',
    'children',
    'side',
    'class',
    'backdropClass',
  ]);
  const side = () => local.side || 'right';

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
            side() === 'right' ? 'justify-end' : 'justify-start',
          )}
        >
          <div
            class={twMerge(
              'fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200',
              local.backdropClass,
            )}
            onClick={local.onClose}
          />
          <div
            role="dialog"
            aria-modal="true"
            class={twMerge(
              'clean-panel fixed z-50 h-full w-full sm:max-w-md border-stroke bg-panel shadow-lg transition ease-in-out duration-300 animate-in flex flex-col focus:outline-none',
              side() === 'right'
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
            {local.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};

/**
 * ### SheetHeader Component
 *
 * A semantic header container, typically housing `SheetTitle` and `SheetDescription`.
 *
 * @example
 * ```tsx
 * <SheetHeader>
 *   <SheetTitle>Edit Profile</SheetTitle>
 *   <SheetDescription>Make changes to your public profile here.</SheetDescription>
 * </SheetHeader>
 * ```
 *
 * @param props - Standard HTML div attributes.
 */
export const SheetHeader = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div class={twMerge('flex flex-col gap-1.5 p-6 pb-0 pr-12', local.class)} {...others}>
      {local.children}
    </div>
  );
};

/**
 * ### SheetTitle Component
 *
 * The primary heading for the sheet panel.
 *
 * @example
 * ```tsx
 * <SheetTitle>Notification Settings</SheetTitle>
 * ```
 *
 * @param props - Standard HTML heading attributes.
 */
export const SheetTitle = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <h2 class={twMerge('text-lg font-semibold text-fg', local.class)} {...others}>
      {local.children}
    </h2>
  );
};

/**
 * ### SheetDescription Component
 *
 * Supporting descriptive text displayed below the `SheetTitle`.
 *
 * @example
 * ```tsx
 * <SheetDescription>These notifications cannot be undone.</SheetDescription>
 * ```
 *
 * @param props - Standard HTML paragraph attributes.
 */
export const SheetDescription = (props: JSX.HTMLAttributes<HTMLParagraphElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <p class={twMerge('text-sm font-mono text-muted', local.class)} {...others}>
      {local.children}
    </p>
  );
};

/**
 * ### SheetContent Component
 *
 * The scrollable main body of the sheet, taking up all remaining vertical space.
 *
 * @example
 * ```tsx
 * <SheetContent>
 *   <FormField label="Username" />
 *   <FormField label="Bio" />
 * </SheetContent>
 * ```
 *
 * @param props - Standard HTML div attributes.
 */
export const SheetContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div class={twMerge('flex-1 overflow-y-auto p-6', local.class)} {...others}>
      {local.children}
    </div>
  );
};

/**
 * ### SheetFooter Component
 *
 * A sticky footer for action buttons, pinned to the bottom of the sheet.
 *
 * @example
 * ```tsx
 * <SheetFooter>
 *   <Button variant="secondary">Cancel</Button>
 *   <Button>Save changes</Button>
 * </SheetFooter>
 * ```
 *
 * @param props - Standard HTML div attributes.
 */
export const SheetFooter = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      class={twMerge('flex items-center justify-end gap-2 p-6 border-t border-stroke', local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};
