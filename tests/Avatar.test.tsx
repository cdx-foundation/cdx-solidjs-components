import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Avatar } from '../ui/Avatar';

describe('Avatar', () => {
  it('renders fallback initials when src is not provided', () => {
    render(() => <Avatar fallback="John Doe" />);
    expect(screen.getByText('Jo')).toBeInTheDocument();
  });

  it('renders an image when src is provided', () => {
    render(() => <Avatar src="test.jpg" fallback="John Doe" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
  });

  it('applies custom classes', () => {
    const { container } = render(() => <Avatar fallback="JD" class="h-12 w-12" />);
    expect(container.firstChild).toHaveClass('h-12 w-12');
  });
});
