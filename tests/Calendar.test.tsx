import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vite-plus/test';
import { Calendar } from '../lib/ui/Calendar';

describe('Calendar', () => {
  it('renders correctly', () => {
    const date = new Date(2023, 0, 1); // Jan 1, 2023
    render(() => <Calendar initialFocus={date} />);
    expect(screen.getByText('January 2023')).toBeInTheDocument();
  });

  it('handles date selection', () => {
    const onChange = vi.fn();
    const date = new Date(2023, 0, 1);
    render(() => <Calendar initialFocus={date} onChange={onChange} />);

    const dayButton = screen.getByLabelText('January 1, 2023');
    fireEvent.click(dayButton);

    expect(onChange).toHaveBeenCalled();
    const selectedDate = onChange.mock.calls[0][0];
    expect(selectedDate.getFullYear()).toBe(2023);
    expect(selectedDate.getMonth()).toBe(0);
    expect(selectedDate.getDate()).toBe(1);
  });

  it('shows time picker when showTime is true', () => {
    const date = new Date(2023, 0, 1, 12, 30);
    render(() => <Calendar initialFocus={date} selected={date} showTime />);

    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();

    expect(screen.getByDisplayValue('12')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('updates time when buttons are clicked', () => {
    const onChange = vi.fn();
    const date = new Date(2023, 0, 1, 12, 30);
    render(() => <Calendar initialFocus={date} selected={date} showTime onChange={onChange} />);

    const buttons = screen.getAllByRole('button');
    const incrementHourBtn = buttons[buttons.length - 4];
    fireEvent.click(incrementHourBtn);

    expect(onChange).toHaveBeenCalled();
    const updatedDate = onChange.mock.calls[0][0];
    expect(updatedDate.getHours()).toBe(13);
  });

  it('updates time when typing in inputs', () => {
    const onChange = vi.fn();
    const date = new Date(2023, 0, 1, 12, 30);
    render(() => <Calendar initialFocus={date} selected={date} showTime onChange={onChange} />);

    const hourInput = screen.getByDisplayValue('12') as HTMLInputElement;
    fireEvent.input(hourInput, { target: { value: '15' } });

    expect(onChange).toHaveBeenCalled();
    const updatedDate = onChange.mock.calls[0][0];
    expect(updatedDate.getHours()).toBe(15);
  });
});
