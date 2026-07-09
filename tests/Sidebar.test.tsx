import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { Sidebar } from '../lib/ui/Sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders sidebar with navigation items', () => {
    render(() => (
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>Home</Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton isActive>Settings</Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>
    ));

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('applies active state to menu button', () => {
    render(() => (
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton isActive>Active Item</Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>
    ));

    const activeBtn = document.querySelector('[data-active="true"]');
    expect(activeBtn).toBeInTheDocument();
    expect(activeBtn).toHaveTextContent('Active Item');
  });

  it('renders sidebar trigger with aria-label', () => {
    render(() => (
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Trigger />
        </Sidebar.Root>
      </Sidebar.Provider>
    ));

    expect(screen.getByLabelText('Toggle Sidebar')).toBeInTheDocument();
  });

  it('toggles sidebar between expanded and collapsed states', () => {
    render(() => (
      <Sidebar.Provider>
        <Sidebar.Root collapsible="icon">
          <Sidebar.Trigger />
          <Sidebar.Content>Content</Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>
    ));

    const aside = document.querySelector('[data-sidebar]');
    expect(aside).toHaveAttribute('data-state', 'expanded');

    fireEvent.click(screen.getByLabelText('Toggle Sidebar'));
    expect(aside).toHaveAttribute('data-state', 'collapsed');
  });

  it('renders collapsed sidebar with correct data attributes', () => {
    render(() => (
      <Sidebar.Provider defaultOpen={false}>
        <Sidebar.Root collapsible="icon">
          <Sidebar.Content>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>Collapsed Item</Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Content>
        </Sidebar.Root>
      </Sidebar.Provider>
    ));

    const aside = document.querySelector('[data-sidebar]');
    expect(aside).toHaveAttribute('data-state', 'collapsed');
    expect(aside).toHaveAttribute('data-sidebar');
  });

  it('renders header, content, and footer sections', () => {
    render(() => (
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header>Header</Sidebar.Header>
          <Sidebar.Content>Body</Sidebar.Content>
          <Sidebar.Footer>Footer</Sidebar.Footer>
        </Sidebar.Root>
      </Sidebar.Provider>
    ));

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders sidebar rail with aria-label', () => {
    render(() => (
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Rail />
        </Sidebar.Root>
      </Sidebar.Provider>
    ));

    expect(screen.getByLabelText('Toggle Sidebar')).toBeInTheDocument();
  });
});
