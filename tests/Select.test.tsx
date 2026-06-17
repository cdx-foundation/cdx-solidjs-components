import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vite-plus/test';
import { Select } from '../lib/ui/Select';

describe('Select', () => {
  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ];

  it('renders with placeholder and label', () => {
    render(() => <Select label="Select Option" placeholder="Choose..." options={options} />);
    expect(screen.getByText('Select Option')).toBeInTheDocument();
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('opens options on click', () => {
    render(() => <Select options={options} placeholder="Choose..." />);
    fireEvent.click(screen.getByText('Choose...'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onChange and closes when an option is selected', () => {
    const onChange = vi.fn();
    render(() => <Select options={options} placeholder="Choose..." onChange={onChange} />);

    fireEvent.click(screen.getByText('Choose...'));
    fireEvent.click(screen.getByText('Option 2'));

    expect(onChange).toHaveBeenCalledWith('opt2');
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    const onChange = vi.fn();
    render(() => <Select options={options} placeholder="Choose..." onChange={onChange} />);

    const trigger = screen.getByRole('combobox');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('opt2');
  });

  it('supports clearLabel to enable a clear option', () => {
    const onChange = vi.fn();
    render(() => (
      <Select
        options={options}
        placeholder="Choose..."
        onChange={onChange}
        clearLabel="Clear Selection"
      />
    ));

    fireEvent.click(screen.getByText('Choose...'));
    expect(screen.getByText('Clear Selection')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Clear Selection'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
