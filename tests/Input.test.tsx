import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../lib/ui/Input';

describe('Input', () => {
  it('renders with a label', () => {
    render(() => <Input label="Email" placeholder="Enter email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const onInput = vi.fn();
    render(() => <Input onInput={onInput} placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');
    fireEvent.input(input, { target: { value: 'hello' } });
    expect(onInput).toHaveBeenCalled();
  });

  it('displays an error message', () => {
    render(() => <Input error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('links label and input via id', () => {
    render(() => <Input label="Username" />);
    const label = screen.getByText('Username');
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for', input.id);
  });
});
