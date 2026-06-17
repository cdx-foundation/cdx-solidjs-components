import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vite-plus/test';
import { Checkbox } from '../lib/ui/Checkbox';

describe('Checkbox', () => {
  it('renders and toggles', () => {
    const onCheckedChange = vi.fn();
    render(() => <Checkbox label="Accept Terms" onCheckedChange={onCheckedChange} />);

    expect(screen.getByText('Accept Terms')).toBeInTheDocument();
    const label = screen.getByText('Accept Terms');

    fireEvent.click(label);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('can be controlled', () => {
    render(() => <Checkbox checked={true} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });
});
