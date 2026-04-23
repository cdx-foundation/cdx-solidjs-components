import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from '../lib/ui/Textarea';

describe('Textarea', () => {
  it('renders with a label', () => {
    render(() => <Textarea label="Message" />);
    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const onInput = vi.fn();
    render(() => <Textarea onInput={onInput} placeholder="Enter text" />);

    const textarea = screen.getByPlaceholderText('Enter text');
    fireEvent.input(textarea, { target: { value: 'Hello' } });

    expect(onInput).toHaveBeenCalled();
    expect((textarea as HTMLTextAreaElement).value).toBe('Hello');
  });

  it('displays error state', () => {
    render(() => <Textarea label="Bio" error="Too short" />);

    expect(screen.getByText('Too short')).toBeInTheDocument();
    const textarea = screen.getByLabelText('Bio');
    expect(textarea).toHaveClass('border-primary');
  });

  it('is disabled when the disabled prop is true', () => {
    render(() => <Textarea disabled placeholder="No typing" />);
    const textarea = screen.getByPlaceholderText('No typing');
    expect(textarea).toBeDisabled();
  });
});
