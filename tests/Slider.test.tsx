import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from '../lib/ui/Slider';

describe('Slider', () => {
  it('renders with label and value', () => {
    render(() => <Slider label="Volume" value={50} />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveValue('50');
  });

  it('calls onValueChange on input', () => {
    const onValueChange = vi.fn();
    render(() => <Slider onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider');

    fireEvent.input(slider, { target: { value: '75' } });
    expect(onValueChange).toHaveBeenCalledWith(75);
  });
});
