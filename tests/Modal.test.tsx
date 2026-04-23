import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from '../ui/Modal';

describe('Modal', () => {
  it('renders when isOpen is true', () => {
    render(() => (
      <Modal isOpen={true} title="Modal Title" onClose={() => {}}>
        <p>Modal Content</p>
      </Modal>
    ));

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(() => (
      <Modal isOpen={false} title="Modal Title" onClose={() => {}}>
        <p>Modal Content</p>
      </Modal>
    ));

    expect(screen.queryByText('Modal Title')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    const onClose = vi.fn();
    render(() => (
      <Modal isOpen={true} title="Modal Title" onClose={onClose}>
        <p>Content</p>
      </Modal>
    ));

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape key press', () => {
    const onClose = vi.fn();
    render(() => (
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    ));

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
