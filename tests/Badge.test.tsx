import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Badge } from '../ui/Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    render(() => <Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('New')).toHaveAttribute('role', 'status');
  });

  it('applies variant classes', () => {
    const { container } = render(() => <Badge variant="success">Active</Badge>);
    expect(container.firstChild).toHaveClass('text-emerald-600');
  });
});
