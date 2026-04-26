import { Check, Copy, FileCode } from 'lucide-solid';
import { type JSX, Show, createSignal, splitProps } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import { ScrollArea } from './ScrollArea';

/**
 * Configuration for the Code component.
 */
interface CodeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** The code string to display. */
  code: string;
  /** Optional filename to display in the header. */
  fileName?: string;
  /** Optional language tag for display. */
  language?: string;
  /** Whether to show the copy button. @default true */
  showCopy?: boolean;
  /** Custom class for the code element itself. */
  codeClass?: string;
}

/**
 * ### Code Component
 *
 * A professional code block component featuring a header with optional filename,
 * a copy-to-clipboard action, and integrated scroll management.
 *
 * @example
 * ```tsx
 * <Code
 *   code="npm install starling-components"
 *   fileName="terminal"
 *   language="bash"
 * />
 * ```
 */
export const Code = (props: CodeProps) => {
  const [local, others] = splitProps(props, [
    'code',
    'fileName',
    'language',
    'showCopy',
    'class',
    'codeClass',
  ]);

  const [copied, setCopied] = createSignal(false);
  const showCopy = () => local.showCopy ?? true;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(local.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div
      class={twMerge(
        'group relative flex flex-col overflow-hidden rounded-card border border-stroke bg-panel/50 font-mono text-sm',
        local.class,
      )}
      {...others}
    >
      {/* Header */}
      <Show when={local.fileName || local.language || showCopy()}>
        <div class="flex items-center justify-between border-b border-stroke bg-surface/50 px-4 py-2">
          <div class="flex items-center gap-2 overflow-hidden">
            <Show when={local.fileName}>
              <FileCode size={14} class="text-muted shrink-0" />
              <span class="truncate text-[11px] font-bold text-muted uppercase tracking-wider">
                {local.fileName}
              </span>
            </Show>
            <Show when={!local.fileName && local.language}>
              <span class="text-[10px] font-bold text-muted/60 uppercase tracking-widest">
                {local.language}
              </span>
            </Show>
          </div>

          <Show when={showCopy()}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              class="h-7 w-7 p-0 hover:bg-surface"
              title="Copy code"
            >
              <Show when={copied()} fallback={<Copy size={13} class="text-muted" />}>
                <Check size={13} class="text-green-500" />
              </Show>
            </Button>
          </Show>
        </div>
      </Show>

      {/* Code Body */}
      <ScrollArea maxHeight="400px" class="flex-1">
        <div class="p-4">
          <pre class={twMerge('whitespace-pre text-fg', local.codeClass)}>
            <code>{local.code}</code>
          </pre>
        </div>
      </ScrollArea>
    </div>
  );
};
