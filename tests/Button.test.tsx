import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vite-plus/test';
import { Button } from '../lib/ui/Button';

describe('Button', () => {
  it('renders correctly with children', () => {
    render(() => <Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(() => <Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with different variants', () => {
    const { container } = render(() => <Button variant="destructive">Delete</Button>);
    expect(container.firstChild).toHaveClass('bg-red-600');
  });

  it('is disabled when the disabled prop is true', () => {
    render(() => <Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
