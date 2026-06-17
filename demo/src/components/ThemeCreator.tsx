import {
  Check,
  Copy,
  DownloadCloud,
  Info,
  Layers,
  MoreHorizontal,
  MousePointer2,
  Palette,
  RefreshCw,
  Type,
} from 'lucide-solid';
import { For, Show, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import { toDark } from '../../../lib/hooks/useTheme';
import { FONTS, SHADOWS } from '../../../lib/theme-tokens';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../lib/ui/Accordion';
import { Alert, AlertDescription, AlertTitle } from '../../../lib/ui/Alert';
import { Avatar, AvatarFallback, AvatarImage } from '../../../lib/ui/Avatar';
import { Badge } from '../../../lib/ui/Badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../../lib/ui/Breadcrumb';
import { Button } from '../../../lib/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../lib/ui/Card';
import { Checkbox } from '../../../lib/ui/Checkbox';
import { Code } from '../../../lib/ui/Code';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../lib/ui/Collapsible';
import { ColorPicker } from '../../../lib/ui/ColorPicker';
import { DatePicker } from '../../../lib/ui/DatePicker';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../lib/ui/HoverCard';
import { Input } from '../../../lib/ui/Input';
import { Kbd } from '../../../lib/ui/Kbd';
import { Label } from '../../../lib/ui/Label';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '../../../lib/ui/Modal';
import { Popover, PopoverContent, PopoverTrigger } from '../../../lib/ui/Popover';
import { Progress } from '../../../lib/ui/Progress';
import { RadioGroup, RadioGroupItem } from '../../../lib/ui/RadioGroup';
import { SegmentedControl } from '../../../lib/ui/SegmentedControl';
import { Separator } from '../../../lib/ui/Separator';
import { Skeleton } from '../../../lib/ui/Skeleton';
import { Slider } from '../../../lib/ui/Slider';
import { Switch } from '../../../lib/ui/Switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../lib/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../lib/ui/Tabs';
import { toast } from '../../../lib/ui/Toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../lib/ui/Tooltip';
import { useAppTheme } from '../hooks/useAppTheme';
import { COLOR_PRESETS, STYLE_PRESETS, type StylePreset, hexToRgb } from '../theme-constants';

const RADIUS_OPTIONS = [
  { label: '0', value: '0px' },
  { label: '0.3', value: '0.3rem' },
  { label: '0.5', value: '0.5rem' },
  { label: '0.75', value: '0.75rem' },
  { label: '1.0', value: '1.0rem' },
];

const SHADOW_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'Neo', value: 'neo' },
  { label: 'Flat', value: 'flat' },
  { label: 'Hard', value: 'hard' },
];

const FONT_OPTIONS = [
  { label: 'Sans', value: 'sans', family: '"Inter"' },
  { label: 'Mono', value: 'mono', family: '"JetBrains Mono"' },
  { label: 'Display', value: 'display', family: '"Archivo Black"' },
  { label: 'Condensed', value: 'condensed', family: '"Bebas Neue"' },
  { label: 'Oxanium', value: 'oxanium', family: '"Oxanium"' },
  { label: 'System', value: 'system', family: 'system-ui' },
];

export const ThemeCreator = () => {
  const theme = useAppTheme();
  const [showExport, setShowExport] = createSignal(false);
  const [exportTab, setExportTab] = createSignal('css');
  const [hasCopied, setHasCopied] = createSignal(false);
  const [sliderVal, setSliderVal] = createSignal(45);
  const [region, setRegion] = createSignal('us-east');

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Apply a named colour preset — always sets light colours; dark auto-derives. */
  const applyColorPreset = (preset: (typeof COLOR_PRESETS)[number]) => {
    theme.setTheme({ light: { ...preset.colors } });
    theme.setMatchedPreset(preset.label);
  };

  /** Check if the current colour preset is the active one. */
  const matchesColorPreset = (preset: (typeof COLOR_PRESETS)[number]) => {
    // Tracked name match works across light/dark mode (dark auto-computes differ).
    if (theme.matchedPreset() === preset.label) return true;
    // Light-mode exact match as a fallback (for page reloads where the
    // preset name wasn't persisted but the colours were).
    return (
      !theme.isDark() &&
      theme.bg() === preset.colors.bg &&
      theme.panel() === preset.colors.panel &&
      theme.surface() === preset.colors.surface &&
      theme.border() === preset.colors.border &&
      theme.fg() === preset.colors.fg &&
      theme.muted() === preset.colors.muted
    );
  };

  // ── Export generators ───────────────────────────────────────────────────────

  const generateObject = () => {
    const common = {
      accent: theme.accentColor(),
      bg: theme.bg(),
      panel: theme.panel(),
      surface: theme.surface(),
      border: theme.border(),
      fg: theme.fg(),
      muted: theme.muted(),
      radius: theme.radius(),
      font: theme.bodyFont(),
      headerFont: theme.headerFont(),
      shadow: theme.shadow(),
      btnShadow: theme.btnShadow(),
    };
    return JSON.stringify(
      { light: { ...common, dark: false }, dark: { ...common, dark: true } },
      null,
      2,
    );
  };

  const generateCSS = () => {
    const primaryColor = theme.accentColor();
    const primaryRgb = hexToRgb(primaryColor);
    const r = theme.radius();
    return `:root {
    --primary-color: ${primaryColor};
    --primary-rgb: ${primaryRgb};
    --bg-main: ${theme.bg()};
    --bg-panel: ${theme.panel()};
    --bg-surface: ${theme.surface()};
    --fg-main: ${theme.fg()};
    --text-muted: ${theme.muted()};
    --border-main: ${theme.border()};
    --stroke: ${theme.border()};
    --ring-main: rgba(0, 0, 0, 0.05);
    --glass-border: rgba(0, 0, 0, 0.06);
    --radius-card: ${r};
    --radius-lg: ${r};
    --radius-btn: calc(${r} - 0.2rem);
    --radius-input: calc(${r} - 0.1rem);
    --radius-badge: calc(${r} - 0.3rem);
    --shadow-main: ${SHADOWS[theme.shadow()]};
    --shadow-btn: ${SHADOWS[theme.btnShadow()]};
    --sans-main: ${FONTS[theme.bodyFont()]};
    --display-main: ${FONTS[theme.headerFont()]};
    --mono-main: ${FONTS.mono};
    color-scheme: light;
  }

  .dark {
    --primary-rgb: ${primaryRgb};
    --bg-main: ${theme.bg()};
    --bg-panel: ${theme.panel()};
    --bg-surface: ${theme.surface()};
    --fg-main: ${theme.fg()};
    --text-muted: ${theme.muted()};
    --border-main: ${theme.border()};
    --stroke: ${theme.border()};
    --ring-main: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.05);
    color-scheme: dark;
  }`;
  };

  const generateLua = () => {
    const accent = theme.accentColor();
    const radius = theme.radius();
    const font = theme.bodyFont();
    const shadow = theme.shadow();
    const headerFont = theme.headerFont();
    const btnShadow = theme.btnShadow();
    return `-- Starling UI Theme Configuration
-- Paste into server.cfg or your resource's config.lua
--
-- On the client, read these convars and apply with setTheme():
--
--   local light = { accent = GetConvar("theme:light:accent", "${accent}"), bg = GetConvar("theme:light:bg", "${theme.bg()}"), panel = GetConvar("theme:light:panel", "${theme.panel()}"), surface = GetConvar("theme:light:surface", "${theme.surface()}"), border = GetConvar("theme:light:border", "${theme.border()}"), fg = GetConvar("theme:light:fg", "${theme.fg()}"), muted = GetConvar("theme:light:muted", "${theme.muted()}"), radius = GetConvar("theme:light:radius", "${radius}"), font = GetConvar("theme:light:font", "${font}"), headerFont = GetConvar("theme:light:headerFont", "${headerFont}"), shadow = GetConvar("theme:light:shadow", "${shadow}"), btnShadow = GetConvar("theme:light:btnShadow", "${btnShadow}") }
--   local dark  = { accent = GetConvar("theme:dark:accent", "${accent}"), bg = GetConvar("theme:dark:bg", "${theme.bg()}"), panel = GetConvar("theme:dark:panel", "${theme.panel()}"), surface = GetConvar("theme:dark:surface", "${theme.surface()}"), border = GetConvar("theme:dark:border", "${theme.border()}"), fg = GetConvar("theme:dark:fg", "${theme.fg()}"), muted = GetConvar("theme:dark:muted", "${theme.muted()}"), radius = GetConvar("theme:dark:radius", "${radius}"), font = GetConvar("theme:dark:font", "${font}"), headerFont = GetConvar("theme:dark:headerFont", "${headerFont}"), shadow = GetConvar("theme:dark:shadow", "${shadow}"), btnShadow = GetConvar("theme:dark:btnShadow", "${btnShadow}") }
--   SendNUIMessage({ type = "setTheme", payload = { light = light, dark = dark } })
-- Light Mode
setr theme:light:accent "${accent}"
setr theme:light:bg "${theme.bg()}"
setr theme:light:panel "${theme.panel()}"
setr theme:light:surface "${theme.surface()}"
setr theme:light:border "${theme.border()}"
setr theme:light:fg "${theme.fg()}"
setr theme:light:muted "${theme.muted()}"
setr theme:light:radius "${radius}"
setr theme:light:font "${font}"
setr theme:light:headerFont "${headerFont}"
setr theme:light:shadow "${shadow}"
setr theme:light:btnShadow "${btnShadow}"

-- Dark Mode
setr theme:dark:accent "${accent}"
setr theme:dark:bg "${theme.bg()}"
setr theme:dark:panel "${theme.panel()}"
setr theme:dark:surface "${theme.surface()}"
setr theme:dark:border "${theme.border()}"
setr theme:dark:fg "${theme.fg()}"
setr theme:dark:muted "${theme.muted()}"
setr theme:dark:radius "${radius}"
setr theme:dark:font "${font}"
setr theme:dark:headerFont "${headerFont}"
setr theme:dark:shadow "${shadow}"
setr theme:dark:btnShadow "${btnShadow}"`;
  };

  const copyToClipboard = async () => {
    try {
      const content =
        exportTab() === 'css'
          ? generateCSS()
          : exportTab() === 'lua'
            ? generateLua()
            : generateObject();
      await navigator.clipboard.writeText(content);
      setHasCopied(true);
      const label = exportTab() === 'css' ? 'CSS' : exportTab() === 'lua' ? 'Lua' : 'Theme object';
      toast.success(`${label} copied!`);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div class="flex h-[calc(100vh-4rem)] overflow-hidden bg-bg animate-in fade-in duration-500">
      {/* Sidebar */}
      <aside class="w-80 border-r border-stroke bg-panel flex flex-col shrink-0 overflow-y-auto custom-scrollbar shadow-xl z-10">
        <div class="p-6 border-b border-stroke">
          <h2 class="text-lg font-bold flex items-center gap-2">
            <Palette size={18} class="text-primary" />
            Theme Architecture
          </h2>
          <p class="text-[11px] text-muted mt-1">Design system configuration.</p>
        </div>

        <div class="p-6 space-y-10 flex-1">
          {/* Style Presets */}
          <div class="space-y-4">
            <Label class="text-[10px] font-bold uppercase tracking-widest text-muted">
              Style Presets
            </Label>
            <div class="grid grid-cols-2 gap-2">
              <For each={Object.entries(STYLE_PRESETS)}>
                {([key, preset]) => (
                  <button
                    type="button"
                    onClick={() => theme.applyPreset(key as StylePreset)}
                    class={twMerge(
                      'flex flex-col items-start gap-0.5 px-3 py-2 rounded-md border text-left transition-all',
                      theme.style() === key
                        ? 'border-primary bg-primary/5 text-fg shadow-[0_0_0_1px_var(--primary-color)]'
                        : 'border-stroke bg-surface/50 text-muted hover:border-muted hover:text-fg',
                    )}
                  >
                    <span class="text-[10px] font-bold leading-tight">{preset.label}</span>
                    <span class="text-[9px] opacity-60 leading-tight">{preset.description}</span>
                  </button>
                )}
              </For>
            </div>
            <button
              type="button"
              onClick={() => theme.applyPreset('vega')}
              class="flex items-center gap-1.5 text-[10px] text-muted hover:text-fg transition-colors"
            >
              <RefreshCw size={10} />
              Reset
            </button>
          </div>

          {/* Color Palette */}
          <div class="space-y-4">
            <Label class="text-[10px] font-bold uppercase tracking-widest text-muted">
              Color Palette
            </Label>
            <div class="grid grid-cols-2 gap-2">
              <For each={COLOR_PRESETS}>
                {(preset) => (
                  <button
                    type="button"
                    onClick={() => applyColorPreset(preset)}
                    class={twMerge(
                      'flex items-center gap-2 px-3 py-2 rounded-md border text-[10px] font-bold transition-all text-left',
                      matchesColorPreset(preset)
                        ? 'border-primary bg-primary/5 text-fg shadow-[0_0_0_1px_var(--primary-color)]'
                        : 'border-stroke bg-surface/50 text-muted hover:border-muted hover:text-fg',
                    )}
                  >
                    <span
                      class="h-3 w-3 rounded-full shrink-0 border border-stroke"
                      style={{ 'background-color': preset.colors.fg }}
                    />
                    {preset.label}
                  </button>
                )}
              </For>
            </div>
          </div>

          {/* Individual Colour Controls */}
          <Collapsible class="space-y-4">
            <CollapsibleTrigger class="flex items-center gap-1.5 text-[10px] text-muted hover:text-fg transition-colors uppercase tracking-widest font-bold">
              <Palette size={10} />
              Custom Colors
              <span class="ml-2 px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider rounded-full border border-stroke bg-surface/60 text-muted">
                Editing: {theme.isDark() ? 'Dark' : 'Light'}
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent class="space-y-4">
              <div class="space-y-2">
                <Label class="text-[9px] font-bold uppercase text-muted">Background</Label>
                <ColorPicker value={theme.bg()} onChange={theme.setBg} />
              </div>
              <div class="space-y-2">
                <Label class="text-[9px] font-bold uppercase text-muted">Panel</Label>
                <ColorPicker value={theme.panel()} onChange={theme.setPanel} />
              </div>
              <div class="space-y-2">
                <Label class="text-[9px] font-bold uppercase text-muted">Surface</Label>
                <ColorPicker value={theme.surface()} onChange={theme.setSurface} />
              </div>
              <div class="space-y-2">
                <Label class="text-[9px] font-bold uppercase text-muted">Border</Label>
                <ColorPicker value={theme.border()} onChange={theme.setBorder} />
              </div>
              <div class="space-y-2">
                <Label class="text-[9px] font-bold uppercase text-muted">Foreground</Label>
                <ColorPicker value={theme.fg()} onChange={theme.setFg} />
              </div>
              <div class="space-y-2">
                <Label class="text-[9px] font-bold uppercase text-muted">Muted</Label>
                <ColorPicker value={theme.muted()} onChange={theme.setMuted} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Accent Color */}
          <div class="space-y-4">
            <Label class="text-[10px] font-bold uppercase tracking-widest text-muted">
              Primary Accent
            </Label>
            <ColorPicker value={theme.accentColor()} onChange={theme.setAccentColor} />
          </div>

          {/* Header Font */}
          <div class="space-y-4">
            <div class="flex items-center gap-2 text-muted">
              <Type size={14} />
              <Label class="text-[10px] font-bold uppercase tracking-widest">Header Font</Label>
            </div>
            <div class="grid grid-cols-3 gap-1.5">
              <For each={FONT_OPTIONS}>
                {(opt) => (
                  <button
                    type="button"
                    onClick={() => theme.setHeaderFont(opt.value)}
                    class={twMerge(
                      'px-2 py-1.5 rounded-md border text-[10px] font-bold transition-all truncate',
                      theme.headerFont() === opt.value
                        ? 'border-primary bg-primary/5 text-fg shadow-[0_0_0_1px_var(--primary-color)]'
                        : 'border-stroke bg-surface/50 text-muted hover:border-muted hover:text-fg',
                    )}
                    style={{ 'font-family': opt.family }}
                  >
                    {opt.label}
                  </button>
                )}
              </For>
            </div>
          </div>

          {/* Body Font */}
          <div class="space-y-4">
            <div class="flex items-center gap-2 text-muted">
              <Type size={14} />
              <Label class="text-[10px] font-bold uppercase tracking-widest">Body Font</Label>
            </div>
            <div class="grid grid-cols-3 gap-1.5">
              <For each={FONT_OPTIONS}>
                {(opt) => (
                  <button
                    type="button"
                    onClick={() => theme.setBodyFont(opt.value)}
                    class={twMerge(
                      'px-2 py-1.5 rounded-md border text-[10px] font-bold transition-all truncate',
                      theme.bodyFont() === opt.value
                        ? 'border-primary bg-primary/5 text-fg shadow-[0_0_0_1px_var(--primary-color)]'
                        : 'border-stroke bg-surface/50 text-muted hover:border-muted hover:text-fg',
                    )}
                    style={{ 'font-family': opt.family }}
                  >
                    {opt.label}
                  </button>
                )}
              </For>
            </div>
          </div>

          {/* Effects */}
          <div class="space-y-8 pt-6 border-t border-stroke/50">
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-muted">
                <MousePointer2 size={14} />
                <Label class="text-[10px] font-bold uppercase tracking-widest">Rounding</Label>
              </div>
              <div class="grid grid-cols-5 gap-1 bg-surface p-1 rounded-md border border-stroke">
                <For each={RADIUS_OPTIONS}>
                  {(opt) => (
                    <button
                      type="button"
                      onClick={() => theme.setRadius(opt.value)}
                      class={twMerge(
                        'py-1.5 rounded text-[10px] font-mono transition-all',
                        theme.radius() === opt.value
                          ? 'bg-panel text-fg shadow-sm font-bold'
                          : 'text-muted hover:text-fg',
                      )}
                    >
                      {opt.label}
                    </button>
                  )}
                </For>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-2 text-muted">
                <Layers size={14} />
                <Label class="text-[10px] font-bold uppercase tracking-widest">Panel Shadow</Label>
              </div>
              <div class="grid grid-cols-3 gap-1">
                <For each={SHADOW_OPTIONS}>
                  {(opt) => (
                    <button
                      type="button"
                      onClick={() => theme.setShadow(opt.value)}
                      class={twMerge(
                        'py-1.5 rounded border text-[10px] font-bold transition-all truncate',
                        theme.shadow() === opt.value
                          ? 'border-primary bg-primary/5 text-fg shadow-[0_0_0_1px_var(--primary-color)]'
                          : 'border-stroke bg-surface/50 text-muted hover:border-muted hover:text-fg',
                      )}
                    >
                      {opt.label}
                    </button>
                  )}
                </For>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-2 text-muted">
                <MousePointer2 size={14} />
                <Label class="text-[10px] font-bold uppercase tracking-widest">Button Shadow</Label>
              </div>
              <div class="grid grid-cols-4 gap-1">
                <For each={SHADOW_OPTIONS}>
                  {(opt) => (
                    <button
                      type="button"
                      onClick={() => theme.setBtnShadow(opt.value)}
                      class={twMerge(
                        'py-1.5 rounded border text-[10px] font-bold transition-all truncate',
                        theme.btnShadow() === opt.value
                          ? 'border-primary bg-primary/5 text-fg shadow-[0_0_0_1px_var(--primary-color)]'
                          : 'border-stroke bg-surface/50 text-muted hover:border-muted hover:text-fg',
                      )}
                    >
                      {opt.label}
                    </button>
                  )}
                </For>
              </div>
            </div>

            <div class="space-y-3">
              <Label class="text-[10px] font-bold uppercase tracking-widest text-muted">
                Appearance
              </Label>
              <div class="grid grid-cols-2 gap-2">
                <Button
                  variant={!theme.isDark() ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => theme.setIsDark(false)}
                  class="h-8 text-[10px] font-bold"
                >
                  Light
                </Button>
                <Button
                  variant={theme.isDark() ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => theme.setIsDark(true)}
                  class="h-8 text-[10px] font-bold"
                >
                  Dark
                </Button>
              </div>
              <button
                type="button"
                onClick={() => {
                  theme.setTheme({
                    dark: {
                      bg: toDark(theme.bg()),
                      panel: toDark(theme.panel()),
                      surface: toDark(theme.surface()),
                      border: toDark(theme.border()),
                      fg: toDark(theme.fg()),
                      muted: toDark(theme.muted()),
                    },
                  });
                }}
                class="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-md border border-stroke bg-surface/50 text-[9px] font-bold text-muted hover:text-fg hover:border-muted transition-all"
              >
                Copy Light Colors to Dark
              </button>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-stroke bg-surface/30">
          <Button
            class="w-full gap-2 text-xs font-black uppercase tracking-tighter"
            size="sm"
            onClick={() => setShowExport(true)}
          >
            <DownloadCloud size={14} /> Get Snippet
          </Button>
        </div>
      </aside>

      {/* Preview Workspace */}
      <main
        data-style={theme.style()}
        class="flex-1 overflow-y-auto bg-bg custom-scrollbar relative"
        style={{ 'font-family': 'var(--sans-main)' }}
      >
        <div class="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <div class="relative max-w-6xl mx-auto p-12 space-y-12">
          {/* Header */}
          <div class="space-y-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Infrastructure</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Clusters</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span class="font-bold">starling-production-01</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div class="flex items-end justify-between border-b-4 border-stroke pb-8">
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <Avatar class="h-12 w-12 border-2 border-stroke">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
                      alt="JD"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div class="flex -space-x-3">
                    <Avatar class="h-8 w-8 border-2 border-bg">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                        alt="AS"
                      />
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <Avatar class="h-8 w-8 border-2 border-bg">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop"
                        alt="ML"
                      />
                      <AvatarFallback>ML</AvatarFallback>
                    </Avatar>
                    <div class="h-8 w-8 rounded-full bg-surface border-2 border-bg flex items-center justify-center text-[10px] font-bold">
                      +5
                    </div>
                  </div>
                </div>
                <div class="space-y-2">
                  <Badge variant="primary" class="font-black px-3 py-1">
                    V2.1.2 STABLE
                  </Badge>
                  <h1
                    class="text-5xl font-black tracking-tighter uppercase leading-none"
                    style={{ 'font-family': 'var(--display-main)' }}
                  >
                    Global Preview
                  </h1>
                </div>
              </div>
              <div class="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  class="h-10 px-6 font-bold"
                  style={{ 'box-shadow': 'var(--shadow-btn)' }}
                >
                  Documentation
                </Button>
                <Button
                  size="sm"
                  class="h-10 px-6 font-bold"
                  style={{ 'box-shadow': 'var(--shadow-btn)' }}
                >
                  Live API
                </Button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div class="lg:col-span-8 space-y-10">
              <div class="grid grid-cols-3 gap-6">
                <Card class="border-2 border-stroke" style={{ 'box-shadow': 'var(--shadow-main)' }}>
                  <CardHeader class="pb-2">
                    <CardTitle class="text-[10px] font-black uppercase text-muted">
                      Traffic
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-4xl font-black tabular-nums">482K</div>
                    <p class="text-[10px] text-positive font-bold mt-1">+24% ↑</p>
                  </CardContent>
                </Card>
                <Card class="border-2 border-stroke" style={{ 'box-shadow': 'var(--shadow-main)' }}>
                  <CardHeader class="pb-2">
                    <CardTitle class="text-[10px] font-black uppercase text-muted">
                      Uptime
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-4xl font-black tabular-nums">99.9%</div>
                    <p class="text-[10px] text-primary font-bold mt-1">Critical sync active</p>
                  </CardContent>
                </Card>
                <Card class="border-2 border-stroke" style={{ 'box-shadow': 'var(--shadow-main)' }}>
                  <CardHeader class="pb-2">
                    <CardTitle class="text-[10px] font-black uppercase text-muted">
                      Servers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-4xl font-black tabular-nums">12</div>
                    <p class="text-[10px] text-muted font-bold mt-1">All regions healthy</p>
                  </CardContent>
                </Card>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <Card class="border-2 border-stroke" style={{ 'box-shadow': 'var(--shadow-main)' }}>
                  <CardHeader class="pb-4">
                    <div class="flex items-center justify-between">
                      <CardTitle class="text-[10px] font-black uppercase text-muted">
                        Core 01
                      </CardTitle>
                      <Badge variant="success">Primary</Badge>
                    </div>
                  </CardHeader>
                  <CardContent class="space-y-4">
                    <div class="space-y-2">
                      <Skeleton class="h-4 w-full border border-stroke" />
                      <Skeleton class="h-4 w-[80%] border border-stroke" />
                    </div>
                    <div class="flex items-center justify-between pt-2">
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold uppercase">Encrypted</span>
                        <Tooltip align="top">
                          <TooltipTrigger>
                            <Info size={10} class="text-primary cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>AES-256 Bit Encryption Active</TooltipContent>
                        </Tooltip>
                      </div>
                      <Switch checked />
                    </div>
                  </CardContent>
                </Card>
                <Card class="border-2 border-stroke" style={{ 'box-shadow': 'var(--shadow-main)' }}>
                  <CardHeader class="pb-4">
                    <CardTitle class="text-[10px] font-black uppercase text-muted">
                      Cluster Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent class="flex flex-col items-center justify-center py-6 space-y-4">
                    <p class="text-[10px] font-bold text-center">
                      Node synchronization in progress.
                    </p>
                    <Popover align="bottom">
                      <PopoverTrigger>
                        <Button size="sm" variant="outline" class="h-8 text-[10px] font-bold">
                          View Details
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="w-64 p-4 border-2 border-stroke bg-panel shadow-xl">
                        <h4 class="text-xs font-black uppercase mb-2">Active Syncs</h4>
                        <div class="space-y-2">
                          <div class="flex items-center justify-between text-[9px] font-bold">
                            <span>Global-Edge-01</span>
                            <Badge variant="success" class="text-[8px]">
                              Syncing
                            </Badge>
                          </div>
                          <div class="flex items-center justify-between text-[9px] font-bold">
                            <span>Global-Edge-02</span>
                            <Badge variant="warning" class="text-[8px]">
                              Pending
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" class="w-full mt-4 h-7 text-[9px] font-bold">
                          Restart Sync
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                </Card>
              </div>

              <Card
                class="border-2 border-stroke overflow-hidden"
                style={{ 'box-shadow': 'var(--shadow-main)' }}
              >
                <CardHeader class="border-b-2 border-stroke flex flex-row items-center justify-between pb-4">
                  <div class="space-y-1">
                    <CardTitle
                      class="text-xl font-black uppercase"
                      style={{ 'font-family': 'var(--display-main)' }}
                    >
                      Infrastructure Log
                    </CardTitle>
                    <CardDescription class="text-xs font-bold">
                      Real-time system telemetry and events.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" class="rounded-none border-2 border-stroke">
                    <MoreHorizontal size={16} />
                  </Button>
                </CardHeader>
                <CardContent class="p-0">
                  <Table>
                    <TableHeader class="bg-surface">
                      <TableRow class="border-b-2 border-stroke">
                        <TableHead class="pl-6 font-black uppercase text-[10px]">
                          Event Source
                        </TableHead>
                        <TableHead class="font-black uppercase text-[10px]">Severity</TableHead>
                        <TableHead class="pr-6 text-right font-black uppercase text-[10px]">
                          Load
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow class="border-b border-stroke/50 font-bold">
                        <TableCell class="pl-6 py-4">
                          <div class="flex items-center gap-2">
                            Auth Service Cluster<Kbd class="text-[9px] px-1 border-stroke">⌘A</Kbd>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">Healthy</Badge>
                        </TableCell>
                        <TableCell class="pr-6 text-right font-mono text-xs font-bold text-primary">
                          0.12ms
                        </TableCell>
                      </TableRow>
                      <TableRow class="border-b border-stroke/50 font-bold">
                        <TableCell class="pl-6 py-4">
                          <div class="flex items-center gap-2">
                            Database Replica 04<Kbd class="text-[9px] px-1 border-stroke">⌘D</Kbd>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="primary">Syncing</Badge>
                        </TableCell>
                        <TableCell class="pr-6 text-right font-mono text-xs font-bold text-primary">
                          42.8ms
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div class="flex flex-col gap-6 items-center">
                <div class="flex gap-4 items-center">
                  <Label class="text-[10px] font-black uppercase text-muted">View Mode:</Label>
                  <SegmentedControl
                    options={[
                      { label: 'Real-time', value: 'rt' },
                      { label: 'Historical', value: 'hist' },
                      { label: 'Predicted', value: 'pred' },
                    ]}
                    value="rt"
                    onChange={() => {}}
                    class="border-2 border-stroke"
                  />
                </div>
                <Tabs defaultValue="overview" class="w-full max-w-md">
                  <TabsList class="grid grid-cols-3 border-2 border-stroke p-1 bg-surface rounded-none">
                    <TabsTrigger value="overview" class="text-[10px] font-black uppercase">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="security" class="text-[10px] font-black uppercase">
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="nodes" class="text-[10px] font-black uppercase">
                      Nodes
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div class="space-y-6 pt-10 border-t-4 border-stroke">
                <h2
                  class="text-3xl font-black tracking-tighter uppercase"
                  style={{ 'font-family': 'var(--display-main)' }}
                >
                  Status Monitor
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert variant="success" class="border-2 border-stroke rounded-none">
                    <AlertTitle class="font-black uppercase text-[10px]">
                      Backups Completed
                    </AlertTitle>
                    <AlertDescription class="text-[10px] font-bold">
                      All encrypted volumes synced to secondary regions.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="warning" class="border-2 border-stroke rounded-none">
                    <AlertTitle class="font-black uppercase text-[10px]">
                      API Latency Spike
                    </AlertTitle>
                    <AlertDescription class="text-[10px] font-bold">
                      Inbound request threshold exceeded in EU-WEST-1.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="error" class="border-2 border-stroke rounded-none">
                    <AlertTitle class="font-black uppercase text-[10px]">
                      Core Protocol Failure
                    </AlertTitle>
                    <AlertDescription class="text-[10px] font-bold">
                      Critical error detected in synchronization logic.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="info" class="border-2 border-stroke rounded-none">
                    <AlertTitle class="font-black uppercase text-[10px]">
                      Maintenance Window
                    </AlertTitle>
                    <AlertDescription class="text-[10px] font-bold">
                      Scheduled updates starting at 02:00 UTC.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>

            <div class="lg:col-span-4 space-y-10">
              <Card
                class="border-2 border-stroke bg-panel"
                style={{ 'box-shadow': 'var(--shadow-main)' }}
              >
                <CardHeader class="border-b-2 border-stroke">
                  <CardTitle
                    class="text-lg font-black uppercase"
                    style={{ 'font-family': 'var(--display-main)' }}
                  >
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent class="space-y-6 pt-6">
                  <div class="space-y-2">
                    <Label class="text-[10px] font-black uppercase text-muted flex items-center gap-1.5">
                      Cluster Identifier
                      <HoverCard>
                        <HoverCardTrigger>
                          <Info size={10} class="text-primary cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent class="w-64 p-3 text-[10px] font-bold">
                          The unique alphanumeric string used to route internal traffic.
                        </HoverCardContent>
                      </HoverCard>
                    </Label>
                    <Input
                      value="starling-production-01"
                      class="border-2 border-stroke rounded-none font-mono"
                    />
                  </div>
                  <div class="space-y-2">
                    <Label class="text-[10px] font-black uppercase text-muted">
                      Activation Date
                    </Label>
                    <DatePicker
                      value={new Date()}
                      onChange={() => {}}
                      class="border-2 border-stroke rounded-none font-mono"
                    />
                  </div>
                  <Separator class="bg-stroke" />
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-black uppercase">Network Load</span>
                      <span class="text-[10px] font-mono font-bold text-primary">65%</span>
                    </div>
                    <Progress
                      value={65}
                      class="h-2 border border-stroke rounded-none overflow-hidden"
                    />
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <Label class="text-[10px] font-black uppercase text-muted">
                        Scaling Threshold
                      </Label>
                      <span class="text-[10px] font-mono font-bold">{sliderVal()}%</span>
                    </div>
                    <Slider value={sliderVal()} max={100} step={1} onChange={setSliderVal} />
                  </div>
                  <div class="space-y-4 pt-2">
                    <div class="flex items-center space-x-2">
                      <Checkbox id="stealth" checked />
                      <Label for="stealth" class="text-[10px] font-black uppercase leading-none">
                        Stealth Protocol
                      </Label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Checkbox id="backup" />
                      <Label for="backup" class="text-[10px] font-black uppercase leading-none">
                        Auto-Backup
                      </Label>
                    </div>
                  </div>
                  <Separator class="bg-stroke" />
                  <div class="space-y-3">
                    <Label class="text-[10px] font-black uppercase">Region Selection</Label>
                    <RadioGroup value={region()} name="region" onChange={setRegion}>
                      <div class="flex items-center gap-2">
                        <RadioGroupItem value="us-east" id="r1" />
                        <Label for="r1" class="text-[10px] font-bold">
                          US-EAST
                        </Label>
                      </div>
                      <div class="flex items-center gap-2">
                        <RadioGroupItem value="eu-west" id="r2" />
                        <Label for="r2" class="text-[10px] font-bold">
                          EU-WEST
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Accordion multiple class="border-t border-stroke">
                    <AccordionItem value="details" class="border-b border-stroke">
                      <AccordionTrigger class="text-[10px] font-black uppercase py-3">
                        Advanced Parameters
                      </AccordionTrigger>
                      <AccordionContent class="pb-4 text-[10px] font-bold text-muted">
                        Encryption levels and proxy rotation settings are managed automatically.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button
                    class="w-full h-12 font-black uppercase tracking-widest border-2 border-stroke"
                    style={{ 'box-shadow': 'var(--shadow-btn)' }}
                  >
                    Commit Changes
                  </Button>
                </CardFooter>
              </Card>
              <Alert
                variant="warning"
                class="border-2 border-stroke bg-yellow-400/10 text-fg rounded-none"
              >
                <AlertTitle
                  class="font-black uppercase text-[11px]"
                  style={{ 'font-family': 'var(--display-main)' }}
                >
                  System Warning
                </AlertTitle>
                <AlertDescription class="text-[10px] font-bold">
                  Unsaved changes will be lost on cluster reboot.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      <Modal isOpen={showExport()} onClose={() => setShowExport(false)} class="max-w-2xl">
        <ModalHeader>
          <ModalTitle class="font-black uppercase">Architecture Export</ModalTitle>
          <ModalDescription class="font-bold">
            Copy the configuration for your preferred integration method.
          </ModalDescription>
        </ModalHeader>
        <ModalContent class="mt-4 space-y-4">
          <Tabs value={exportTab()} onChange={(v) => setExportTab(v as string)}>
            <TabsList class="grid grid-cols-3 border-2 border-stroke p-1 bg-surface rounded-none h-10">
              <TabsTrigger value="css" class="text-[10px] font-black uppercase">
                CSS Variables
              </TabsTrigger>
              <TabsTrigger value="json" class="text-[10px] font-black uppercase">
                Theme Object
              </TabsTrigger>
              <TabsTrigger value="lua" class="text-[10px] font-black uppercase">
                SETR Config
              </TabsTrigger>
            </TabsList>
            <div class="mt-4">
              <TabsContent value="css">
                <Code code={generateCSS()} language="css" fileName="theme.css" />
              </TabsContent>
              <TabsContent value="json">
                <Code code={generateObject()} language="json" fileName="theme.json" />
              </TabsContent>
              <TabsContent value="lua">
                <Code code={generateLua()} language="lua" fileName="theme.lua" />
              </TabsContent>
            </div>
          </Tabs>
        </ModalContent>
        <ModalFooter>
          <Button variant="outline" class="font-bold" onClick={() => setShowExport(false)}>
            Close
          </Button>
          <Button onClick={copyToClipboard} class="gap-2 min-w-[140px] font-black uppercase">
            <Show
              when={hasCopied()}
              fallback={
                <>
                  <Copy size={16} /> Copy{' '}
                  {exportTab() === 'css' ? 'CSS' : exportTab() === 'lua' ? 'Lua' : 'Object'}
                </>
              }
            >
              <>
                <Check size={16} /> Copied
              </>
            </Show>
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
