import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Avatar, AvatarFallback, AvatarImage } from '../lib/ui/Avatar';

describe('Avatar', () => {
  it('renders fallback initials', () => {
    render(() => (
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    ));
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders an image when src is provided', () => {
    render(() => (
      <Avatar>
        <AvatarImage src="test.jpg" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    ));
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
  });

  it('applies custom classes', () => {
    const { container } = render(() => (
      <Avatar class="h-12 w-12">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    ));
    expect(container.firstChild).toHaveClass('h-12 w-12');
  });
});
