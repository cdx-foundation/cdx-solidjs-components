import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { DatePicker } from '../lib/ui/DatePicker';

describe('DatePicker', () => {
  it('renders with placeholder', () => {
    render(() => <DatePicker placeholder="Select a date" />);
    expect(screen.getByText('Select a date')).toBeInTheDocument();
  });

  it('opens on click', async () => {
    const date = new Date(2023, 0, 1);
    render(() => <DatePicker value={date} />);
    const picker = screen.getByRole('button');

    fireEvent.click(picker);
    expect(screen.getByText('January 2023')).toBeInTheDocument();
  });

  it('opens on Enter key', async () => {
    const date = new Date(2023, 0, 1);
    render(() => <DatePicker value={date} />);
    const picker = screen.getByRole('button');

    picker.focus();
    fireEvent.keyDown(picker, { key: 'Enter' });

    expect(await screen.findByText('January 2023')).toBeInTheDocument();
  });
});
