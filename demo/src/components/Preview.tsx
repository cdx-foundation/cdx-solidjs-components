import { Code } from '../../../lib/ui/Code';

interface PreviewProps {
  title: string;
  description: string;
  children: any;
  code: string;
  fileName?: string;
}

export const Preview = (props: PreviewProps) => (
  <div class="space-y-6 mb-20">
    <div class="flex flex-col gap-1">
      <h3 class="text-2xl font-bold tracking-tight">{props.title}</h3>
      <p class="text-sm text-muted">{props.description}</p>
    </div>
    <div class="flex flex-col gap-4">
      <div class="border border-stroke rounded-xl overflow-hidden bg-bg/50 grid-bg p-12 flex items-center justify-center min-h-[250px]">
        {props.children}
      </div>
      <Code code={props.code} fileName={props.fileName || 'Usage'} language="tsx" />
    </div>
  </div>
);
