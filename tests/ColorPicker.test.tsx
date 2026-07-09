import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vite-plus/test';
import { ColorPicker } from '../lib/ui/ColorPicker';

describe('ColorPicker', () => {
  it('renders with label and color label', () => {
    render(() => <ColorPicker label="Accent Color" value="#4f46e5" />);

    expect(screen.getByText('Accent Color')).toBeInTheDocument();
    expect(screen.getByText('Indigo')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', () => {
    render(() => <ColorPicker label="Color" value="#c62828" />);

    fireEvent.click(screen.getByText('Crimson'));

    expect(screen.getByTitle('Crimson')).toBeInTheDocument();
    expect(screen.getByTitle('Rose')).toBeInTheDocument();
  });

  it('calls onChange when a preset color is selected', () => {
    const onChange = vi.fn();
    render(() => <ColorPicker label="Color" value="#c62828" onChange={onChange} />);

    fireEvent.click(screen.getByText('Crimson'));
    fireEvent.click(screen.getByTitle('Rose'));

    expect(onChange).toHaveBeenCalledWith('#e11d48');
  });

  it('renders hex input field in the dropdown', () => {
    render(() => <ColorPicker label="Color" value="#4f46e5" />);

    fireEvent.click(screen.getByText('Indigo'));

    const hexInput = document.querySelector('input[type="text"]');
    expect(hexInput).toBeInTheDocument();
    expect(hexInput).toHaveValue('#4f46e5');
  });

  it('renders custom presets and shows hex fallback label', () => {
    const presets = [
      { label: 'Custom Red', value: '#ff0000' },
      { label: 'Custom Blue', value: '#0000ff' },
    ];
    render(() => <ColorPicker label="Custom Picker" value="#ff0000" presets={presets} />);

    // Custom preset value hex is displayed as uppercase fallback
    expect(screen.getByText('#FF0000')).toBeInTheDocument();
  });
});
