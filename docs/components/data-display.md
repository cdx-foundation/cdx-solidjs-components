# Data Display Components

Components for presenting information, status, and tabular data with technical precision.

## Badge

A compact element for highlighting a status, category, or count.

```tsx
import { Badge } from 'starling-components/ui/Badge';

<Badge variant="success">Online</Badge>
<Badge variant="destructive">Critical</Badge>
<Badge variant="outline">v1.0.4</Badge>
```

### Variants
- `default`: Subtle gray.
- `primary`: High-visibility theme color.
- `success`: Green (positive).
- `warning`: Amber (caution).
- `error` / `destructive`: Red (negative).
- `outline`: Transparent with border.

---

## Table

A semantic and responsive system for displaying tabular data.

```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from 'starling-components/ui/Table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Server</TableHead>
      <TableHead>Uptime</TableHead>
      <TableHead class="text-right">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell class="font-mono text-xs">US-EAST-1</TableCell>
      <TableCell class="text-sm">99.9%</TableCell>
      <TableCell class="text-right"><Badge variant="success">Healthy</Badge></TableCell>
    </TableRow>
    <TableRow>
      <TableCell class="font-mono text-xs">EU-WEST-1</TableCell>
      <TableCell class="text-sm">98.2%</TableCell>
      <TableCell class="text-right"><Badge variant="warning">Degraded</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Avatar

A visual representation of a user with smart fallback for missing images.

```tsx
import { Avatar, AvatarImage, AvatarFallback } from 'starling-components/ui/Avatar';

<Avatar>
  <AvatarImage src="https://github.com/nutlope.png" alt="Yanis" />
  <AvatarFallback>YA</AvatarFallback>
</Avatar>
```

---

## Kbd (Keyboard Key)

A semantic element for displaying keyboard shortcuts.

```tsx
import { Kbd } from 'starling-components/ui/Kbd';

<div class="flex gap-1">
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</div>
```

---

## Calendar

A grid-based date selection component supporting single, multiple, and range modes.

```tsx
import { Calendar } from 'starling-components/ui/Calendar';

{/* Single Date */}
<Calendar mode="single" selected={date()} onSelect={setDate} />

{/* Date Range */}
<Calendar mode="range" selected={range()} onSelect={setRange} />
```

### Props
- `mode`: `"single" | "multiple" | "range"`.
- `selected`: Current selection value.
- `onSelect`: Change handler.
- `disabled`: Function `(date: Date) => boolean` to gray out dates.
