import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Floating } from '../lib/ui/Floating';

describe('Floating', () => {
  it('renders trigger element', () => {
    render(() => (
      <Floating>
        <Floating.Trigger>Open</Floating.Trigger>
        <Floating.Content isOpen={false}>Content</Floating.Content>
      </Floating>
    ));

    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('does not render content when isOpen is false', () => {
    render(() => (
      <Floating>
        <Floating.Trigger>Open</Floating.Trigger>
        <Floating.Content isOpen={false}>Content</Floating.Content>
      </Floating>
    ));

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders content when isOpen is true', () => {
    render(() => (
      <Floating>
        <Floating.Trigger>Open</Floating.Trigger>
        <Floating.Content isOpen={true}>Content</Floating.Content>
      </Floating>
    ));

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders content via Portal', () => {
    render(() => (
      <Floating>
        <Floating.Trigger>Open</Floating.Trigger>
        <Floating.Content isOpen={true}>Content</Floating.Content>
      </Floating>
    ));

    const content = screen.getByText('Content');
    expect(content).toBeInTheDocument();
    expect(content.parentElement).not.toHaveTextContent('Open');
  });

  it('applies custom class to content', () => {
    render(() => (
      <Floating>
        <Floating.Trigger>Open</Floating.Trigger>
        <Floating.Content isOpen={true} class="custom-class">
          Content
        </Floating.Content>
      </Floating>
    ));

    // Portal renders to document.body, not inside container
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
