import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Badge } from '../lib/ui/Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    render(() => <Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(() => <Badge variant="success">Active</Badge>);
    expect(container.firstChild).toHaveClass('text-emerald-600');
  });
});
