import { Code } from '../../../lib/ui/Code';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../lib/ui/Table';

export const ThemingSection = () => {
  return (
    <section class="space-y-8">
      <h1 class="text-4xl font-extrabold tracking-tight">Theming</h1>
      <p class="text-muted leading-relaxed max-w-2xl">
        Starling UI uses a CSS variable-based design system. You can override these variables in
        your global CSS to customize the entire library.
      </p>

      <div class="space-y-10">
        <div>
          <h2 class="text-xl font-bold mb-4">Core Colors</h2>
          <div class="border border-stroke rounded-xl overflow-hidden bg-bg">
            <Table>
              <TableHeader class="bg-surface">
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead class="text-right">Token</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell class="font-mono text-xs">--color-primary</TableCell>
                  <TableCell class="text-sm text-muted">Main accent/action color</TableCell>
                  <TableCell class="text-right font-mono text-xs">bg-primary</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="font-mono text-xs">--color-bg</TableCell>
                  <TableCell class="text-sm text-muted">Page background</TableCell>
                  <TableCell class="text-right font-mono text-xs">bg-bg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="font-mono text-xs">--color-panel</TableCell>
                  <TableCell class="text-sm text-muted">Card & floating backgrounds</TableCell>
                  <TableCell class="text-right font-mono text-xs">bg-panel</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="font-mono text-xs">--color-surface</TableCell>
                  <TableCell class="text-sm text-muted">Subtle hover/active surfaces</TableCell>
                  <TableCell class="text-right font-mono text-xs">bg-surface</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="font-mono text-xs">--color-fg</TableCell>
                  <TableCell class="text-sm text-muted">Primary text color</TableCell>
                  <TableCell class="text-right font-mono text-xs">text-fg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="font-mono text-xs">--color-muted</TableCell>
                  <TableCell class="text-sm text-muted">Secondary/de-emphasized text</TableCell>
                  <TableCell class="text-right font-mono text-xs">text-muted</TableCell>
                </TableRow>
                <TableRow class="border-none">
                  <TableCell class="font-mono text-xs">--color-stroke</TableCell>
                  <TableCell class="text-sm text-muted">Border and divider color</TableCell>
                  <TableCell class="text-right font-mono text-xs">border-stroke</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-4">Border Radii</h2>
          <div class="border border-stroke rounded-xl overflow-hidden bg-bg">
            <Table>
              <TableHeader class="bg-surface">
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead class="text-right">Token</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell class="font-mono text-xs">--radius-card</TableCell>
                  <TableCell class="text-sm text-muted">Radius for Cards and Panels</TableCell>
                  <TableCell class="text-right font-mono text-xs">rounded-card</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="font-mono text-xs">--radius-btn</TableCell>
                  <TableCell class="text-sm text-muted">Radius for Buttons</TableCell>
                  <TableCell class="text-right font-mono text-xs">rounded-btn</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="font-mono text-xs">--radius-input</TableCell>
                  <TableCell class="text-sm text-muted">Radius for Inputs & Selects</TableCell>
                  <TableCell class="text-right font-mono text-xs">rounded-input</TableCell>
                </TableRow>
                <TableRow class="border-none">
                  <TableCell class="font-mono text-xs">--radius-badge</TableCell>
                  <TableCell class="text-sm text-muted">Radius for Badges</TableCell>
                  <TableCell class="text-right font-mono text-xs">rounded-badge</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-4">Typography</h2>
          <div class="border border-stroke rounded-xl overflow-hidden bg-bg">
            <Table>
              <TableHeader class="bg-surface">
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead class="text-right">Token</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell class="font-mono text-xs">--font-sans</TableCell>
                  <TableCell class="text-sm text-muted">Main UI font stack</TableCell>
                  <TableCell class="text-right font-mono text-xs">font-sans</TableCell>
                </TableRow>
                <TableRow class="border-none">
                  <TableCell class="font-mono text-xs">--font-mono</TableCell>
                  <TableCell class="text-sm text-muted">Technical/data font stack</TableCell>
                  <TableCell class="text-right font-mono text-xs">font-mono</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div class="space-y-4 pt-6">
          <h2 class="text-xl font-bold">Usage Example</h2>
          <p class="text-sm text-muted mb-4">
            You can apply these variables globally or scope them to a specific container.
          </p>
          <Code
            code={`:root {\n  --color-primary: #10b981;\n  --radius-card: 0px;\n  --radius-btn: 4px;\n  --font-mono: "Fira Code", monospace;\n}`}
            fileName="global.css"
            language="css"
          />
        </div>
      </div>
    </section>
  );
};
