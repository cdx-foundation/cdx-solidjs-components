import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../lib/ui/Card';

describe('Card', () => {
  it('renders correctly with composable pattern', () => {
    render(() => (
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    ));

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies default and custom classes', () => {
    const { container } = render(() => <Card class="custom-card">Content</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('clean-panel');
    expect(card).toHaveClass('custom-card');
    expect(card).toHaveClass('p-5');
  });
});
