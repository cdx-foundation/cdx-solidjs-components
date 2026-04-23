import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Alert } from '../ui/Alert';

describe('Alert', () => {
  it('renders correctly with title and children', () => {
    render(() => <Alert title="Test Title">Test Content</Alert>);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(() => <Alert title="Warning" variant="warning" />);
    const alert = container.firstChild as HTMLElement;

    // Check for some warning-specific classes or presence
    expect(alert).toHaveClass('bg-amber-50');
  });

  it('renders different icons based on variant', () => {
    const { container: infoContainer } = render(() => <Alert title="Info" variant="info" />);
    const { container: errorContainer } = render(() => <Alert title="Error" variant="error" />);

    // Icons are SVGs, we can check if they exist
    expect(infoContainer.querySelector('svg')).toBeInTheDocument();
    expect(errorContainer.querySelector('svg')).toBeInTheDocument();
  });
});
