import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Pagination } from '../lib/ui/Pagination';

describe('Pagination', () => {
  it('renders page buttons based on totalPages', () => {
    render(() => <Pagination currentPage={1} totalPages={5} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(() => <Pagination currentPage={3} totalPages={5} />);

    const pageButton = screen.getByText('3');
    expect(pageButton).toHaveClass('font-bold');
  });

  it('calls onPageChange when a page button is clicked', () => {
    const onPageChange = vi.fn();
    render(() => <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText('3'));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page', () => {
    const { container } = render(() => <Pagination currentPage={1} totalPages={5} />);

    const buttons = container.querySelectorAll('nav button');
    const prevButton = buttons[0];
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    const { container } = render(() => <Pagination currentPage={5} totalPages={5} />);

    const buttons = container.querySelectorAll('nav button');
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange with next page', () => {
    const onPageChange = vi.fn();
    const { container } = render(() => (
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    ));

    const buttons = container.querySelectorAll('nav button');
    const nextButton = buttons[buttons.length - 1];
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with previous page', () => {
    const onPageChange = vi.fn();
    const { container } = render(() => (
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    ));

    const buttons = container.querySelectorAll('nav button');
    const prevButton = buttons[0];
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('shows ellipsis for large page counts when current page is in middle', () => {
    render(() => <Pagination currentPage={10} totalPages={20} />);

    // Should show: 1 ... 9 10 11 ... 20
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    // There should be 2 ellipsis indicators
    const ellipsisGroups = document.querySelectorAll('.text-muted');
    expect(ellipsisGroups.length).toBeGreaterThanOrEqual(2);
  });
});
