import { createSignal } from 'solid-js';

/**
 * Custom hook to manage a boolean state, typically used for modals, popovers, and drawers.
 *
 * @param initialState - The initial state of the disclosure. @default false
 * @returns An object with the current state and functions to update it.
 *
 * @example
 * ```tsx
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 *
 * <Button onClick={onOpen}>Open Modal</Button>
 * <Modal isOpen={isOpen()} onClose={onClose}>...</Modal>
 * ```
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = createSignal(initialState);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    setIsOpen,
  };
}
