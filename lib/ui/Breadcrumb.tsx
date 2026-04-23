import { For, type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Represents a single node within the breadcrumb navigation path.
 */
interface BreadcrumbItem {
  /**
   * The text displayed for this path segment.
   */
  label: string;

  /**
   * The destination URL.
   * If provided, the segment is rendered as a clickable link.
   * If omitted, it is rendered as plain text (typically used for the current page).
   */
  href?: string;
}

/**
 * Configuration properties for the Breadcrumb component.
 */
interface BreadcrumbProps extends JSX.HTMLAttributes<HTMLElement> {
  /**
   * A sequential array of items representing the navigation trail from root to current location.
   */
  items: BreadcrumbItem[];
}

/**
 * ### Breadcrumb Component
 *
 * A horizontal trail of links that helps users visualize their current location in the application hierarchy.
 * It uses a clean, monospace-style separator and distinguishes between interactive paths and the current static page.
 *
 * @example
 * ```tsx
 * const crumbs = [
 *   { label: "Dashboard", href: "/home" },
 *   { label: "Project Alpha", href: "/projects/alpha" },
 *   { label: "Settings" } // Current page (non-clickable)
 * ];
 *
 * <Breadcrumb items={crumbs} />
 * ```
 *
 * **Visual Features:**
 * - **Separators:** Automatically injects a "/" character between each crumb starting from the second item.
 * - **State Styles:** Past locations are rendered in a "muted" color with hover effects, while the current location is bold and highlighted.
 * - **Mono Aesthetic:** Uses a monospace font stack to align with the library's technical design system.
 *
 * @param props - Customization options including the `items` array.
 */
export const Breadcrumb = (props: BreadcrumbProps) => {
  const [local, others] = splitProps(props, ['items', 'class']);

  return (
    <nav class={twMerge('flex items-center text-sm font-mono', local.class)} {...others}>
      <For each={local.items}>
        {(item, index) => (
          <div class="flex items-center">
            <Show when={index() > 0}>
              <span class="mx-2 text-muted/50">/</span>
            </Show>
            {item.href ? (
              <a href={item.href} class="text-muted hover:text-fg transition-colors">
                {item.label}
              </a>
            ) : (
              <span class="text-fg font-medium">{item.label}</span>
            )}
          </div>
        )}
      </For>
    </nav>
  );
};
