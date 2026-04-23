import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Alert, AlertDescription, AlertTitle } from '../lib/ui/Alert';

describe('Alert', () => {
  it('renders correctly with title and description', () => {
    render(() => (
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Content</AlertDescription>
      </Alert>
    ));

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(() => (
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
      </Alert>
    ));
    const alert = container.firstChild as HTMLElement;

    expect(alert).toHaveClass('bg-amber-50');
  });

  it('renders different icons based on variant', () => {
    const { container: infoContainer } = render(() => (
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
      </Alert>
    ));
    const { container: errorContainer } = render(() => (
      <Alert variant="error">
        <AlertTitle>Error</AlertTitle>
      </Alert>
    ));

    expect(infoContainer.querySelector('svg')).toBeInTheDocument();
    expect(errorContainer.querySelector('svg')).toBeInTheDocument();
  });
});
