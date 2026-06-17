import { createShortcut } from '@solid-primitives/keyboard';
import { Check } from 'lucide-solid';
import { For, Show, createEffect, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { clickOutside } from '../directives';

// Suppress unused warning for directive
false && clickOutside;

export const PRESET_COLORS = [
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
   * Callback fired when a color is chosen.
   */
  onChange?: (color: string) => void;

  /**
   * Custom CSS classes for the trigger button.
   */
  class?: string;

  /**
   * Custom CSS classes for the outer container element.
   */
  containerClass?: string;

  /**
   * Override the preset color swatches. Defaults to PRESET_COLORS.
   */
  presets?: { label: string; value: string }[];
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
 * @param props - Customization options including `label` and `value`.
 */
export const ColorPicker = (props: ColorPickerProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'value',
    'onChange',
    'class',
    'containerClass',
    'presets',
  ]);

  const presets = () => local.presets ?? PRESET_COLORS;
  const [isOpen, setIsOpen] = createSignal(false);

  const currentColor = () => local.value || '#c62828';
  const currentLabel = () =>
    PRESET_COLORS.find((c) => c.value === currentColor())?.label ?? currentColor().toUpperCase();

  const [hexDraft, setHexDraft] = createSignal(currentColor());
  // Sync hexDraft with the actual colour whenever the picker opens,
  // so stale drafts from a previous editing session are discarded.
  createEffect(() => {
    if (isOpen()) setHexDraft(currentColor());
  });

  const handleSelect = (color: string) => {
    local.onChange?.(color);
    setIsOpen(false);
  };

  const commitHex = () => {
    const v = hexDraft().trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v) && v !== currentColor()) {
      handleSelect(v.toLowerCase());
    } else {
      // Reset draft to current valid colour on blur if input is invalid
      setHexDraft(currentColor());
    }
  };

  const liveHex = (v: string) => {
    setHexDraft(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v.trim())) local.onChange?.(v.trim().toLowerCase());
  };

  createShortcut(['Escape'], () => {
    if (isOpen()) setIsOpen(false);
  });

  return (
    <div
      class={twMerge('flex flex-col gap-1.5 w-full text-left', local.containerClass)}
      use:clickOutside={() => setIsOpen(false)}
      {...others}
    >
      <Show when={local.label}>
        <span class="text-xs font-semibold text-fg">{local.label}</span>
      </Show>

      <div class="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen())}
          class={twMerge(
            'w-full flex items-center gap-3 border border-stroke bg-transparent rounded-input px-3 py-2 text-sm text-fg outline-none transition-colors duration-150 cursor-pointer hover:border-muted',
            isOpen() && 'border-fg',
            local.class,
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
          <div class="absolute z-50 mt-1 w-full border border-stroke bg-panel rounded-card overflow-hidden animate-in fade-in duration-100">
            <div class="p-3">
              <div class="grid grid-cols-6 gap-2">
                <For each={presets()}>
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
                  class="w-7 h-7 rounded-badge border border-stroke cursor-pointer p-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={hexDraft()}
                  onInput={(e) => liveHex(e.currentTarget.value)}
                  onBlur={commitHex}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitHex();
                  }}
                  placeholder="#000000"
                  class="flex-1 text-[11px] text-fg font-mono bg-transparent border border-stroke rounded px-2 py-1 outline-none transition-colors focus:border-fg"
                />
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};
