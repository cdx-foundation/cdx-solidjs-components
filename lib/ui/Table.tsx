import { type JSX, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';

/**
 * ### Table Component
 *
 * A semantic and responsive wrapper for tabular data.
 * Automatically handles horizontal scrolling on small screens to prevent layout breakage.
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Invoice</TableHead>
 *       <TableHead>Status</TableHead>
 *       <TableHead>Amount</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>INV001</TableCell>
 *       <TableCell>Paid</TableCell>
 *       <TableCell>$250.00</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
export const Table = (props: JSX.HTMLAttributes<HTMLTableElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <div class="w-full overflow-auto">
      <table class={twMerge('w-full caption-bottom text-sm', local.class)} {...others} />
    </div>
  );
};

/**
 * The standard header section (`thead`) for the table.
 * Applies a consistent bottom border to the header row.
 */
export const TableHeader = (props: JSX.HTMLAttributes<HTMLTableSectionElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return <thead class={twMerge('[&_tr]:border-b border-stroke', local.class)} {...others} />;
};

/**
 * The standard body section (`tbody`) for the table.
 * Automatically removes the bottom border from the final row for a cleaner finish.
 */
export const TableBody = (props: JSX.HTMLAttributes<HTMLTableSectionElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return <tbody class={twMerge('[&_tr:last-child]:border-0', local.class)} {...others} />;
};

/**
 * A interactive row (`tr`) that supports hover states and selection highlighting.
 */
export const TableRow = (props: JSX.HTMLAttributes<HTMLTableRowElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <tr
      class={twMerge(
        'border-b border-stroke transition-colors hover:bg-surface/50 data-[state=selected]:bg-surface',
        local.class,
      )}
      {...others}
    />
  );
};

/**
 * A specialized header cell (`th`) with distinct typography and alignment.
 */
export const TableHead = (props: JSX.ThHTMLAttributes<HTMLTableCellElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <th
      class={twMerge(
        'h-10 px-3 text-left align-middle font-semibold text-muted [&:has([role=checkbox])]:pr-0',
        local.class,
      )}
      {...others}
    />
  );
};

/**
 * A standard data cell (`td`) using a monospace font for better data legibility.
 */
export const TableCell = (props: JSX.TdHTMLAttributes<HTMLTableCellElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <td
      class={twMerge('p-3 align-middle [&:has([role=checkbox])]:pr-0 font-mono', local.class)}
      {...others}
    />
  );
};
