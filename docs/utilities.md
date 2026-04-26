# Utilities

Shared hooks and directives that power Starling UI's interactive features.

## useTheme Hook

A reactive hook for managing the application's theme state (dark/light mode).

```tsx
import { useTheme } from 'starling-components/hooks';

export default function ThemeControl() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div class="flex flex-col gap-4">
      <p>Dark Mode: {isDark() ? 'Active' : 'Inactive'}</p>
      <Button onClick={toggleTheme}>Toggle Mode</Button>
    </div>
  );
}
```

### Features
- **System Sync:** Detects user OS preferences (e.g., `prefers-color-scheme`) on first load if no initial value is provided.
- **Lightweight:** Purely handles mode state. Persistence and DOM application (like toggling a `.dark` class) should be handled by the application logic.

---

## clickOutside Directive

A SolidJS directive that detects clicks outside of the element it is attached to.

```tsx
import { clickOutside } from 'starling-components/directives';

// Required for JIT scanning/bundlers if not used elsewhere
false && clickOutside;

function MyMenu() {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="relative">
      <Button onClick={() => setOpen(true)}>Open Menu</Button>
      
      <Show when={open()}>
        <div 
          use:clickOutside={() => setOpen(false)}
          class="absolute top-full bg-panel shadow-md p-4"
        >
          Clicking anywhere else will close me.
        </div>
      </Show>
    </div>
  );
}
```

### Integration Notes
To use the directive, you must ensure it is imported in the file where it is used. It also includes global JSX type definitions for `use:clickOutside`.
