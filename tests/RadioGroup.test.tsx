import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from '../ui/RadioGroup';

describe('RadioGroup', () => {
  const options = [
    { value: 'opt1', label: 'Option 1', description: 'Desc 1' },
    { value: 'opt2', label: 'Option 2', description: 'Desc 2' },
  ];

  it('renders all options', () => {
    render(() => <RadioGroup name="test" options={options} value="opt1" onChange={() => {}} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onChange when an option is clicked', () => {
    const onChange = vi.fn();
    render(() => <RadioGroup name="test" options={options} value="opt1" onChange={onChange} />);

    fireEvent.click(screen.getByText('Option 2'));
    expect(onChange).toHaveBeenCalledWith('opt2');
  });

  it('highlights the selected option', () => {
    const { container } = render(() => (
      <RadioGroup name="test" options={options} value="opt1" onChange={() => {}} />
    ));

    const selectedLabel = screen.getByText('Option 1').closest('label');
    expect(selectedLabel).toHaveClass('border-primary');

    const unselectedLabel = screen.getByText('Option 2').closest('label');
    expect(unselectedLabel).not.toHaveClass('border-primary');
  });
});
