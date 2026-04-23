import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../lib/ui/Button';
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '../lib/ui/Modal';

describe('Modal', () => {
  it('renders correctly with composable pattern when isOpen is true', () => {
    render(() => (
      <Modal isOpen={true} onClose={() => {}}>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalDescription>Modal Description</ModalDescription>
        </ModalHeader>
        <p>Modal Content</p>
        <ModalFooter>
          <Button>Close</Button>
        </ModalFooter>
      </Modal>
    ));

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal Description')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(() => (
      <Modal isOpen={false} onClose={() => {}}>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
        </ModalHeader>
      </Modal>
    ));

    expect(screen.queryByText('Modal Title')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    const onClose = vi.fn();
    render(() => (
      <Modal isOpen={true} onClose={onClose}>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
        </ModalHeader>
      </Modal>
    ));

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
