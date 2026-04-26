import { Button } from '../../../lib/ui/Button';
import { HoverCard } from '../../../lib/ui/HoverCard';
import { Popover } from '../../../lib/ui/Popover';
import { Tooltip } from '../../../lib/ui/Tooltip';
import { Preview } from './Preview';

interface OverlaysSectionProps {
  setModalOpen: (open: boolean) => void;
  setSheetOpen: (open: boolean) => void;
}

export const OverlaysSection = (props: OverlaysSectionProps) => {
  return (
    <section class="space-y-12">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">Overlays</h1>
        <p class="text-lg text-muted">Accessible dialogs, sheets, and popovers.</p>
      </div>

      <Preview
        title="Dialog (Modal)"
        description="Focused interruptions for critical tasks."
        code={`import { Modal, ModalHeader, ModalTitle, ModalFooter } from 'starling-components/ui/Modal';\n\n<Modal isOpen={open()} onClose={close}>\n  <ModalHeader>\n    <ModalTitle>Confirm Deployment</ModalTitle>\n  </ModalHeader>\n  <ModalFooter>\n    <Button onClick={close}>Cancel</Button>\n    <Button variant="primary">Confirm</Button>\n  </ModalFooter>\n</Modal>`}
      >
        <Button variant="secondary" onClick={() => props.setModalOpen(true)}>
          Launch Dialog
        </Button>
      </Preview>

      <Preview
        title="Slide Overlay (Sheet)"
        description="Lateral panels for detail views."
        code={`import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetFooter } from 'starling-components/ui/Sheet';\n\n<Sheet isOpen={open()} onClose={close} side="right">\n  <SheetHeader>\n    <SheetTitle>Configuration</SheetTitle>\n  </SheetHeader>\n  <SheetContent>...</SheetContent>\n  <SheetFooter>\n    <Button>Save Changes</Button>\n  </SheetFooter>\n</Sheet>`}
      >
        <Button variant="secondary" onClick={() => props.setSheetOpen(true)}>
          Open Right Sheet
        </Button>
      </Preview>

      <Preview
        title="Tooltip"
        description="A small floating label that appears on hover."
        code={`import { Tooltip } from 'starling-components/ui/Tooltip';\n\n<Tooltip\n  trigger={<Button variant="outline">Hover Me</Button>}\n  content="Archive this resource"\n  align="top"\n/>`}
      >
        <div class="flex gap-4">
          <Tooltip
            trigger={<Button variant="outline">Top</Button>}
            content="Top Tooltip"
            align="top"
          />
          <Tooltip
            trigger={<Button variant="outline">Bottom</Button>}
            content="Bottom Tooltip"
            align="bottom"
          />
          <Tooltip
            trigger={<Button variant="outline">Left</Button>}
            content="Left Tooltip"
            align="left"
          />
          <Tooltip
            trigger={<Button variant="outline">Right</Button>}
            content="Right Tooltip"
            align="right"
          />
        </div>
      </Preview>

      <Preview
        title="Popover"
        description="A floating container for rich content. Now supports cardinal and diagonal (corner) alignment."
        code={`import { Popover } from 'starling-components/ui/Popover';\n\n<div class="grid grid-cols-3 gap-4">\n  <Popover trigger={<Button variant="outline">Bottom Left</Button>} align="bottom-left">...</Popover>\n  <Popover trigger={<Button variant="outline">Bottom Right</Button>} align="bottom-right">...</Popover>\n  <Popover trigger={<Button variant="outline">Top Right</Button>} align="top-right">...</Popover>\n</div>`}
      >
        <div class="flex flex-col gap-8 w-full items-center">
          <div class="flex flex-wrap justify-center gap-4">
            <Popover trigger={<Button variant="outline">Top Left</Button>} align="top-left">
              <div class="p-4 w-48 text-sm">Aligned to trigger's top-left corner.</div>
            </Popover>
            <Popover trigger={<Button variant="outline">Top</Button>} align="top">
              <div class="p-4 w-48 text-sm text-center">Standard top alignment.</div>
            </Popover>
            <Popover trigger={<Button variant="outline">Top Right</Button>} align="top-right">
              <div class="p-4 w-48 text-sm text-right">Aligned to top-right corner.</div>
            </Popover>
          </div>

          <div class="flex flex-wrap justify-center gap-4">
            <Popover trigger={<Button variant="outline">Bottom Left</Button>} align="bottom-left">
              <div class="p-4 w-48 text-sm">Aligned to bottom-left corner.</div>
            </Popover>
            <Popover trigger={<Button variant="outline">Bottom</Button>} align="bottom">
              <div class="p-4 w-48 text-sm text-center">Standard bottom alignment.</div>
            </Popover>
            <Popover trigger={<Button variant="outline">Bottom Right</Button>} align="bottom-right">
              <div class="p-4 w-48 text-sm text-right">Aligned to bottom-right corner.</div>
            </Popover>
          </div>

          <div class="flex flex-wrap justify-center gap-4">
            <Popover trigger={<Button variant="outline">Left Top</Button>} align="left-top">
              <div class="p-4 w-48 text-sm">Side-aligned to the top.</div>
            </Popover>
            <Popover trigger={<Button variant="outline">Right Bottom</Button>} align="right-bottom">
              <div class="p-4 w-48 text-sm">Side-aligned to the bottom.</div>
            </Popover>
          </div>
        </div>
      </Preview>

      <Preview
        title="Hover Card"
        description="A non-interactive preview that appears on hover. Alignment is now fully configurable."
        code={`import { HoverCard } from 'starling-components/ui/HoverCard';\n\n<HoverCard trigger={<Button>Bottom Right</Button>} align="bottom-right">\n  Content aligned to corner\n</HoverCard>`}
      >
        <div class="flex flex-wrap justify-center gap-8">
          <HoverCard
            align="top-left"
            trigger={
              <span class="text-primary underline cursor-help font-mono text-xs">top-left</span>
            }
          >
            <div class="space-y-2">
              <h4 class="text-sm font-bold">Top Left Card</h4>
              <p class="text-xs text-muted leading-tight">
                Perfect for triggers located at the edges of a container.
              </p>
            </div>
          </HoverCard>

          <HoverCard
            align="right-top"
            trigger={
              <span class="text-primary underline cursor-help font-mono text-xs">right-top</span>
            }
          >
            <div class="space-y-2">
              <h4 class="text-sm font-bold">Right Top Card</h4>
              <p class="text-xs text-muted leading-tight">
                Appears to the right, flush with the top of the trigger.
              </p>
            </div>
          </HoverCard>

          <HoverCard
            align="bottom-right"
            trigger={
              <span class="text-primary underline cursor-help font-mono text-xs">bottom-right</span>
            }
          >
            <div class="space-y-2">
              <h4 class="text-sm font-bold">Bottom Right Card</h4>
              <p class="text-xs text-muted leading-tight">
                Spawns below and extends to the left from the right edge.
              </p>
            </div>
          </HoverCard>
        </div>
      </Preview>
    </section>
  );
};
