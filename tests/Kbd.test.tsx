import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Kbd } from '../ui/Kbd';

describe('Kbd', () => {
  it('renders correctly with children', () => {
    render(() => <Kbd>CMD</Kbd>);
    expect(screen.getByText('CMD')).toBeInTheDocument();
  });

  it('has correct tag name', () => {
    render(() => <Kbd>ESC</Kbd>);
    expect(screen.getByText('ESC').tagName).toBe('KBD');
  });

  it('applies base classes', () => {
    const { container } = render(() => <Kbd>K</Kbd>);
    const kbd = container.firstChild as HTMLElement;

    expect(kbd).toHaveClass('font-mono');
    expect(kbd).toHaveClass('bg-surface');
    expect(kbd).toHaveClass('pointer-events-none');
  });
});
