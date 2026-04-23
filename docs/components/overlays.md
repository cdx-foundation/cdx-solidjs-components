# Overlay Components

Floating UI elements that appear over the main content, such as modals, tooltips, and menus.

## Modal

A composable dialog window for focused interactions.

```tsx
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from 'starling-components/ui/Modal';

<Modal isOpen={open()} onClose={() => setOpen(false)}>
  <ModalHeader>
    <ModalTitle>Delete Registry</ModalTitle>
    <ModalDescription>This action is irreversible.</ModalDescription>
  </ModalHeader>
  <p class="py-4">Are you sure you want to delete this resource?</p>
  <ModalFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive">Confirm Delete</Button>
  </ModalFooter>
</Modal>
```

---

## Sheet (Slide-over)

A panel that slides in from the edge of the viewport.

```tsx
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from 'starling-components/ui/Sheet';

<Sheet isOpen={open()} onClose={() => setOpen(false)} side="right">
  <SheetHeader>
    <SheetTitle>Settings</SheetTitle>
    <SheetDescription>Update your workspace preferences.</SheetDescription>
  </SheetHeader>
  <SheetContent>
    {/* Scrollable content */}
  </SheetContent>
</Sheet>
```

### Props
- `side`: `"left" | "right"`. Defaults to `"right"`.

---

## Popover

A floating container for rich content, triggered by a click.

```tsx
import { Popover } from 'starling-components/ui/Popover';

<Popover
  trigger={<Button variant="outline">Open Menu</Button>}
  align="center"
>
  <div class="p-2">Detailed information here.</div>
</Popover>
```

---

## Tooltip

A small floating label that appears on hover.

```tsx
import { Tooltip } from 'starling-components/ui/Tooltip';

<Tooltip
  trigger={<Button>Hover Me</Button>}
  content="Learn more"
  align="top"
/>
```

---

## HoverCard

A non-interactive preview that appears on hover with a slight delay.

```tsx
import { HoverCard } from 'starling-components/ui/HoverCard';

<HoverCard trigger={<a href="/user">@yanis</a>}>
  <div class="flex gap-4">
    <Avatar fallback="YA" />
    <div>
      <h4 class="text-sm font-bold">Yanis</h4>
      <p class="text-xs text-muted">Core Developer</p>
    </div>
  </div>
</HoverCard>
```

---

## ContextMenu

A custom right-click menu.

```tsx
import { ContextMenu } from 'starling-components/ui/ContextMenu';

<ContextMenu
  menu={
    <div class="flex flex-col p-1">
      <button class="p-2 text-left hover:bg-surface">Duplicate</button>
      <button class="p-2 text-left hover:bg-surface">Delete</button>
    </div>
  }
>
  <div class="h-40 border border-dashed flex items-center justify-center">
    Right click this area
  </div>
</ContextMenu>
```

---

## DropdownMenu

A standard menu for actions or selection.

```tsx
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from 'starling-components/ui/DropdownMenu';

<DropdownMenu trigger={<Button>Actions</Button>}>
  <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
</DropdownMenu>
```

---

## Command (CMDK)

A high-performance command palette with fuzzy filtering and keyboard navigation.

```tsx
import { Command, CommandGroup, CommandItem } from 'starling-components/ui/Command';

<Command isOpen={open()} onClose={() => setOpen(false)} placeholder="Search actions...">
  <CommandGroup heading="General">
    <CommandItem value="settings" onSelect={goToSettings}>Settings</CommandItem>
    <CommandItem value="logout">Logout</CommandItem>
  </CommandGroup>
</Command>
```
