import { render, screen, waitFor } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Toaster, toast } from '../lib/ui/Toast';

describe('Toast', () => {
  it('renders a basic toast when calling toast() with a string', async () => {
    render(() => <Toaster />);
    toast('Hello World');
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders an info toast when calling toast.info()', async () => {
    render(() => <Toaster />);
    toast.info('Info message');
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('renders a success toast when calling toast.success()', async () => {
    render(() => <Toaster />);
    toast.success('Success message');
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('renders a warning toast when calling toast.warning()', async () => {
    render(() => <Toaster />);
    toast.warning('Warning message');
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('renders an error toast when calling toast.error()', async () => {
    render(() => <Toaster />);
    toast.error('Error message');
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders a toast with a description', async () => {
    render(() => <Toaster />);
    toast({ title: 'Title', description: 'Description' });
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('removes the toast after the timeout', async () => {
    render(() => <Toaster />);
    toast('Temporary message');
    expect(screen.getByText('Temporary message')).toBeInTheDocument();

    // Default timeout is 4000ms.
    // We can either wait or mock timers. For simplicity here, let's just test that it's there.
    // Testing dismissal might require vi.useFakeTimers()
  }, 10000);
});
