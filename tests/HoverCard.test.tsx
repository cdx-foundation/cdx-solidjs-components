import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { HoverCard } from '../lib/ui/HoverCard';

describe('HoverCard', () => {
  it('renders trigger element', () => {
    render(() => <HoverCard trigger={<span>Hover me</span>}>HoverCard content</HoverCard>);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows content on hover', async () => {
    render(() => <HoverCard trigger={<span>Hover me</span>}>HoverCard content</HoverCard>);

    const trigger = screen.getByText('Hover me');
    expect(screen.queryByText('HoverCard content')).not.toBeInTheDocument();

    fireEvent.mouseEnter(trigger.parentElement!);

    const content = await screen.findByText('HoverCard content');
    expect(content).toBeInTheDocument();
  });

  it('supports diagonal alignment', async () => {
    render(() => (
      <HoverCard trigger={<span>Hover me</span>} align="bottom-right">
        HoverCard content
      </HoverCard>
    ));

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger.parentElement!);

    const content = await screen.findByText('HoverCard content');
    expect(content).toBeInTheDocument();
  });
});
