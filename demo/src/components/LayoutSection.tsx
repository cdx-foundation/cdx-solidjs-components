import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../lib/ui/Card';
import { Button } from '../../../lib/ui/Button';
import { ScrollArea } from '../../../lib/ui/ScrollArea';
import { AspectRatio } from '../../../lib/ui/AspectRatio';
import { Preview } from './Preview';

export const LayoutSection = () => {
  return (
    <section class="space-y-12">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">Layout</h1>
        <p class="text-lg text-muted">
          Essential components for structuring application pages.
        </p>
      </div>

      <Preview
        title="Card"
        description="A fundamental layout container for grouping related content."
        code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from 'starling-components/ui/Card';\nimport { Button } from 'starling-components/ui/Button';\n\n<Card class="max-w-sm">\n  <CardHeader>\n    <CardTitle>Instance Overview</CardTitle>\n    <CardDescription>Managed by Starling Cloud</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <p class="text-sm text-muted">All systems in us-east-1 are operational.</p>\n  </CardContent>\n  <CardFooter>\n    <Button variant="outline" class="w-full">View Cluster Metrics</Button>\n  </CardFooter>\n</Card>`}
      >
        <Card class="max-w-sm">
          <CardHeader>
            <CardTitle>Instance Overview</CardTitle>
            <CardDescription>Managed by Starling Cloud</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted">
              All systems in us-east-1 are operational. Deployment #4288 passed CI.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" class="w-full">
              View Cluster Metrics
            </Button>
          </CardFooter>
        </Card>
      </Preview>

      <Preview
        title="Scroll Area"
        description="Custom minimal scrollbars for contained content."
        code={`import { ScrollArea } from 'starling-components/ui/ScrollArea';\n\n<ScrollArea maxHeight="120px" class="border border-stroke p-4 rounded-lg bg-panel">\n  <div class="space-y-4 font-mono text-sm text-muted">\n    <p>[08:42:01] System initializing...</p>\n    <p>[08:42:05] Loading kernel modules...</p>\n    <p>[08:42:10] Database connection established.</p>\n  </div>\n</ScrollArea>`}
      >
        <ScrollArea
          maxHeight="120px"
          class="w-full max-w-sm border border-stroke p-4 rounded-lg bg-panel"
        >
          <div class="space-y-4">
            <p class="text-sm text-muted font-mono">[08:42:01] System initializing...</p>
            <p class="text-sm text-muted font-mono">[08:42:05] Loading kernel modules...</p>
            <p class="text-sm text-muted font-mono">
              [08:42:10] Database connection established.
            </p>
            <p class="text-sm text-muted font-mono">
              [08:42:12] Web server listening on :4000
            </p>
            <p class="text-sm text-muted font-mono">[08:42:15] Monitoring agents active.</p>
          </div>
        </ScrollArea>
      </Preview>

      <Preview
        title="AspectRatio"
        description="Maintain specific width-to-height ratios."
        code={`import { AspectRatio } from 'starling-components/ui/AspectRatio';\n\n<div class="w-full max-w-sm overflow-hidden rounded-xl border border-stroke shadow-lg">\n  <AspectRatio ratio={16/9}>\n    <div class="w-full h-full bg-surface grid-bg flex items-center justify-center">\n       <span class="text-muted font-bold tracking-wider">16:9 Aspect Ratio</span>\n    </div>\n  </AspectRatio>\n</div>`}
      >
        <div class="w-full max-w-sm overflow-hidden rounded-xl border border-stroke shadow-lg">
          <AspectRatio ratio={16 / 9}>
            <div class="w-full h-full bg-surface grid-bg flex items-center justify-center">
              <span class="text-muted font-bold">16:9 Aspect Ratio</span>
            </div>
          </AspectRatio>
        </div>
      </Preview>
    </section>
  );
};
