import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Menubar, MenubarItem, MenubarMenu, MenubarSeparator } from '../lib/ui/Menubar';

describe('Menubar', () => {
  it('renders menubar with trigger labels', () => {
    render(() => (
      <Menubar>
        <MenubarMenu trigger="File">
          <MenubarItem>New File</MenubarItem>
        </MenubarMenu>
        <MenubarMenu trigger="Edit">
          <MenubarItem>Undo</MenubarItem>
        </MenubarMenu>
      </Menubar>
    ));

    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('shows dropdown content when trigger is clicked', () => {
    render(() => (
      <Menubar>
        <MenubarMenu trigger="File">
          <MenubarItem>New File</MenubarItem>
        </MenubarMenu>
      </Menubar>
    ));

    expect(screen.queryByText('New File')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('File'));

    expect(screen.getByText('New File')).toBeInTheDocument();
  });

  it('hides dropdown when an item is clicked', () => {
    render(() => (
      <Menubar>
        <MenubarMenu trigger="File">
          <MenubarItem>New File</MenubarItem>
        </MenubarMenu>
      </Menubar>
    ));

    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New File')).toBeInTheDocument();

    fireEvent.click(screen.getByText('New File'));

    expect(screen.queryByText('New File')).not.toBeInTheDocument();
  });

  it('renders multiple items in a menu', () => {
    render(() => (
      <Menubar>
        <MenubarMenu trigger="File">
          <MenubarItem>New File</MenubarItem>
          <MenubarItem>Open...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Save</MenubarItem>
        </MenubarMenu>
      </Menubar>
    ));

    fireEvent.click(screen.getByText('File'));

    expect(screen.getByText('New File')).toBeInTheDocument();
    expect(screen.getByText('Open...')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders separator as an hr element', () => {
    const { container } = render(() => (
      <Menubar>
        <MenubarMenu trigger="File">
          <MenubarItem>New File</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Save</MenubarItem>
        </MenubarMenu>
      </Menubar>
    ));

    fireEvent.click(screen.getByText('File'));

    const separator = container.querySelector('.h-px');
    expect(separator).toBeInTheDocument();
  });
});
