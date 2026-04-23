import { createShortcut } from '@solid-primitives/keyboard';
import { Check } from 'lucide-solid';
import { For, Show, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { clickOutside } from '../directives';

// Suppress unused warning for directive
false && clickOutside;

const PRESET_COLORS = [
  { label: 'Crimson', value: '#c62828' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Sky', value: '#0284c7' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Pink', value: '#db2777' },
  { label: 'Slate', value: '#475569' },
  { label: 'Zinc', value: '#71717a' },
];

/**
 * Configuration and behavior properties for the ColorPicker component.
 */
interface ColorPickerProps {
  /**
   * A text label shown above the color picker trigger.
   */
  label?: string;

  /**
   * The currently active color in Hex format (e.g., "#FF0000").
   */
  value: string;

  /**
   * Callback fired when a color is chosen from the presets or the custom picker.
   */
  onChange?: (color: string) => void;

  /**
   * @deprecated Use `onChange` instead.
   * Provided for compatibility with standard input event patterns.
   */
  onInput?: (e: { currentTarget: { value: string } }) => void;

  /**
   * Custom CSS classes for the trigger button.
   */
  class?: string;

  /**
   * Custom CSS classes for the outer container element.
   */
  containerClass?: string;
}

/**
 * ### ColorPicker Component
 *
 * A high-end color selection tool that balances ease-of-use with precise control.
 * It features a grid of curated "preset" colors for rapid selection and a native color picker
 * for custom Hex values.
 *
 * @example
 * ```tsx
 * const [accent, setAccent] = createSignal("#4f46e5");
 *
 * <ColorPicker
 *   label="Theme Accent"
 *   value={accent()}
 *   onChange={setAccent}
 * />
 * ```
 *
 * **Components & Features:**
 * - **Preset Grid:** 12 curated colors representing a wide aesthetic spectrum.
 * - **Custom Input:** Integrates the browser's native `<input type="color">` for infinite selection.
 * - **Visual State:** The trigger button reflects the active color in a circular swatch.
 * - **Dismissal:** Automatically closes on `Escape` or when clicking outside.
 *
 * @param props - Customization options including `label` and `value`.
 */
export const ColorPicker = (props: ColorPickerProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const currentColor = () => props.value || '#c62828';
  const currentLabel = () =>
    PRESET_COLORS.find((c) => c.value === currentColor())?.label ?? currentColor().toUpperCase();

  const handleSelect = (color: string) => {
    props.onChange?.(color);
    // Backward compat with onInput pattern
    props.onInput?.({ currentTarget: { value: color } });
    setIsOpen(false);
  };

  createShortcut(['Escape'], () => {
    if (isOpen()) setIsOpen(false);
  });

  return (
    <div
      class={twMerge('flex flex-col gap-1.5 w-full text-left', props.containerClass)}
      use:clickOutside={() => setIsOpen(false)}
    >
      <Show when={props.label}>
        <span class="text-xs font-semibold text-fg">{props.label}</span>
      </Show>

      <div class="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen())}
          class={twMerge(
            'w-full flex items-center gap-3 border border-stroke bg-transparent rounded-input px-3 py-2 text-sm text-fg outline-none transition-colors duration-150 cursor-pointer hover:border-muted',
            isOpen() && 'border-fg',
            props.class,
          )}
        >
          <div
            class="w-6 h-6 rounded-badge border border-stroke shrink-0"
            style={{ 'background-color': currentColor() }}
          />
          <span class="flex-1 text-left font-mono text-xs">{currentLabel()}</span>
          <span
            class={twMerge(
              'text-muted text-[10px] transition-transform duration-150',
              isOpen() && 'rotate-180',
            )}
          >
            ▾
          </span>
        </button>

        {/* Dropdown */}
        <Show when={isOpen()}>
          <div class="absolute z-50 mt-1 w-full border border-stroke bg-panel rounded-card overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div class="p-3">
              <div class="grid grid-cols-6 gap-2">
                <For each={PRESET_COLORS}>
                  {(color) => {
                    const isSelected = () => currentColor() === color.value;
                    return (
                      <button
                        type="button"
                        onClick={() => handleSelect(color.value)}
                        class={twMerge(
                          'relative w-full aspect-square rounded-badge border-2 transition-all duration-100 cursor-pointer hover:scale-110',
                          isSelected()
                            ? 'border-fg ring-1 ring-fg/20 scale-110'
                            : 'border-transparent hover:border-stroke',
                        )}
                        style={{ 'background-color': color.value }}
                        title={color.label}
                      >
                        <Show when={isSelected()}>
                          <div class="absolute inset-0 flex items-center justify-center">
                            <Check size={12} class="text-white drop-shadow-sm" />
                          </div>
                        </Show>
                      </button>
                    );
                  }}
                </For>
              </div>

              {/* Custom color input */}
              <div class="mt-3 pt-3 border-t border-stroke flex items-center gap-2">
                <input
                  type="color"
                  value={currentColor()}
                  onInput={(e) => handleSelect(e.currentTarget.value)}
                  class="w-7 h-7 rounded-badge border border-stroke cursor-pointer p-0 bg-transparent"
                />
                <span class="text-[11px] text-muted font-mono">Custom</span>
                <span class="text-[11px] text-fg font-mono ml-auto">
                  {currentColor().toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};
