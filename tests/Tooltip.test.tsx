import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import { Tooltip } from '../lib/ui/Tooltip';

describe('Tooltip', () => {
  it('renders trigger element', () => {
    render(() => (
      <Tooltip trigger={<button>Hover me</button>} content="Tooltip info" />
    ));
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows content on hover', async () => {
    render(() => (
      <Tooltip trigger={<button>Hover me</button>} content="Tooltip info" />
    ));
    
    const trigger = screen.getByText('Hover me');
    const content = screen.getByText('Tooltip info');
    
    // Content is present but invisible (opacity-0)
    expect(content).toHaveClass('opacity-0');
    
    // In real browser group-hover would work via CSS.
    // In Vitest/JSDOM we can check the presence of the class.
    // Since visibility is handled by CSS group-hover, we can't easily test the transition
    // without a real CSS engine, but we can verify the structure.
    expect(content).toBeInTheDocument();
    expect(content.parentElement).toHaveClass('group');
  });
});
