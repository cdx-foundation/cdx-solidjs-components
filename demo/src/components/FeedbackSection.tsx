import { Alert, AlertDescription, AlertTitle } from '../../../lib/ui/Alert';
import { Button } from '../../../lib/ui/Button';
import { Input } from '../../../lib/ui/Input';
import { Progress } from '../../../lib/ui/Progress';
import { Select } from '../../../lib/ui/Select';
import { Skeleton } from '../../../lib/ui/Skeleton';
import { type ToasterPosition, toast } from '../../../lib/ui/Toast';
import { Preview } from './Preview';

interface FeedbackSectionProps {
  toastPos: ToasterPosition;
  setToastPos: (pos: ToasterPosition) => void;
  maxToasts: number;
  setMaxToasts: (max: number) => void;
  toastDuration: number;
  setToastDuration: (duration: number) => void;
}

export const FeedbackSection = (props: FeedbackSectionProps) => {
  return (
    <section class="space-y-12">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">Feedback</h1>
        <p class="text-lg text-muted">Communicate system status and task progress.</p>
      </div>

      <Preview
        title="Alert"
        description="Prominent, contextual messaging."
        code={`import { Alert, AlertTitle, AlertDescription } from 'starling-components/ui/Alert';\n\n<Alert variant="destructive">\n  <AlertTitle>Critical Error</AlertTitle>\n  <AlertDescription>Regional cluster failure detected.</AlertDescription>\n</Alert>`}
      >
        <div class="flex flex-col gap-4 w-full max-w-md transition-all duration-400">
          <Alert>
            <AlertTitle>System Update</AlertTitle>
            <AlertDescription>A new version is available for deployment.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Critical Error</AlertTitle>
            <AlertDescription>Memory leak detected in regional cluster.</AlertDescription>
          </Alert>
        </div>
      </Preview>

      <Preview
        title="Progress & Skeletons"
        description="Visualizing async states and completion."
        code={`import { Progress } from 'starling-components/ui/Progress';\nimport { Skeleton } from 'starling-components/ui/Skeleton';\n\n<Progress value={78} />\n<Skeleton class="h-12 w-full rounded-xl" />`}
      >
        <div class="w-full max-w-sm space-y-6 transition-all duration-400">
          <Progress value={78} class="h-1.5" />
          <div class="space-y-3">
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-[70%]" />
            <Skeleton class="h-12 w-full rounded-xl" />
          </div>
        </div>
      </Preview>

      <Preview
        title="Toast Notifications"
        description="Fluid, non-interruptive feedback. Now with configurable positioning, limits, and duration."
        code={`import { toast, Toaster } from 'starling-components/ui/Toast';\n\n<Toaster \n  position="${props.toastPos}" \n  maxToasts={${props.maxToasts}} \n  duration={${props.toastDuration}} \n/>\n\n<Button onClick={() => toast({ title: "Done", type: "success" })}>\n  Show Success\n</Button>`}
      >
        <div class="flex flex-col gap-6 w-full max-w-xs transition-all duration-400">
          <Select
            label="Toaster Position"
            value={props.toastPos}
            onChange={(v) => {
              props.setToastPos(v as ToasterPosition);
              toast.setPosition(v as ToasterPosition);
            }}
            options={[
              { label: 'Top Left', value: 'top-left' },
              { label: 'Top Center', value: 'top-center' },
              { label: 'Top Right', value: 'top-right' },
              { label: 'Bottom Left', value: 'bottom-left' },
              { label: 'Bottom Center', value: 'bottom-center' },
              { label: 'Bottom Right', value: 'bottom-right' },
            ]}
          />
          <div class="grid grid-cols-2 gap-4">
            <Input
              label="Max Toasts"
              type="number"
              value={props.maxToasts}
              onInput={(e) => props.setMaxToasts(Number.parseInt(e.currentTarget.value))}
            />
            <Input
              label="Duration (ms)"
              type="number"
              value={props.toastDuration}
              onInput={(e) => props.setToastDuration(Number.parseInt(e.currentTarget.value))}
            />
          </div>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: 'System Ready',
                description: 'All clusters operational.',
                type: 'success',
              })
            }
          >
            Trigger Notification
          </Button>
        </div>
      </Preview>
    </section>
  );
};
