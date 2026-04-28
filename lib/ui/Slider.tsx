import { type JSX, Show, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { uid } from '../uid';

/**
 * Configuration and behavior properties for the Slider component.
 */
interface SliderProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /**
   * A text heading displayed above the slider track.
   */
  label?: string;

  /**
   * The current numeric value. Inherits `min` and `max` from standard input attributes.
   * @default 0
   */
  value: number;

  /**
   * Callback fired when the slider value changes.
   */
  onChange?: (value: number) => void;

  /**
   * Custom CSS classes applied to the flex container wrapping the label and track.
   */
  containerClass?: string;
}

/**
 * ### Slider Component
 *
 * A precision-styled range input used to select a single value from a spectrum.
 * Unlike the browser default, this component features a theme-aware gradient track and a high-contrast square thumb.
 *
 * @example
 * ```tsx
 * const [volume, setVolume] = createSignal(50);
 *
 * <Slider
 *   label="System Volume"
 *   min={0}
 *   max={100}
 *   step={1}
 *   value={volume()}
 *   onChange={setVolume}
 * />
 * ```
 *
 * **Visual Features:**
 * - **Dynamic Track:** The track color fills proportionally from the left based on the current value.
 * - **Mono Aesthetic:** Uses a distinct square thumb and mono typography for value display.
 * - **Tabular Nums:** The value readout is rendered with tabular numbers to prevent horizontal shifting during sliding.
 *
 * @param props - Customization options including `label`, `min`, `max`, and `step`.
 */
export const Slider = (props: SliderProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'class',
    'value',
    'id',
    'containerClass',
    'onChange',
  ]);
  const id = local.id || uid('slider');

  const min = () => Number(others.min || 0);
  const max = () => Number(others.max || 100);
  const percentage = () =>
    Math.max(0, Math.min(100, ((local.value - min()) / (max() - min())) * 100));

  return (
    <div class={twMerge('flex flex-col gap-2 w-full', local.containerClass)}>
      <Show when={local.label}>
        <div class="flex justify-between items-center">
          <label for={id} class="text-xs font-semibold text-fg cursor-pointer">
            {local.label}
          </label>
          <span class="text-sm font-bold text-fg tabular-nums">{local.value}%</span>
        </div>
      </Show>
      <input
        type="range"
        id={id}
        value={local.value}
        style={{
          background: `linear-gradient(to right, var(--color-primary) ${percentage()}%, var(--color-stroke) ${percentage()}%)`,
        }}
        onInput={(e) => local.onChange?.(Number(e.currentTarget.value))}
        class={twMerge(
          'w-full h-1 appearance-none cursor-pointer outline-none',
          // Custom WebKit Thumb (Square)
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-stroke [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110',
          // Custom Firefox Thumb (Square)
          '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-stroke [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110',
          local.class,
        )}
        {...others}
      />
    </div>
  );
};
