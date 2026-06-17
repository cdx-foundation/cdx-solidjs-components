import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Skeleton } from '../lib/ui/Skeleton';

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(() => <Skeleton />);
    const skeleton = container.firstElementChild;

    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('rounded-card');
  });

  it('applies custom classes', () => {
    const { container } = render(() => <Skeleton class="h-10 w-10 rounded-full" />);
    const skeleton = container.firstElementChild;

    expect(skeleton).toHaveClass('h-10');
    expect(skeleton).toHaveClass('w-10');
    expect(skeleton).toHaveClass('rounded-full');
  });
});
