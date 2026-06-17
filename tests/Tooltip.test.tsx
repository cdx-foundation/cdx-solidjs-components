import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Tooltip } from '../lib/ui/Tooltip';

describe('Tooltip', () => {
  it('renders trigger element', () => {
    render(() => (
      <Tooltip trigger={<button type="button">Hover me</button>} content="Tooltip info" />
    ));
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows content on hover', async () => {
    render(() => (
      <Tooltip trigger={<button type="button">Hover me</button>} content="Tooltip info" />
    ));

    const trigger = screen.getByText('Hover me');

    // Tooltip content should NOT be in the document yet (Show when={isOpen})
    expect(screen.queryByText('Tooltip info')).not.toBeInTheDocument();

    // Hover over the trigger
    fireEvent.mouseEnter(trigger.parentElement!);

    // Tooltip content should now be in the document
    const content = await screen.findByText('Tooltip info');
    expect(content).toBeInTheDocument();

    // Check if it's inside a Portal (usually at the end of body)
    expect(content.closest('body')).toBeInTheDocument();
  });
});
