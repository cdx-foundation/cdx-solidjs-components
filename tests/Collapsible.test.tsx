import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Collapsible } from '../lib/ui/Collapsible';

describe('Collapsible', () => {
  it('is collapsed by default', () => {
    render(() => (
      <Collapsible trigger={<button type="button">Toggle</button>}>
        <div data-testid="content">Hidden Content</div>
      </Collapsible>
    ));

    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('expands when trigger is clicked', () => {
    render(() => (
      <Collapsible trigger={<button type="button">Toggle</button>}>
        <div data-testid="content">Visible Content</div>
      </Collapsible>
    ));

    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('can be open by default', () => {
    render(() => (
      <Collapsible trigger={<button type="button">Toggle</button>} defaultOpen={true}>
        <div data-testid="content">Open Content</div>
      </Collapsible>
    ));

    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('collapses when trigger is clicked while open', () => {
    render(() => (
      <Collapsible trigger={<button type="button">Toggle</button>} defaultOpen={true}>
        <div data-testid="content">Content</div>
      </Collapsible>
    ));

    expect(screen.getByTestId('content')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });
});
