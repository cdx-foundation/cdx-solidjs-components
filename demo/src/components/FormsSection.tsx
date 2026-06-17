import { createSignal } from 'solid-js';
import { Button } from '../../../lib/ui/Button';
import { Input } from '../../../lib/ui/Input';
import { Label } from '../../../lib/ui/Label';
import { SegmentedControl } from '../../../lib/ui/SegmentedControl';
import { Select } from '../../../lib/ui/Select';
import { Slider } from '../../../lib/ui/Slider';
import { Switch } from '../../../lib/ui/Switch';
import { Textarea } from '../../../lib/ui/Textarea';
import { Preview } from './Preview';

export const FormsSection = () => {
  const [sliderVal, setSliderVal] = createSignal(65);
  const [selectVal, setSelectVal] = createSignal<string | number>('prod');
  const [numVal, setNumVal] = createSignal(10);
  const [textareaAutoResize, setTextareaAutoResize] = createSignal(true);
  const [inputPreventRegex, setInputPreventRegex] = createSignal(true);
  const [inputHideButtons, setInputHideButtons] = createSignal(false);
  const [segVal, setSegVal] = createSignal('overview');

  return (
    <section class="space-y-12">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">Forms & Inputs</h1>
        <p class="text-lg text-muted">Precision primitives for user data entry.</p>
      </div>

      <Preview
        title="Button"
        description="Primary, secondary, and destructive actions."
        code={`import { Button } from 'cdx-solidjs-components/ui/Button';\n\n<div class="flex flex-wrap gap-4">\n  <Button variant="primary">Default</Button>\n  <Button variant="secondary">Secondary</Button>\n  <Button variant="destructive">Delete</Button>\n  <Button isLoading variant="outline">Processing</Button>\n</div>`}
      >
        <div class="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Delete</Button>
          <Button isLoading variant="outline">
            Processing
          </Button>
        </div>
      </Preview>

      <Preview
        title="Segmented Control"
        description="A pill-styled toggle group for compact value switching."
        code={`import { SegmentedControl } from 'cdx-solidjs-components/ui/SegmentedControl';\n\nconst options = [\n  { value: 'overview', label: 'Overview' },\n  { value: 'details', label: 'Details' },\n];\n\n<SegmentedControl \n  value={val()} \n  onChange={setVal}\n  options={options} \n/>`}
      >
        <SegmentedControl
          value={segVal()}
          onChange={setSegVal}
          options={[
            { value: 'overview', label: 'Overview' },
            { value: 'details', label: 'Details' },
          ]}
        />
      </Preview>

      <Preview
        title="Select"
        description="A fully themeable replacement for the native dropdown. Now supports an optional clearable state via the clearLabel prop."
        code={`import { Select } from 'cdx-solidjs-components/ui/Select';\n\n<Select \n  label="Environment"\n  value={env()} \n  onChange={setEnv}\n  clearLabel="None"\n  options={[\n    { label: 'Production', value: 'prod' },\n    { label: 'Staging', value: 'stage' }\n  ]}\n/>`}
      >
        <div class="w-full max-w-xs">
          <Select
            label="Deployment Environment"
            value={selectVal()}
            onChange={setSelectVal}
            clearLabel="None"
            options={[
              { label: 'Production (US-EAST)', value: 'prod' },
              { label: 'Staging (EU-WEST)', value: 'stage' },
              { label: 'Development (LOCAL)', value: 'dev' },
            ]}
          />
        </div>
      </Preview>

      <Preview
        title="Inputs & Toggles"
        description="Standard text inputs with optional descriptions and switches. Now supports regex validation."
        code={`import { Input } from 'cdx-solidjs-components/ui/Input';\nimport { Switch } from 'cdx-solidjs-components/ui/Switch';\nimport { Label } from 'cdx-solidjs-components/ui/Label';\n\n<div class="flex flex-col gap-6">\n  <Input \n    label="Username" \n    placeholder="yanis" \n    regex={/^[a-z0-9_]+$/} \n    preventInvalidRegex={${inputPreventRegex()}}\n    description="Lowercase letters, numbers, and underscores only." \n  />\n</div>`}
      >
        <div class="w-full max-sm flex flex-col gap-6 transition-all duration-400">
          <div class="flex items-center justify-between w-full px-2 py-1 bg-surface rounded-lg border border-stroke">
            <Label class="text-xs font-bold uppercase tracking-wider text-muted">
              Prevent Invalid Regex Input
            </Label>
            <Switch checked={inputPreventRegex()} onCheckedChange={setInputPreventRegex} />
          </div>
          <Input
            label="Username"
            placeholder="yanis"
            regex={/^[a-z0-9_]+$/}
            preventInvalidRegex={inputPreventRegex()}
            description="Lowercase letters, numbers, and underscores only."
          />
          <Input
            label="Pin Code"
            placeholder="0000"
            regex={/^\d*$/}
            preventInvalidRegex={inputPreventRegex()}
            description="Only digits allowed."
          />
        </div>
      </Preview>

      <Preview
        title="Number Input"
        description="A specialized input for numeric values with increment/decrement buttons."
        code={`import { Input } from 'cdx-solidjs-components/ui/Input';\n\n<Input\n  type="number"\n  label="Quantity"\n  value={${numVal()}}\n  min={1}\n  max={32}\n  hideButtons={${inputHideButtons()}}\n  onChange={setNumVal}\n/>`}
      >
        <div class="w-full max-w-xs flex flex-col gap-6">
          <div class="flex items-center justify-between w-full px-2 py-1 bg-surface rounded-lg border border-stroke">
            <Label class="text-xs font-bold uppercase tracking-wider text-muted">
              Hide Control Buttons
            </Label>
            <Switch checked={inputHideButtons()} onCheckedChange={setInputHideButtons} />
          </div>
          <Input
            type="number"
            label="Cluster Instances"
            value={numVal()}
            onChange={setNumVal}
            min={1}
            max={32}
            hideButtons={inputHideButtons()}
            description="Adjust number of active instances (1-32)."
          />
        </div>
      </Preview>

      <Preview
        title="Textarea"
        description="Multi-line text input with optional auto-resizing."
        code={`import { Textarea } from 'cdx-solidjs-components/ui/Textarea';\n\n<div class="flex items-center justify-between w-full px-2 py-1 bg-surface rounded-lg border border-stroke">\n  <Label class="text-xs font-bold uppercase tracking-wider text-muted">\n    Enable Auto-Resize\n  </Label>\n  <Switch checked={textareaAutoResize()} onCheckedChange={setTextareaAutoResize} />\n</div>\n\n<Textarea\n  label="Deployment Script"\n  placeholder="Enter bash script..."\n  autoResize={${textareaAutoResize()}}\n/>`}
      >
        <div class="w-full max-w-md flex flex-col gap-6">
          <div class="flex items-center justify-between w-full px-2 py-1 bg-surface rounded-lg border border-stroke">
            <Label class="text-xs font-bold uppercase tracking-wider text-muted">
              Enable Auto-Resize
            </Label>
            <Switch checked={textareaAutoResize()} onCheckedChange={setTextareaAutoResize} />
          </div>
          <Textarea
            label="Deployment Script"
            placeholder="Type to see auto-resize in action..."
            autoResize={textareaAutoResize()}
            class="min-h-[120px]"
          />
        </div>
      </Preview>

      <Preview
        title="Range Slider"
        description="Granular control for numeric values."
        code={`import { Slider } from 'cdx-solidjs-components/ui/Slider';\n\n<div class="w-full max-w-sm flex flex-col gap-4">\n  <Label>Memory Allocation</Label>\n  <Slider value={sliderVal()} onChange={setSliderVal} max={100} />\n</div>`}
      >
        <div class="w-full max-w-sm flex flex-col gap-4">
          <div class="flex justify-between font-mono text-xs">
            <Label class="text-muted">Memory Allocation</Label>
            <span class="text-primary font-bold">{sliderVal()}%</span>
          </div>
          <Slider value={sliderVal()} onChange={setSliderVal} max={100} />
        </div>
      </Preview>
    </section>
  );
};
