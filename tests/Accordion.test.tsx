import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionItem } from '../ui/Accordion';

describe('Accordion', () => {
  it('expands and collapses items', () => {
    render(() => (
      <Accordion>
        <AccordionItem title="Section 1">Content 1</AccordionItem>
        <AccordionItem title="Section 2">Content 2</AccordionItem>
      </Accordion>
    ));

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Section 1'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Section 1'));
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(() => (
      <Accordion>
        <AccordionItem title="Section 1">Content 1</AccordionItem>
      </Accordion>
    ));

    const trigger = screen.getByText('Section 1').closest('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger!);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
