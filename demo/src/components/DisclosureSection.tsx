import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../lib/ui/Accordion';
import { Preview } from './Preview';

export const DisclosureSection = () => {
  return (
    <section class="space-y-12">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">Disclosure</h1>
        <p class="text-lg text-muted">Toggle visibility of large content sections.</p>
      </div>

      <Preview
        title="Accordion"
        description="Vertically stacked collapsible headings."
        code={`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'starling-fivem-components/ui/Accordion';\n\n<Accordion collapsible>\n  <AccordionItem>\n    <AccordionTrigger>How it works?</AccordionTrigger>\n    <AccordionContent>Details...</AccordionContent>\n  </AccordionItem>\n</Accordion>`}
      >
        <Accordion
          collapsible
          class="w-full max-w-sm border border-stroke rounded-xl px-4 bg-panel/30 transition-all duration-400"
        >
          <AccordionItem class="border-b border-stroke">
            <AccordionTrigger class="py-4 text-sm font-medium">System Security</AccordionTrigger>
            <AccordionContent class="pb-4 text-sm text-muted font-mono text-xs">
              We use AES-256-GCM encryption at rest for all data chunks.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem class="border-none">
            <AccordionTrigger class="py-4 text-sm font-medium">Automatic Scaling</AccordionTrigger>
            <AccordionContent class="pb-4 text-sm text-muted font-mono text-xs">
              Nodes scale horizontally based on RPS and latency metrics.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Preview>
    </section>
  );
};
