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

  it('validates with regex', () => {
    const onRegexMismatch = vi.fn();
    render(() => <Input regex={/^\d*$/} onRegexMismatch={onRegexMismatch} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'abc' } });
    expect(onRegexMismatch).toHaveBeenCalledWith('abc');
  });

  it('prevents invalid input with preventInvalidRegex', () => {
    render(() => <Input regex={/^\d*$/} preventInvalidRegex />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Set an initial valid value so lastValidValue is updated
    fireEvent.input(input, { target: { value: '123' } });
    expect(input.value).toBe('123');

    // Try invalid value
    fireEvent.input(input, { target: { value: '123a' } });
    expect(input.value).toBe('123');
  });

  it('handles type="number" with increment/decrement', () => {
    const onChange = vi.fn();
    render(() => <Input type="number" value={10} onChange={onChange} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    // Increment
    fireEvent.click(buttons[1]);
    expect(onChange).toHaveBeenCalledWith(11);

    // Decrement
    fireEvent.click(buttons[0]);
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('blocks typing values exceeding max', () => {
    const onChange = vi.fn();
    render(() => <Input type="number" max={99} onChange={onChange} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    // Type a valid value first
    fireEvent.input(input, { target: { value: '9' } });
    expect(input.value).toBe('9');

    // Try to type something that makes it 999 (exceeding 99)
    fireEvent.input(input, { target: { value: '999' } });
    expect(input.value).toBe('9'); // Should stay at 9 because 999 > 99
  });
});
