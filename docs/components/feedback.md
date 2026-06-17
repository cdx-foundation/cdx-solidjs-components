# Feedback Components

Components for communicating system status, progress, and notifications to users.

## Alert

Provides prominent, non-dismissible feedback with automatic icon injection.

```tsx
import { Alert, AlertTitle, AlertDescription } from 'cdx-solidjs-components/ui/Alert';

<Alert variant="warning">
  <AlertTitle>Low Disk Space</AlertTitle>
  <AlertDescription>Your server has less than 10% disk space remaining.</AlertDescription>
</Alert>;
```

### Variants

- `info`: (Default) Blue.
- `warning`: Amber.
- `error` / `destructive`: Red.
- `success`: Emerald.

---

## Progress

A visual indicator of task completion.

```tsx
import { Progress } from 'cdx-solidjs-components/ui/Progress';

<Progress value={45} max={100} />;
```

---

## Skeleton

Placeholder shapes for loading states to prevent layout shifts.

```tsx
import { Skeleton } from 'cdx-solidjs-components/ui/Skeleton';

<div class="flex items-center gap-4">
  <Skeleton class="h-12 w-12 rounded-full" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-[250px]" />
    <Skeleton class="h-4 w-[200px]" />
  </div>
</div>;
```

---

## Toast

A notification system for global alerts. Requires the `Toaster` component at the app root.

```tsx
import { toast, Toaster } from 'cdx-solidjs-components/ui/Toast';

// In your component
const notify = () => {
  toast({
    title: "Project Saved",
    description: "Successfully uploaded to registry.",
    type: "success"
  });
};

<Button onClick={notify}>Show Toast</Button>

// In App.tsx
<Toaster />
```

### Options

- `title`: Primary message heading.
- `description`: (Optional) Smaller monospace detail.
- `type`: `"default" | "success" | "error"`.
