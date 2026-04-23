import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Breadcrumb } from '../ui/Breadcrumb';

describe('Breadcrumb', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Current' },
  ];

  it('renders all items with correct labels', () => {
    render(() => <Breadcrumb items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    render(() => <Breadcrumb items={items} />);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');

    const projectsLink = screen.getByRole('link', { name: 'Projects' });
    expect(projectsLink).toHaveAttribute('href', '/projects');
  });

  it('renders separators between items', () => {
    const { container } = render(() => <Breadcrumb items={items} />);
    const separators = container.querySelectorAll('span.text-muted\\/50');

    // items.length - 1 = 2 separators
    expect(separators.length).toBe(2);
    for (const sep of separators) {
      expect(sep.textContent).toBe('/');
    }
  });

  it('renders the last item (without href) as static text', () => {
    render(() => <Breadcrumb items={items} />);
    const current = screen.getByText('Current');

    expect(current.tagName).toBe('SPAN');
    expect(current).not.toHaveAttribute('href');
  });
});
