# Disclosure Components

Components for toggling the visibility of large sections of content.

## Accordion

A vertically stacked set of collapsible headings.

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'starling-components/ui/Accordion';

<Accordion collapsible>
  <AccordionItem>
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      Yes. It follows the technical Starling aesthetic.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Collapsible

A simple interactive area to show or hide content.

```tsx
import { Collapsible } from 'starling-components/ui/Collapsible';

<Collapsible
  trigger={<Button variant="outline">Advanced Settings</Button>}
  defaultOpen={false}
>
  <div class="p-4 border mt-2">
    {/* Hidden settings */}
  </div>
</Collapsible>
```

---

## Carousel

A high-performance slider with native browser snap-scrolling.

```tsx
import { Carousel } from 'starling-components/ui/Carousel';

<Carousel
  items={[
    <div class="h-40 bg-surface border flex items-center justify-center">Slide 1</div>,
    <div class="h-40 bg-surface border flex items-center justify-center">Slide 2</div>,
    <div class="h-40 bg-surface border flex items-center justify-center">Slide 3</div>
  ]}
/>
```
