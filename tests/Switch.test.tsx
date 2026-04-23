import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '../lib/ui/Switch';

describe('Switch', () => {
  it('renders correctly', () => {
    render(() => <Switch label="Notifications" />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('toggles when clicked', () => {
    const onCheckedChange = vi.fn();
    render(() => <Switch label="Toggle" onCheckedChange={onCheckedChange} />);
    const label = screen.getByText('Toggle');

    fireEvent.click(label);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects disabled state', () => {
    const onCheckedChange = vi.fn();
    render(() => <Switch label="Disabled Toggle" disabled onCheckedChange={onCheckedChange} />);
    const label = screen.getByText('Disabled Toggle');

    fireEvent.click(label);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
