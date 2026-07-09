import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Carousel } from '../lib/ui/Carousel';

describe('Carousel', () => {
  it('renders all items', () => {
    render(() => (
      <Carousel items={[<span>Slide 1</span>, <span>Slide 2</span>, <span>Slide 3</span>]} />
    ));

    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('renders navigation buttons with aria-labels', () => {
    render(() => <Carousel items={[<span>Slide 1</span>, <span>Slide 2</span>]} />);

    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0]).toHaveAttribute('aria-label', 'Previous slide');
    expect(buttons[1]).toHaveAttribute('aria-label', 'Next slide');
  });

  it('disables previous button at the start', () => {
    render(() => <Carousel items={[<span>Slide 1</span>, <span>Slide 2</span>]} />);

    const buttons = document.querySelectorAll('button');
    const prevBtn = buttons[0];
    expect(prevBtn).toHaveAttribute('aria-label', 'Previous slide');
    expect(prevBtn).toBeDisabled();
  });

  it('renders with custom class on the container', () => {
    const { container } = render(() => (
      <Carousel items={[<span>Slide 1</span>]} class="custom-carousel" />
    ));

    expect(container.firstChild).toHaveClass('custom-carousel');
  });

  it('renders items with snap scrolling container', () => {
    const { container } = render(() => (
      <Carousel items={[<span>Slide 1</span>, <span>Slide 2</span>]} />
    ));

    const scrollContainer = container.querySelector('.snap-x');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('snap-mandatory');
  });
});
