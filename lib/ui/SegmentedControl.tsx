import { For, Show, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

/**
 * Represents an individual segment in the control.
 */
export interface SegmentedControlOption {
  /** The internal value associated with this segment. */
  value: string | number;
  /** The text label displayed to the user. */
  label: string;
  /** An optional icon component to render alongside the label. */
  icon?: any;
}

/**
 * Configuration properties for the SegmentedControl component.
 */
interface SegmentedControlProps {
  /** The list of selectable segments. */
  options: SegmentedControlOption[];
  /** The currently active value. */
  value: string | number;
  /** Callback fired when a segment is selected. */
  onChange: (value: string | number) => void;
  /** Custom CSS classes for the outer container. */
  class?: string;
  /** Custom CSS classes for the individual segment buttons. */
  itemClass?: string;
}

/**
 * ### SegmentedControl Component
 *
 * A compact, pill-styled toggle group for switching between mutually exclusive values.
 * Optimized for toolbars, theme switchers, and view mode toggles.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   value={view()}
 *   onChange={setView}
 *   options={[
 *     { value: 'grid', label: 'Grid', icon: GridIcon },
 *     { value: 'list', label: 'List', icon: ListIcon }
 *   ]}
 * />
 * ```
 */
export const SegmentedControl = (props: SegmentedControlProps) => {
  const [local, _others] = splitProps(props, [
    'options',
    'value',
    'onChange',
    'class',
    'itemClass',
  ]);

  return (
    <div
      class={twMerge(
        'inline-flex items-center bg-surface p-1 rounded-input border border-stroke shadow-sm',
        local.class,
      )}
    >
      <For each={local.options}>
        {(option) => {
          const isActive = () => local.value === option.value;

          return (
            <button
              type="button"
              onClick={() => local.onChange(option.value)}
              class={twMerge(
                'flex items-center justify-center gap-2 px-3 py-1.5 rounded-btn text-[11px] font-bold transition-all outline-none cursor-pointer',
                isActive()
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted hover:text-fg hover:bg-panel/50',
                local.itemClass,
              )}
            >
              <Show when={option.icon}>
                <Dynamic component={option.icon} class="shrink-0" size={12} />
              </Show>
              <span>{option.label}</span>
            </button>
          );
        }}
      </For>
    </div>
  );
};
