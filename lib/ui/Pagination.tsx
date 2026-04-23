import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-solid';
import { For, type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * Configuration and behavior properties for the Pagination component.
 */
interface PaginationProps extends JSX.HTMLAttributes<HTMLElement> {
  /**
   * The current active page. Note: This is 1-indexed (starts from 1).
   */
  currentPage: number;

  /**
   * The total count of pages available based on your data set.
   */
  totalPages: number;

  /**
   * Callback fired when a user clicks a page number or the Next/Prev buttons.
   */
  onPageChange?: (page: number) => void;
}

/**
 * ### Pagination Component
 *
 * A navigation element for traversing through divided data sets.
 * It intelligently calculates which page numbers to show and automatically injects ellipsis
 * for large sets to maintain a compact UI.
 *
 * @example
 * ```tsx
 * const [page, setPage] = createSignal(1);
 *
 * <Pagination
 *   currentPage={page()}
 *   totalPages={20}
 *   onPageChange={setPage}
 * />
 * ```
 *
 * **Functionality:**
 * - **Smart Windowing:** Only shows relevant page numbers around the current selection (e.g., [1, '...', 4, 5, 6, '...', 20]).
 * - **Navigation Controls:** Provides explicit "Next" and "Previous" chevron buttons.
 * - **State Styles:** The active page is highlighted with a border and subtle background.
 * - **Mono Aesthetic:** Page numbers are rendered in a monospace font for character alignment and technical feel.
 *
 * @param props - Customization options including `currentPage` and `totalPages`.
 */
export const Pagination = (props: PaginationProps) => {
  const [local, others] = splitProps(props, ['currentPage', 'totalPages', 'onPageChange', 'class']);

  const getPages = () => {
    // Logic for generating the page array with ellipsis
    if (local.totalPages <= 5) {
      return Array.from({ length: local.totalPages }, (_, i) => i + 1);
    }
    if (local.currentPage <= 3) {
      return [1, 2, 3, 4, '...', local.totalPages];
    }
    if (local.currentPage >= local.totalPages - 2) {
      return [
        1,
        '...',
        local.totalPages - 3,
        local.totalPages - 2,
        local.totalPages - 1,
        local.totalPages,
      ];
    }
    return [
      1,
      '...',
      local.currentPage - 1,
      local.currentPage,
      local.currentPage + 1,
      '...',
      local.totalPages,
    ];
  };

  return (
    <nav class={twMerge('flex items-center gap-1', local.class)} {...others}>
      <button
        type="button"
        disabled={local.currentPage <= 1}
        onClick={() => local.onPageChange?.(local.currentPage - 1)}
        class="flex items-center justify-center w-8 h-8 border border-transparent text-muted hover:text-fg hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      <For each={getPages()}>
        {(page) => {
          if (page === '...') {
            return (
              <div class="flex items-center justify-center w-8 h-8 text-muted">
                <MoreHorizontal size={16} />
              </div>
            );
          }
          const isSelected = () => local.currentPage === page;
          return (
            <button
              type="button"
              onClick={() => local.onPageChange?.(page as number)}
              class={twMerge(
                'flex items-center justify-center w-8 h-8 text-sm font-mono transition-colors border',
                isSelected()
                  ? 'border-stroke bg-surface text-fg font-bold'
                  : 'border-transparent text-muted hover:text-fg hover:bg-surface/50',
              )}
            >
              {page}
            </button>
          );
        }}
      </For>

      <button
        type="button"
        disabled={local.currentPage >= local.totalPages}
        onClick={() => local.onPageChange?.(local.currentPage + 1)}
        class="flex items-center justify-center w-8 h-8 border border-transparent text-muted hover:text-fg hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};
