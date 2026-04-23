import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../lib/ui/Table';

describe('Table', () => {
  it('renders a complete table structure', () => {
    render(() => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Head 1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ));

    expect(screen.getByText('Head 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 1')).toBeInTheDocument();

    expect(screen.getByText('Head 1').tagName).toBe('TH');
    expect(screen.getByText('Cell 1').tagName).toBe('TD');
  });

  it('applies monospace font to cells', () => {
    render(() => (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ));

    expect(screen.getByText('Data')).toHaveClass('font-mono');
  });

  it('applies hover and transition classes to rows', () => {
    const { container } = render(() => (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Row</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ));

    const tr = container.querySelector('tr');
    expect(tr).toHaveClass('hover:bg-surface/50');
    expect(tr).toHaveClass('transition-colors');
  });
});
