import { type Component, type JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * ### Card Component
 *
 * A fundamental layout container used to group related information and actions.
 * It provides a consistent "panel" aesthetic with standardized padding, border, and background.
 *
 * @example
 * ```tsx
 * <Card class="max-w-sm" as="a" href="/details">
 *   <h3 class="font-bold">Project Update</h3>
 *   <p class="text-sm text-muted">The new documentation is now live.</p>
 *   <Button class="mt-2">View Details</Button>
 * </Card>
 * ```
 *
 * **Design Specifications:**
 * - **Visual Style:** Inherits the `clean-panel` utility class, providing a subtle background and stroke.
 * - **Layout:** Uses a vertical flex layout (`flex-col`) with a default gap of `3` (12px).
 * - **Responsiveness:** Sets `w-full` by default, but allows for custom sizing via the `class` prop.
 *
 * @param props - Customization options including `as`.
 */
export const Card = (
  props: JSX.HTMLAttributes<HTMLElement> & {
    as?: keyof JSX.IntrinsicElements | Component<Record<string, unknown>>;
    href?: string;
  },
) => {
  const [local, others] = splitProps(props, ['class', 'children', 'as']);
  return (
    <Dynamic
      component={local.as || 'div'}
      class={twMerge('clean-panel w-full p-5 text-left flex flex-col gap-3', local.class)}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
};

/**
 * ### CardHeader Component
 *
 * Container for the card's title and description.
 * Applies standard vertical spacing.
 *
 * @param props - Standard HTML div attributes.
 */
export const CardHeader = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div class={twMerge('flex flex-col space-y-1.5', local.class)} {...others}>
      {local.children}
    </div>
  );
};

/**
 * ### CardTitle Component
 *
 * The primary heading for the card.
 * Uses an `<h3>` element by default with emphasized typography.
 *
 * @param props - Customization options including `as`.
 */
export const CardTitle = (
  props: JSX.HTMLAttributes<HTMLElement> & {
    as?: keyof JSX.IntrinsicElements | Component<Record<string, unknown>>;
  },
) => {
  const [local, others] = splitProps(props, ['class', 'children', 'as']);
  return (
    <Dynamic
      component={local.as || 'h3'}
      class={twMerge('text-lg font-semibold leading-none tracking-tight', local.class)}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
};

/**
 * ### CardDescription Component
 *
 * Secondary descriptive text for the card, typically placed under the title.
 *
 * @param props - Customization options including `as`.
 */
export const CardDescription = (
  props: JSX.HTMLAttributes<HTMLElement> & {
    as?: keyof JSX.IntrinsicElements | Component<Record<string, unknown>>;
  },
) => {
  const [local, others] = splitProps(props, ['class', 'children', 'as']);
  return (
    <Dynamic
      component={local.as || 'p'}
      class={twMerge('text-sm text-muted-foreground', local.class)}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
};

/**
 * ### CardContent Component
 *
 * The main body container for the card where primary content should be placed.
 *
 * @param props - Standard HTML div attributes.
 */
export const CardContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div class={twMerge('', local.class)} {...others}>
      {local.children}
    </div>
  );
};

/**
 * ### CardFooter Component
 *
 * Container for the card's bottom actions or secondary information.
 *
 * @param props - Standard HTML div attributes.
 */
export const CardFooter = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div class={twMerge('flex items-center pt-0', local.class)} {...others}>
      {local.children}
    </div>
  );
};
