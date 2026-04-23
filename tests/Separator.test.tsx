import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Separator } from '../lib/ui/Separator';

describe('Separator', () => {
  it('renders horizontal separator by default', () => {
    const { container } = render(() => <Separator />);
    const separator = container.firstChild as HTMLElement;

    expect(separator).toHaveClass('h-px');
    expect(separator).toHaveClass('w-full');
  });

  it('renders vertical separator', () => {
    const { container } = render(() => <Separator orientation="vertical" />);
    const separator = container.firstChild as HTMLElement;

    expect(separator).toHaveClass('h-full');
    expect(separator).toHaveClass('w-px');
  });
});
