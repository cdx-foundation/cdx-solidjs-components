import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Label } from '../lib/ui/Label';

describe('Label', () => {
  it('renders correctly with children', () => {
    render(() => <Label>Username</Label>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('has correct tag name', () => {
    render(() => <Label>Email</Label>);
    expect(screen.getByText('Email').tagName).toBe('LABEL');
  });

  it('applies for attribute', () => {
    render(() => <Label for="input-id">Label</Label>);
    expect(screen.getByText('Label')).toHaveAttribute('for', 'input-id');
  });

  it('applies custom classes', () => {
    const { container } = render(() => <Label class="custom-label">Label</Label>);
    expect(container.firstChild).toHaveClass('custom-label');
    expect(container.firstChild).toHaveClass('text-xs');
  });
});
