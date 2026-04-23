import { For, type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * ### Breadcrumb Component
 *
 * A horizontal trail of links that helps users visualize their current location in the application hierarchy.
 * It uses a clean, monospace-style separator and distinguishes between interactive paths and the current static page.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/components">Components</BreadcrumbLink>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 *
 * **Visual Features:**
 * - **Separators:** Automatically injects a "/" character between each crumb starting from the second item.
 * - **State Styles:** Past locations are rendered in a "muted" color with hover effects, while the current location is bold and highlighted.
 * - **Mono Aesthetic:** Uses a monospace font stack to align with the library's technical design system.
 *
 * @param props - Standard HTML nav attributes.
 */
export const Breadcrumb = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <nav
      class={twMerge('flex items-center text-sm font-mono', local.class)}
      aria-label="breadcrumb"
      {...others}
    >
      {local.children}
    </nav>
  );
};

/**
 * ### BreadcrumbList Component
 *
 * The list container for breadcrumb items.
 *
 * @param props - Standard HTML ol attributes.
 */
export const BreadcrumbList = (props: JSX.HTMLAttributes<HTMLOListElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <ol
      class={twMerge(
        'flex flex-wrap items-center gap-1.5 wrap-break-word text-sm text-muted-foreground sm:gap-2.5',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </ol>
  );
};

/**
 * ### BreadcrumbItem Component
 *
 * An individual item in the breadcrumb list.
 *
 * @param props - Standard HTML li attributes.
 */
export const BreadcrumbItem = (props: JSX.HTMLAttributes<HTMLLIElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <li class={twMerge('inline-flex items-center gap-1.5', local.class)} {...others}>
      {local.children}
    </li>
  );
};

/**
 * ### BreadcrumbLink Component
 *
 * The clickable link within a breadcrumb item.
 *
 * @param props - Standard HTML anchor attributes.
 */
export const BreadcrumbLink = (props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <a class={twMerge('transition-colors hover:text-foreground', local.class)} {...others}>
      {local.children}
    </a>
  );
};

/**
 * ### BreadcrumbSeparator Component
 *
 * The visual separator between breadcrumb items.
 *
 * @param props - Standard HTML li attributes.
 */
export const BreadcrumbSeparator = (props: JSX.HTMLAttributes<HTMLLIElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <li
      role="presentation"
      aria-hidden="true"
      class={twMerge('[&>svg]:w-3.5 [&>svg]:h-3.5', local.class)}
      {...others}
    >
      {local.children ?? '/'}
    </li>
  );
};
