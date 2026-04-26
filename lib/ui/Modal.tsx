import { createShortcut } from '@solid-primitives/keyboard';
import { X } from 'lucide-solid';
import { type JSX, Show, createEffect, onCleanup, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Modal component.
 */
interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Controls the visibility state of the modal.
   */
  isOpen: boolean;

  /**
   * Event handler triggered when a "close" action is initiated.
   * This includes clicking the 'X' button, the backdrop, or pressing `Escape`.
   */
  onClose: () => void;

  /**
   * Custom CSS classes for the backdrop (the dimmed area behind the modal).
   */
  backdropClass?: string;
}

/**
 * ### Modal Component
 *
 * A composable dialog window that interrupts the user's workflow to focus on specific content.
 * Rendered into a `Portal` at the end of `document.body` to avoid z-index and overflow issues.
 *
 * Use `ModalHeader`, `ModalTitle`, `ModalDescription`, and `ModalFooter` to build structured layouts.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = createSignal(false);
 *
 * <Button onClick={() => setOpen(true)}>Open</Button>
 *
 * <Modal isOpen={open()} onClose={() => setOpen(false)}>
 *   <ModalHeader>
 *     <ModalTitle>User Profile</ModalTitle>
 *     <ModalDescription>Update your bio and avatar below.</ModalDescription>
 *   </ModalHeader>
 *   <p>Content goes here.</p>
 *   <ModalFooter>
 *     <Button onClick={() => setOpen(false)}>Save Changes</Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 *
 * @param props - Customization options including `isOpen`, `onClose`, and `backdropClass`.
 */
export const Modal = (props: ModalProps) => {
  const [local, others] = splitProps(props, [
    'isOpen',
    'onClose',
    'class',
    'children',
    'backdropClass',
  ]);

  createShortcut(['Escape'], () => {
    if (local.isOpen) local.onClose();
  });

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
    <Portal>
      <Show when={local.isOpen}>
        <div class="fixed inset-0 z-100 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal"
            class={twMerge(
              'absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 border-none cursor-default',
              local.backdropClass,
            )}
            onClick={local.onClose}
          />
          <div
            role="dialog"
            aria-modal="true"
            class={twMerge(
              'clean-panel relative z-10 w-full max-w-md p-6 animate-in fade-in duration-200 focus:outline-none',
              local.class,
            )}
            {...others}
          >
            <button
              type="button"
              onClick={local.onClose}
              class="absolute right-4 top-4 text-muted hover:text-fg transition-colors p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            {local.children}
          </div>
        </div>
      </Show>
    </Portal>
  );
};

/**
 * ### ModalHeader Component
 *
 * A semantic header container for `ModalTitle` and `ModalDescription`.
 *
 * @example
 * ```tsx
 * <ModalHeader>
 *   <ModalTitle>Confirm Deletion</ModalTitle>
 *   <ModalDescription>This action cannot be undone.</ModalDescription>
 * </ModalHeader>
 * ```
 *
 * @param props - Standard HTML div attributes.
 */
export const ModalHeader = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div class={twMerge('flex flex-col gap-1.5 mb-5 pr-8', local.class)} {...others}>
      {local.children}
    </div>
  );
};

/**
 * ### ModalTitle Component
 *
 * The primary title heading for the modal.
 *
 * @example
 * ```tsx
 * <ModalTitle>Edit Profile</ModalTitle>
 * ```
 *
 * @param props - Standard HTML heading attributes.
 */
export const ModalTitle = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <h3 class={twMerge('text-lg font-bold leading-none tracking-tight', local.class)} {...others}>
      {local.children}
    </h3>
  );
};

/**
 * ### ModalDescription Component
 *
 * Supporting descriptive text rendered below the title.
 *
 * @example
 * ```tsx
 * <ModalDescription>Make changes to your profile. Click save when done.</ModalDescription>
 * ```
 *
 * @param props - Standard HTML paragraph attributes.
 */
export const ModalDescription = (props: JSX.HTMLAttributes<HTMLParagraphElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <p class={twMerge('text-sm text-muted', local.class)} {...others}>
      {local.children}
    </p>
  );
};

/**
 * ### ModalContent Component
 *
 * The main container for the modal's primary content.
 *
 * @param props - Standard HTML div attributes.
 */
export const ModalContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div class={twMerge('flex-1', local.class)} {...others}>
      {local.children}
    </div>
  );
};

/**
 * ### ModalFooter Component
 *
 * A container for modal action buttons, aligned to the right.
 *
 * @example
 * ```tsx
 * <ModalFooter>
 *   <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
 *   <Button onClick={handleSave}>Save</Button>
 * </ModalFooter>
 * ```
 *
 * @param props - Standard HTML div attributes.
 */
export const ModalFooter = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div class={twMerge('flex items-center justify-end gap-2 mt-6', local.class)} {...others}>
      {local.children}
    </div>
  );
};
