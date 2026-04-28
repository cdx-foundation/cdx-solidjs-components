import { Show, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import * as directives from '../../../lib/directives';
import { useDisclosure } from '../../../lib/hooks';
import { Button } from '../../../lib/ui/Button';
import { Code } from '../../../lib/ui/Code';
import { Input } from '../../../lib/ui/Input';
import { toast } from '../../../lib/ui/Toast';
import { useAppTheme } from '../hooks/useAppTheme';

// Directives registration
const { autofocus, clipboard, hover } = directives;
// @ts-ignore
false && [autofocus, clipboard, hover];

export const UtilsSection = () => {
  // Local implementation of useClipboard for the demo
  const useClipboardLocal = () => {
    const [hasCopied, setHasCopied] = createSignal(false);
    const onCopy = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };
    return { hasCopied, onCopy };
  };

  return (
    <section class="space-y-10">
      <h1 class="text-4xl font-extrabold tracking-tight">Utilities</h1>
      <p class="text-muted leading-relaxed max-w-2xl">
        Shared hooks and directives that power Starling UI's interactive features.
      </p>

      <div class="space-y-4">
        <h2 class="text-xl font-bold">useTheme Hook</h2>
        <p class="text-sm text-muted mb-4">
          Manages application theme state with built-in persistence and DOM synchronization.
        </p>
        <Code
          code={`import { useTheme } from 'starling-components/hooks';\n\nconst { isDark, toggleTheme } = useTheme();`}
          fileName="hooks"
          language="typescript"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div class="space-y-4">
          <h2 class="text-xl font-bold">useDisclosure Hook</h2>
          <p class="text-sm text-muted">Simplified state management for togglable components.</p>
          <Code
            code={`const { isOpen, onToggle } = useDisclosure();\n\n<Button onClick={onToggle}>\n  {isOpen() ? 'Hide' : 'Show'}\n</Button>`}
            language="tsx"
          />
          <div class="p-6 clean-panel flex flex-col items-center justify-center gap-4">
            {(() => {
              const { isOpen, onToggle } = useDisclosure(false);
              return (
                <>
                  <Button onClick={onToggle} variant="secondary">
                    {isOpen() ? 'Collapse Content' : 'Expand Content'}
                  </Button>
                  <Show when={isOpen()}>
                    <div class="p-4 bg-surface border border-stroke rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                      <p class="text-xs font-mono">This content is managed by useDisclosure.</p>
                    </div>
                  </Show>
                </>
              );
            })()}
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-bold">useClipboard Hook</h2>
          <p class="text-sm text-muted">
            Reactive clipboard management with temporary success state.
          </p>
          <Code
            code={`const { hasCopied, onCopy } = useClipboard();\n\n<Button onClick={() => onCopy("Value")}>\n  {hasCopied() ? "Copied!" : "Copy"}\n</Button>`}
            language="tsx"
          />
          <div class="p-6 clean-panel flex flex-col items-center justify-center gap-4">
            {(() => {
              const { hasCopied, onCopy } = useClipboardLocal();
              return (
                <div class="flex gap-2 w-full">
                  <Input value="npm install starling-ui" readonly class="flex-1" />
                  <Button
                    variant={hasCopied() ? 'secondary' : 'primary'}
                    onClick={() => onCopy('npm install starling-ui')}
                  >
                    <Show when={hasCopied()} fallback="Copy">
                      Copied
                    </Show>
                  </Button>
                </div>
              );
            })()}
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-bold">clipboard Directive</h2>
          <p class="text-sm text-muted">Declarative clipboard support via directives.</p>
          <Code
            code={`<button use:clipboard={() => "Copied text!"}>\n  Click to Copy\n</button>`}
            language="tsx"
          />
          <div class="p-6 clean-panel flex flex-col items-center justify-center gap-4">
            <Button
              variant="outline"
              use:clipboard={() => 'Hello from Starling Directive!'}
              onClick={() => toast.success('Copied to clipboard via directive!')}
            >
              Click to Copy
            </Button>
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-bold">hover Directive</h2>
          <p class="text-sm text-muted">Track hover state declaratively on any element.</p>
          <Code
            code={`const [isHovered, setIsHovered] = createSignal(false);\n\n<div use:hover={setIsHovered}>\n  {isHovered() ? 'Hovering!' : 'Idle'}\n</div>`}
            language="tsx"
          />
          <div class="p-6 clean-panel flex flex-col items-center justify-center gap-4">
            {(() => {
              const [isHovered, setIsHovered] = createSignal(false);
              return (
                <div
                  use:hover={setIsHovered}
                  class={twMerge(
                    'w-full p-8 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center font-bold uppercase tracking-widest',
                    isHovered()
                      ? 'bg-primary/10 border-primary text-primary scale-105'
                      : 'bg-surface border-stroke text-muted',
                  )}
                >
                  {isHovered() ? 'Reactive Hover!' : 'Hover Me'}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};
