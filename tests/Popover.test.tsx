import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Popover } from '../lib/ui/Popover';

describe('Popover', () => {
  it('renders trigger element', () => {
    render(() => (
      <Popover trigger={<button type="button">Click me</button>}>Popover content</Popover>
    ));
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows content on click', async () => {
    render(() => (
      <Popover trigger={<button type="button">Click me</button>}>Popover content</Popover>
    ));

    const trigger = screen.getByText('Click me');
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();

    fireEvent.click(trigger.parentElement!);

    const content = await screen.findByText('Popover content');
    expect(content).toBeInTheDocument();
  });

  it('supports diagonal alignment', async () => {
    render(() => (
      <Popover trigger={<button type="button">Click me</button>} align="top-left">
        Popover content
      </Popover>
    ));

    const trigger = screen.getByText('Click me');
    fireEvent.click(trigger.parentElement!);

    const content = await screen.findByText('Popover content');
    expect(content).toBeInTheDocument();
  });
});
