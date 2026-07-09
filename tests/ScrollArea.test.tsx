import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { ScrollArea } from '../lib/ui/ScrollArea';

describe('ScrollArea', () => {
  it('renders children', () => {
    render(() => (
      <ScrollArea>
        <p>Scrollable content</p>
      </ScrollArea>
    ));

    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('applies maxHeight style', () => {
    render(() => (
      <ScrollArea maxHeight="200px">
        <p>Content</p>
      </ScrollArea>
    ));

    const container = screen.getByText('Content').parentElement!;
    expect(container.style.maxHeight).toBe('200px');
  });

  it('defaults maxHeight to 100%', () => {
    render(() => (
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>
    ));

    const container = screen.getByText('Content').parentElement!;
    expect(container.style.maxHeight).toBe('100%');
  });

  it('has overflow-auto and custom-scrollbar classes', () => {
    render(() => (
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>
    ));

    const container = screen.getByText('Content').parentElement!;
    expect(container).toHaveClass('overflow-auto');
    expect(container).toHaveClass('custom-scrollbar');
  });

  it('applies additional class names', () => {
    render(() => (
      <ScrollArea class="border p-2">
        <p>Content</p>
      </ScrollArea>
    ));

    const container = screen.getByText('Content').parentElement!;
    expect(container).toHaveClass('border');
    expect(container).toHaveClass('p-2');
  });
});
