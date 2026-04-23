import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * ### Label Component
 *
 * A semantic and accessible wrapper for form field headings.
 * It ensures consistent typography and alignment across all input-based components.
 *
 * @example
 * ```tsx
 * <div class="flex flex-col gap-2">
 *   <Label for="username">Username</Label>
 *   <Input id="username" />
 * </div>
 * ```
 *
 * **Design Specifications:**
 * - **Typography:** Uses the theme's small (`text-xs`) size with semi-bold weight for high hierarchy visibility.
 * - **Interactions:** Automatically focuses the linked input when clicked, provided the `for` attribute matches the input's `id`.
 *
 * @param props - Standard HTML label attributes including `for`.
 */
export const Label = (props: JSX.LabelHTMLAttributes<HTMLLabelElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Base primitive label
    <label class={twMerge('text-xs font-semibold text-fg leading-none', local.class)} {...others} />
  );
};
