import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Card } from '../ui/Card';

describe('Card', () => {
  it('renders correctly with children', () => {
    render(() => (
      <Card>
        <div data-testid="child">Card Content</div>
      </Card>
    ));

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default and custom classes', () => {
    const { container } = render(() => <Card class="custom-card">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('clean-panel');
    expect(card).toHaveClass('custom-card');
    expect(card).toHaveClass('p-5');
  });
});
