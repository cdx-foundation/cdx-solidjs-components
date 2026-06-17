import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Progress } from '../lib/ui/Progress';

describe('Progress', () => {
  it('renders with correct ARIA attributes', () => {
    render(() => <Progress value={33} max={100} />);
    const progress = screen.getByRole('progressbar');

    expect(progress).toHaveAttribute('aria-valuenow', '33');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('calculates width correctly', () => {
    const { container } = render(() => <Progress value={50} max={200} />);
    const progress = container.firstElementChild as HTMLElement;
    const indicator = progress.firstElementChild as HTMLElement;

    expect(indicator.style.width).toBe('25%');
  });

  it('limits percentage between 0 and 100', () => {
    const { container: overContainer } = render(() => <Progress value={150} max={100} />);
    const overIndicator = (overContainer.firstElementChild as HTMLElement)
      .firstElementChild as HTMLElement;
    expect(overIndicator.style.width).toBe('100%');

    const { container: underContainer } = render(() => <Progress value={-50} max={100} />);
    const underIndicator = (underContainer.firstElementChild as HTMLElement)
      .firstElementChild as HTMLElement;
    expect(underIndicator.style.width).toBe('0%');
  });
});
