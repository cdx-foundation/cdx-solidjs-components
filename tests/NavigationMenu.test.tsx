import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '../lib/ui/NavigationMenu';

describe('NavigationMenu', () => {
  it('renders nav element with trigger labels', () => {
    render(() => (
      <NavigationMenu>
        <NavigationMenuItem trigger="Products">
          <NavigationMenuLink href="/product">Product</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem trigger="Company">
          <NavigationMenuLink href="/about">About</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    ));

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('has nav role', () => {
    render(() => (
      <NavigationMenu>
        <NavigationMenuItem trigger="Products">
          <NavigationMenuLink href="/product">Product</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    ));

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows dropdown content on mouse enter and hides on mouse leave', () => {
    vi.useFakeTimers();
    render(() => (
      <NavigationMenu>
        <NavigationMenuItem trigger="Products">
          <NavigationMenuLink href="/product">Product</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    ));

    const trigger = screen.getByText('Products');

    fireEvent.mouseEnter(trigger.parentElement!);

    expect(screen.getByText('Product')).toBeInTheDocument();

    fireEvent.mouseLeave(trigger.parentElement!);

    // Component has 200ms hide delay
    vi.advanceTimersByTime(300);

    expect(screen.queryByText('Product')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('renders links with correct href', () => {
    render(() => (
      <NavigationMenu>
        <NavigationMenuItem trigger="Products">
          <NavigationMenuLink href="/seeker">Seeker Explorer</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    ));

    fireEvent.mouseEnter(screen.getByText('Products').parentElement!);

    const link = screen.getByText('Seeker Explorer');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/seeker');
  });
});
