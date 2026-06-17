# Layout Components

Essential components for structuring your application's pages and content areas.

## Card

A fundamental layout container for grouping related information and actions.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from 'cdx-solidjs-components/ui/Card';

<Card class="max-w-md">
  <CardHeader>
    <CardTitle>Project Overview</CardTitle>
    <CardDescription>System status and deployment logs.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>All systems operational.</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">View Logs</Button>
  </CardFooter>
</Card>;
```

### Sub-components

- `CardHeader`: Top container for titles and descriptions.
- `CardTitle`: Large, bold heading (`h3`).
- `CardDescription`: Smaller, muted text for context.
- `CardContent`: Main body of the card.
- `CardFooter`: Bottom action area.

---

## Separator

A clean visual divider for separating content sections.

```tsx
import { Separator } from 'cdx-solidjs-components/ui/Separator';

<div>
  <h4>Settings</h4>
  <Separator class="my-4" />
  <p>General preferences...</p>
</div>;

{
  /* Vertical usage */
}
<div class="flex h-5 items-center">
  <div>Home</div>
  <Separator orientation="vertical" class="mx-2" />
  <div>Docs</div>
</div>;
```

### Props

- `orientation`: `"horizontal" | "vertical"`. Defaults to `"horizontal"`.

---

## AspectRatio

Ensures an element maintains a specific width-to-height ratio.

```tsx
import { AspectRatio } from 'cdx-solidjs-components/ui/AspectRatio';

<AspectRatio ratio={16 / 9}>
  <img src="landscape.jpg" class="object-cover w-full h-full" />
</AspectRatio>;
```

### Props

- `ratio`: Number (Width / Height). Defaults to `1.777` (16:9).

---

## ScrollArea

A replacement for native scrollbars with a consistent, minimal visual style.

```tsx
import { ScrollArea } from 'cdx-solidjs-components/ui/ScrollArea';

<ScrollArea maxHeight="200px" class="border p-4">
  <p>Long content goes here...</p>
</ScrollArea>;
```

### Props

- `maxHeight`: CSS height string. Defaults to `"100%"`.

---

## Resizable

A modular system for building multi-pane layouts with draggable handles.

```tsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from 'cdx-solidjs-components/ui/Resizable';

<ResizablePanelGroup direction="horizontal" class="min-h-[200px] border">
  <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={70}>Main Content</ResizablePanel>
</ResizablePanelGroup>;
```

### Props

- `direction`: `"horizontal" | "vertical"`.
- `defaultSize`: Initial percentage width/height (0-100).
