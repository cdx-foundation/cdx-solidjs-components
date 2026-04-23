import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { AspectRatio } from '../ui/AspectRatio';

describe('AspectRatio', () => {
  it('renders children and applies padding-bottom correctly', () => {
    const { container } = render(() => (
      <AspectRatio ratio={2}>
        <div data-testid="content">Content</div>
      </AspectRatio>
    ));

    expect(screen.getByTestId('content')).toBeInTheDocument();
    const outer = container.firstElementChild as HTMLElement;
    // ratio = 2 -> 1/2 = 50%
    expect(outer.style.paddingBottom).toBe('50%');
  });

  it('uses default ratio 16/9 if none provided', () => {
    const { container } = render(() => (
      <AspectRatio>
        <div>Content</div>
      </AspectRatio>
    ));

    const outer = container.firstElementChild as HTMLElement;
    const expectedPadding = `${(1 / (16 / 9)) * 100}%`;
    expect(outer.style.paddingBottom).toBe(expectedPadding);
  });
});
