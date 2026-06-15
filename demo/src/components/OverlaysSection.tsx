import { Button } from '../../../lib/ui/Button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../../lib/ui/HoverCard';
import { Popover, PopoverContent, PopoverTrigger } from '../../../lib/ui/Popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../lib/ui/Tooltip';
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
        code={`import { Modal, ModalHeader, ModalTitle, ModalFooter } from 'cdx-solidjs-components/ui/Modal';\n\n<Modal isOpen={open()} onClose={close}>\n  <ModalHeader>\n    <ModalTitle>Confirm Deployment</ModalTitle>\n  </ModalHeader>\n  <ModalFooter>\n    <Button onClick={close}>Cancel</Button>\n    <Button variant="primary">Confirm</Button>\n  </ModalFooter>\n</Modal>`}
      >
        <Button variant="secondary" onClick={() => props.setModalOpen(true)}>
          Launch Dialog
        </Button>
      </Preview>

      <Preview
        title="Slide Overlay (Sheet)"
        description="Lateral panels for detail views."
        code={`import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetFooter } from 'cdx-solidjs-components/ui/Sheet';\n\n<Sheet isOpen={open()} onClose={close} side="right">\n  <SheetHeader>\n    <SheetTitle>Configuration</SheetTitle>\n  </SheetHeader>\n  <SheetContent>...</SheetContent>\n  <SheetFooter>\n    <Button>Save Changes</Button>\n  </SheetFooter>\n</Sheet>`}
      >
        <Button variant="secondary" onClick={() => props.setSheetOpen(true)}>
          Open Right Sheet
        </Button>
      </Preview>

      <Preview
        title="Tooltip"
        description="A small floating label that appears on hover."
        code={`import { Tooltip, TooltipTrigger, TooltipContent } from 'cdx-solidjs-components/ui/Tooltip';\n\n<Tooltip align="top">\n  <TooltipTrigger>\n    <Button variant="outline">Hover Me</Button>\n  </TooltipTrigger>\n  <TooltipContent>Archive this resource</TooltipContent>\n</Tooltip>`}
      >
        <div class="flex gap-4">
          <Tooltip align="top">
            <TooltipTrigger>
              <Button variant="outline">Top</Button>
            </TooltipTrigger>
            <TooltipContent>Top Tooltip</TooltipContent>
          </Tooltip>
          <Tooltip align="bottom">
            <TooltipTrigger>
              <Button variant="outline">Bottom</Button>
            </TooltipTrigger>
            <TooltipContent>Bottom Tooltip</TooltipContent>
          </Tooltip>
          <Tooltip align="left">
            <TooltipTrigger>
              <Button variant="outline">Left</Button>
            </TooltipTrigger>
            <TooltipContent>Left Tooltip</TooltipContent>
          </Tooltip>
          <Tooltip align="right">
            <TooltipTrigger>
              <Button variant="outline">Right</Button>
            </TooltipTrigger>
            <TooltipContent>Right Tooltip</TooltipContent>
          </Tooltip>
        </div>
      </Preview>

      <Preview
        title="Popover"
        description="A floating container for rich content. Now supports cardinal and diagonal (corner) alignment."
        code={`import { Popover, PopoverTrigger, PopoverContent } from 'cdx-solidjs-components/ui/Popover';\n\n<div class="grid grid-cols-3 gap-4">\n  <Popover align="bottom-left">\n    <PopoverTrigger><Button variant="outline">Bottom Left</Button></PopoverTrigger>\n    <PopoverContent>...</PopoverContent>\n  </Popover>\n</div>`}
      >
        <div class="flex flex-col gap-8 w-full items-center">
          <div class="flex flex-wrap justify-center gap-4">
            <Popover align="top-left">
              <PopoverTrigger>
                <Button variant="outline">Top Left</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="p-4 w-48 text-sm">Aligned to trigger's top-left corner.</div>
              </PopoverContent>
            </Popover>
            <Popover align="top">
              <PopoverTrigger>
                <Button variant="outline">Top</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="p-4 w-48 text-sm text-center">Standard top alignment.</div>
              </PopoverContent>
            </Popover>
            <Popover align="top-right">
              <PopoverTrigger>
                <Button variant="outline">Top Right</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="p-4 w-48 text-sm text-right">Aligned to top-right corner.</div>
              </PopoverContent>
            </Popover>
          </div>

          <div class="flex flex-wrap justify-center gap-4">
            <Popover align="bottom-left">
              <PopoverTrigger>
                <Button variant="outline">Bottom Left</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="p-4 w-48 text-sm">Aligned to bottom-left corner.</div>
              </PopoverContent>
            </Popover>
            <Popover align="bottom">
              <PopoverTrigger>
                <Button variant="outline">Bottom</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="p-4 w-48 text-sm text-center">Standard bottom alignment.</div>
              </PopoverContent>
            </Popover>
            <Popover align="bottom-right">
              <PopoverTrigger>
                <Button variant="outline">Bottom Right</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="p-4 w-48 text-sm text-right">Aligned to bottom-right corner.</div>
              </PopoverContent>
            </Popover>
          </div>

          <div class="flex flex-wrap justify-center gap-4">
            <Popover align="left-top">
              <PopoverTrigger>
                <Button variant="outline">Left Top</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="p-4 w-48 text-sm">Side-aligned to the top.</div>
              </PopoverContent>
            </Popover>
            <Popover align="right-bottom">
              <PopoverTrigger>
                <Button variant="outline">Right Bottom</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div class="p-4 w-48 text-sm">Side-aligned to the bottom.</div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Preview>

      <Preview
        title="Hover Card"
        description="A non-interactive preview that appears on hover. Alignment is now fully configurable."
        code={`import { HoverCard, HoverCardTrigger, HoverCardContent } from 'cdx-solidjs-components/ui/HoverCard';\n\n<HoverCard align="bottom-right">\n  <HoverCardTrigger><Button>Bottom Right</Button></HoverCardTrigger>\n  <HoverCardContent>Content aligned to corner</HoverCardContent>\n</HoverCard>`}
      >
        <div class="flex flex-wrap justify-center gap-8">
          <HoverCard align="top-left">
            <HoverCardTrigger>
              <span class="text-primary underline cursor-help font-mono text-xs">top-left</span>
            </HoverCardTrigger>
            <HoverCardContent>
              <div class="space-y-2">
                <h4 class="text-sm font-bold">Top Left Card</h4>
                <p class="text-xs text-muted leading-tight">
                  Perfect for triggers located at the edges of a container.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard align="right-top">
            <HoverCardTrigger>
              <span class="text-primary underline cursor-help font-mono text-xs">right-top</span>
            </HoverCardTrigger>
            <HoverCardContent>
              <div class="space-y-2">
                <h4 class="text-sm font-bold">Right Top Card</h4>
                <p class="text-xs text-muted leading-tight">
                  Appears to the right, flush with the top of the trigger.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard align="bottom-right">
            <HoverCardTrigger>
              <span class="text-primary underline cursor-help font-mono text-xs">
                bottom-right
              </span>
            </HoverCardTrigger>
            <HoverCardContent>
              <div class="space-y-2">
                <h4 class="text-sm font-bold">Bottom Right Card</h4>
                <p class="text-xs text-muted leading-tight">
                  Spawns below and extends to the left from the right edge.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </Preview>
    </section>
  );
};
