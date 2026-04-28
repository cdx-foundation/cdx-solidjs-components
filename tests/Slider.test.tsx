import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from '../lib/ui/Slider';

describe('Slider', () => {
  it('renders with label and value', () => {
    render(() => <Slider label="Volume" value={50} />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveValue('50');
  });

  it('calls onChange on input', () => {
    const onChange = vi.fn();
    render(() => <Slider onChange={onChange} />);
    const slider = screen.getByRole('slider');

    fireEvent.input(slider, { target: { value: '75' } });
    expect(onChange).toHaveBeenCalledWith(75);
  });
});
