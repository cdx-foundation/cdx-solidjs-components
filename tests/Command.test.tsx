import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vite-plus/test';
import { Command, CommandGroup, CommandItem } from '../lib/ui/Command';

// Polyfill scrollIntoView for jsdom (used by Command's active-item scroll effect)
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

describe('Command', () => {
  it('renders when isOpen is true', () => {
    render(() => (
      <Command isOpen={true} onClose={() => {}}>
        <CommandItem value="test">Test Item</CommandItem>
      </Command>
    ));

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type a command or search...')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(() => (
      <Command isOpen={false} onClose={() => {}}>
        <CommandItem value="test">Test Item</CommandItem>
      </Command>
    ));

    expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
  });

  it('closes when clicking the backdrop', () => {
    const onClose = vi.fn();
    render(() => (
      <Command isOpen={true} onClose={onClose}>
        <CommandItem value="test">Test Item</CommandItem>
      </Command>
    ));

    // The backdrop has the bg-black/40 class
    const backdrop = document.querySelector('[class*="bg-black"]') as HTMLElement;
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('filters items based on search input', () => {
    render(() => (
      <Command isOpen={true} onClose={() => {}}>
        <CommandItem value="settings">Settings</CommandItem>
        <CommandItem value="profile">Profile</CommandItem>
      </Command>
    ));

    const input = screen.getByPlaceholderText('Type a command or search...');
    fireEvent.input(input, { target: { value: 'sett' } });

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('calls onClose when pressing Escape', () => {
    const onClose = vi.fn();
    render(() => (
      <Command isOpen={true} onClose={onClose}>
        <CommandItem value="test">Test Item</CommandItem>
      </Command>
    ));

    const wrapper = document.querySelector('.fixed.inset-0.z-100') as HTMLElement;
    fireEvent.keyDown(wrapper!, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders CommandGroup with heading', () => {
    render(() => (
      <Command isOpen={true} onClose={() => {}}>
        <CommandGroup heading="Actions">
          <CommandItem value="test">Test Item</CommandItem>
        </CommandGroup>
      </Command>
    ));

    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('calls item onClick when item is clicked', () => {
    const onClick = vi.fn();
    render(() => (
      <Command isOpen={true} onClose={() => {}}>
        <CommandItem value="test" onClick={onClick}>
          Clickable Item
        </CommandItem>
      </Command>
    ));

    fireEvent.click(screen.getByText('Clickable Item'));
    expect(onClick).toHaveBeenCalled();
  });

  it('supports keyboard navigation with arrow keys', () => {
    render(() => (
      <Command isOpen={true} onClose={() => {}}>
        <CommandItem value="first">First</CommandItem>
        <CommandItem value="second">Second</CommandItem>
      </Command>
    ));

    const wrapper = document.querySelector('.fixed.inset-0.z-100') as HTMLElement;

    // Press ArrowDown to move to the next item
    fireEvent.keyDown(wrapper!, { key: 'ArrowDown' });

    const activeItems = document.querySelectorAll('[data-active="true"]');
    expect(activeItems.length).toBe(1);
    expect(activeItems[0]).toHaveTextContent('Second');
  });
});
