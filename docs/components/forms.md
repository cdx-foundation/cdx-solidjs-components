# Form Components

A collection of input-based components for gathering and validating user data.

## Button

A versatile action button with support for variants, loading states, and polymorphic rendering.

```tsx
import { Button } from 'cdx-solidjs-components/ui/Button';

<Button variant="primary">Submit</Button>
<Button variant="outline" isLoading>Saving...</Button>
<Button as="a" href="/docs" variant="ghost">Go to Docs</Button>
```

### Variants

- `primary`: (Default) High-emphasis theme background.
- `secondary`: Medium-emphasis with border.
- `outline`: Low-emphasis with border and smaller text.
- `ghost`: Minimalist style that appears on hover.
- `destructive`: Red button for critical actions.

---

## Input

A standard text input field with built-in label and error support.

```tsx
import { Input } from 'cdx-solidjs-components/ui/Input';

<Input label="Email" placeholder="user@example.com" type="email" />
<Input label="Password" error="Incorrect password" type="password" />
```

---

## Textarea

A multi-line text input for longer data.

```tsx
import { Textarea } from 'cdx-solidjs-components/ui/Textarea';

<Textarea label="Biography" placeholder="Tell us about yourself..." />;
```

---

## Checkbox

A boolean toggle for selecting one or more items.

```tsx
import { Checkbox } from 'cdx-solidjs-components/ui/Checkbox';

<Checkbox label="Accept terms and conditions" onCheckedChange={(v) => console.log(v)} />;
```

---

## RadioGroup

A set of mutually exclusive choices using a modern card-based layout.

```tsx
import { RadioGroup } from 'cdx-solidjs-components/ui/RadioGroup';

<RadioGroup
  name="plan"
  label="Select Plan"
  value={selected()}
  onChange={setSelected}
  options={[
    { value: 'free', label: 'Free', description: 'Basic features' },
    { value: 'pro', label: 'Pro', description: 'Advanced features' },
  ]}
/>;
```

---

## Select

A fully themeable replacement for the native dropdown menu.

```tsx
import { Select } from 'cdx-solidjs-components/ui/Select';

<Select
  label="Environment"
  options={[
    { label: 'Production', value: 'prod' },
    { label: 'Staging', value: 'stage' },
  ]}
  value={env()}
  onChange={setEnv}
/>;
```

---

## Slider

A range input with a custom track and square thumb.

```tsx
import { Slider } from 'cdx-solidjs-components/ui/Slider';

<Slider label="Volume" min={0} max={100} value={vol()} onChange={setVol} />;
```

---

## Switch

A high-fidelity toggle control (On/Off).

```tsx
import { Switch } from 'cdx-solidjs-components/ui/Switch';

<Switch label="Auto-save" checked={enabled()} onCheckedChange={setEnabled} />;
```

---

## ColorPicker

A color selection tool with curated presets and custom Hex input.

```tsx
import { ColorPicker } from 'cdx-solidjs-components/ui/ColorPicker';

<ColorPicker label="Accent Color" value={color()} onChange={setColor} />;
```

---

## DatePicker

A combination of Popover and Calendar for selecting specific dates.

```tsx
import { DatePicker } from 'cdx-solidjs-components/ui/DatePicker';

<DatePicker label="Start Date" value={date()} onChange={setDate} />;
```

---

## Label

A semantic wrapper for form headings.

```tsx
import { Label } from 'cdx-solidjs-components/ui/Label';

<Label for="username">Username</Label>;
```
