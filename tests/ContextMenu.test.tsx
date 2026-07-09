import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { ContextMenu } from '../lib/ui/ContextMenu';

describe('ContextMenu', () => {
  it('renders trigger content', () => {
    render(() => (
      <ContextMenu menu={<div>Menu Content</div>}>
        <span>Right click me</span>
      </ContextMenu>
    ));

    expect(screen.getByText('Right click me')).toBeInTheDocument();
  });

  it('applies custom class to the wrapper', () => {
    const { container } = render(() => (
      <ContextMenu menu={<div>Menu Content</div>} class="custom-wrapper">
        <span>Content</span>
      </ContextMenu>
    ));

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-wrapper');
  });
});
