import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../lib/ui/Button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../lib/ui/Sheet';

describe('Sheet', () => {
  it('renders correctly with composable pattern when isOpen is true', () => {
    render(() => (
      <Sheet isOpen={true} onClose={() => {}}>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet Description</SheetDescription>
        </SheetHeader>
        <SheetContent>
          <p>Sheet Content</p>
        </SheetContent>
        <SheetFooter>
          <Button>Save</Button>
        </SheetFooter>
      </Sheet>
    ));

    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    expect(screen.getByText('Sheet Description')).toBeInTheDocument();
    expect(screen.getByText('Sheet Content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(() => (
      <Sheet isOpen={false} onClose={() => {}}>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetHeader>
      </Sheet>
    ));

    expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    const onClose = vi.fn();
    render(() => (
      <Sheet isOpen={true} onClose={onClose}>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetHeader>
      </Sheet>
    ));

    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
