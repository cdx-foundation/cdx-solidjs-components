# Overlay Components

Floating UI elements that appear over the main content, such as modals, tooltips, and menus.

## Modal

A composable dialog window for focused interactions.

```tsx
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from 'cdx-solidjs-components/ui/Modal';
import { Button } from 'cdx-solidjs-components/ui/Button';

<Modal isOpen={open()} onClose={() => setOpen(false)}>
  <ModalHeader>
    <ModalTitle>Delete Registry</ModalTitle>
    <ModalDescription>This action is irreversible. All data will be lost.</ModalDescription>
  </ModalHeader>
  <p class="py-4 text-sm">Are you sure you want to delete this resource?</p>
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
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter } from 'cdx-solidjs-components/ui/Sheet';
import { Button } from 'cdx-solidjs-components/ui/Button';

<Sheet isOpen={open()} onClose={() => setOpen(false)} side="right">
  <SheetHeader>
    <SheetTitle>Settings</SheetTitle>
    <SheetDescription>Update your workspace preferences.</SheetDescription>
  </SheetHeader>
  <SheetContent>
     <div class="space-y-4">
       {/* Settings form components */}
     </div>
  </SheetContent>
  <SheetFooter>
     <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
     <Button onClick={() => setOpen(false)}>Save Changes</Button>
  </SheetFooter>
</Sheet>
```

---

## Popover

A floating container for rich content, triggered by a click.

```tsx
import { Popover } from 'cdx-solidjs-components/ui/Popover';
import { Button } from 'cdx-solidjs-components/ui/Button';

<Popover
  trigger={<Button variant="outline">Open Menu</Button>}
  align="center"
>
  <div class="p-4 w-64">
    <h4 class="font-bold mb-1">Detailed Info</h4>
    <p class="text-xs text-muted">Additional context that doesn't fit in a tooltip.</p>
  </div>
</Popover>
```

---

## Tooltip

A small floating label that appears on hover.

```tsx
import { Tooltip } from 'cdx-solidjs-components/ui/Tooltip';
import { Button } from 'cdx-solidjs-components/ui/Button';

<Tooltip
  trigger={<Button variant="outline">Hover Me</Button>}
  content="Learn more about our pricing plans."
  align="top"
/>
```

---

## HoverCard

A non-interactive preview that appears on hover with a slight delay.

```tsx
import { HoverCard } from 'cdx-solidjs-components/ui/HoverCard';
import { Avatar, AvatarFallback } from 'cdx-solidjs-components/ui/Avatar';

<HoverCard trigger={<a href="/user" class="underline">@yanis</a>}>
  <div class="flex gap-4 p-2">
    <Avatar>
      <AvatarFallback>YA</AvatarFallback>
    </Avatar>
    <div>
      <h4 class="text-sm font-bold">Yanis</h4>
      <p class="text-xs text-muted">Core Developer at Starling City.</p>
    </div>
  </div>
</HoverCard>
```

---

## ContextMenu

A custom right-click menu.

```tsx
import { ContextMenu } from 'cdx-solidjs-components/ui/ContextMenu';

<ContextMenu
  menu={
    <div class="flex flex-col p-1 bg-panel border border-stroke rounded-lg shadow-md w-48">
      <button class="p-2 text-left text-sm hover:bg-surface rounded">Duplicate</button>
      <button class="p-2 text-left text-sm hover:bg-surface rounded">Rename</button>
      <div class="h-px bg-stroke my-1" />
      <button class="p-2 text-left text-sm text-red-500 hover:bg-red-500/10 rounded">Delete</button>
    </div>
  }
>
  <div class="h-40 border border-dashed border-stroke rounded-xl flex items-center justify-center text-muted">
    Right click this area
  </div>
</ContextMenu>
```

---

## DropdownMenu

A standard menu for actions or selection.

```tsx
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from 'cdx-solidjs-components/ui/DropdownMenu';
import { Button } from 'cdx-solidjs-components/ui/Button';

<DropdownMenu trigger={<Button>Actions</Button>}>
  <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
  <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive" onClick={onDelete}>Delete</DropdownMenuItem>
</DropdownMenu>
```

---

## Command (CMDK)

A high-performance command palette with fuzzy filtering and keyboard navigation.

```tsx
import { Command, CommandGroup, CommandItem } from 'cdx-solidjs-components/ui/Command';

<Command 
  isOpen={open()} 
  onClose={() => setOpen(false)} 
  placeholder="Search actions..."
>
  <CommandGroup heading="General">
    <CommandItem value="settings" onSelect={goToSettings}>Settings</CommandItem>
    <CommandItem value="profile" onSelect={goToProfile}>Profile</CommandItem>
  </CommandGroup>
  <CommandGroup heading="System">
    <CommandItem value="restart" onSelect={restartServer}>Restart Server</CommandItem>
    <CommandItem value="logout" class="text-red-500">Logout</CommandItem>
  </CommandGroup>
</Command>
```

