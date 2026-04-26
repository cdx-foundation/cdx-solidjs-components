import { createSignal } from 'solid-js';
import { Code } from '../../../lib/ui/Code';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../lib/ui/Table';
import { Badge } from '../../../lib/ui/Badge';
import { Calendar } from '../../../lib/ui/Calendar';
import { DatePicker } from '../../../lib/ui/DatePicker';
import { Card } from '../../../lib/ui/Card';
import { Label } from '../../../lib/ui/Label';
import { Switch } from '../../../lib/ui/Switch';
import { Preview } from './Preview';

export const DataSection = () => {
  const [date, setDate] = createSignal<Date>(new Date());
  const [calendarShowTime, setCalendarShowTime] = createSignal(true);

  return (
    <section class="space-y-12">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">Data Display</h1>
        <p class="text-lg text-muted">Structured layout for complex information.</p>
      </div>

      <Preview
        title="Code Block"
        description="A professional code container with copy action."
        code={`import { Code } from 'starling-components/ui/Code';\n\n<Code \n  fileName="lib/ui/Code.tsx" \n  language="typescript"\n  code="export const Code = () => { ... }"\n/>`}
      >
        <div class="w-full max-w-md">
          <Code
            fileName="lib/ui/Code.tsx"
            language="typescript"
            code={
              'export const Code = (props: CodeProps) => {\n  const [copied, setCopied] = createSignal(false);\n  // ... implementation details\n};'
            }
          />
        </div>
      </Preview>

      <Preview
        title="Interactive Table"
        description="Data-dense tabular layouts."
        code={`import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from 'starling-components/ui/Table';\nimport { Badge } from 'starling-components/ui/Badge';\n\n<Table>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Instance</TableHead>\n      <TableHead>Status</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n       <TableCell>US-EAST-1</TableCell>\n       <TableCell><Badge>Healthy</Badge></TableCell>\n    </TableRow>\n  </TableBody>\n</Table>`}
      >
        <div class="w-full border border-stroke rounded-xl overflow-hidden bg-bg">
          <Table>
            <TableHeader class="bg-surface">
              <TableRow>
                <TableHead>Instance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell class="font-mono text-xs">US-EAST-1</TableCell>
                <TableCell>
                  <Badge class="bg-green-500/10 text-green-500 border-none">Healthy</Badge>
                </TableCell>
                <TableCell class="text-right font-mono text-xs text-muted">12ms</TableCell>
              </TableRow>
              <TableRow class="border-none">
                <TableCell class="font-mono text-xs">EU-WEST-1</TableCell>
                <TableCell>
                  <Badge
                    variant="destructive"
                    class="bg-red-500/10 text-red-500 border-none"
                  >
                    Degraded
                  </Badge>
                </TableCell>
                <TableCell class="text-right font-mono text-xs text-muted">145ms</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Preview>

      <Preview
        title="Calendar"
        description="Single, range, and multiple date selection. Now with optional time picker."
        code={`import { Calendar } from 'starling-components/ui/Calendar';\n\nconst [date, setDate] = createSignal(new Date());\n\n<Calendar \n  mode="single" \n  selected={date()} \n  onValueChange={setDate} \n  showTime\n/>`}
      >
        <div class="flex flex-col items-center gap-6 w-full max-w-sm transition-all duration-400">
          <div class="flex items-center justify-between w-full px-2 py-1 bg-surface rounded-lg border border-stroke">
            <Label class="text-xs font-bold uppercase tracking-wider text-muted">
              Enable Time Picker
            </Label>
            <Switch checked={calendarShowTime()} onCheckedChange={setCalendarShowTime} />
          </div>
          <Card class="bg-panel w-full transition-all duration-400 overflow-hidden">
            <Calendar
              mode="single"
              selected={date()}
              onValueChange={setDate}
              showTime={calendarShowTime()}
              class="border-none p-6"
            />
          </Card>
        </div>
      </Preview>

      <Preview
        title="Date & Time Picker"
        description="A popover-based picker for dates and times."
        code={`import { DatePicker } from 'starling-components/ui/DatePicker';\n\n<DatePicker\n  label="Schedule Maintenance"\n  value={date()}\n  onValueChange={setDate}\n  showTime\n/>`}
      >
        <div class="w-full max-w-xs">
          <DatePicker
            label="Schedule Maintenance"
            value={date()}
            onValueChange={setDate}
            showTime
            placeholder="Select date and time"
          />
        </div>
      </Preview>
    </section>
  );
};
