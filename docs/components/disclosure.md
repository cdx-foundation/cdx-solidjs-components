# Disclosure Components

Components for toggling the visibility of large sections of content.

## Accordion

A vertically stacked set of collapsible headings.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from 'cdx-solidjs-components/ui/Accordion';

<Accordion collapsible>
  <AccordionItem>
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>Yes. It follows the technical Starling aesthetic.</AccordionContent>
  </AccordionItem>
</Accordion>;
```

---

## Collapsible

A simple interactive area to show or hide content.

```tsx
import { Collapsible } from 'cdx-solidjs-components/ui/Collapsible';
import { Button } from 'cdx-solidjs-components/ui/Button';

<Collapsible trigger={<Button variant="outline">Advanced Settings</Button>} defaultOpen={false}>
  <div class="p-4 border border-stroke rounded-xl mt-2 bg-panel shadow-sm">
    <p class="text-xs text-muted">Configure granular server parameters here.</p>
  </div>
</Collapsible>;
```

---

## Carousel

A high-performance slider with native browser snap-scrolling.

```tsx
import { Carousel } from 'cdx-solidjs-components/ui/Carousel';

<Carousel
  items={[
    <div class="h-60 w-full bg-surface border border-stroke rounded-xl flex items-center justify-center">
      <span class="text-muted font-bold text-2xl">Slide 1</span>
    </div>,
    <div class="h-60 w-full bg-surface border border-stroke rounded-xl flex items-center justify-center">
      <span class="text-muted font-bold text-2xl">Slide 2</span>
    </div>,
    <div class="h-60 w-full bg-surface border border-stroke rounded-xl flex items-center justify-center">
      <span class="text-muted font-bold text-2xl">Slide 3</span>
    </div>,
  ]}
/>;
```
