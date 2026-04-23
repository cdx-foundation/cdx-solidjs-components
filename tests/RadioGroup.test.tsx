import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Label } from '../lib/ui/Label';
import { RadioGroup, RadioGroupItem } from '../lib/ui/RadioGroup';

describe('RadioGroup', () => {
  it('renders correctly using composable pattern', () => {
    const onChange = vi.fn();
    render(() => (
      <RadioGroup name="test" value="1" onChange={onChange}>
        <div class="flex items-center gap-2">
          <RadioGroupItem value="1" id="r1" />
          <Label for="r1">Option 1</Label>
        </div>
        <div class="flex items-center gap-2">
          <RadioGroupItem value="2" id="r2" />
          <Label for="r2">Option 2</Label>
        </div>
      </RadioGroup>
    ));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();

    const radio1 = screen.getByDisplayValue('1') as HTMLInputElement;
    const radio2 = screen.getByDisplayValue('2') as HTMLInputElement;

    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);

    fireEvent.click(radio2);
    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('renders using shorthand pattern', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ];
    render(() => (
      <RadioGroup name="test-shorthand" options={options} value="opt1" onChange={() => {}} />
    ));

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});
