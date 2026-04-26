import {
  CalendarDays,
  Check,
  ChevronRight,
  Contrast,
  Copy,
  Download,
  DownloadCloud,
  Filter,
  Ghost,
  Layers,
  Mail,
  Moon,
  MoreHorizontal,
  MousePointer2,
  Palette,
  Plus,
  RefreshCw,
  Scroll,
  Search,
  Settings,
  Settings2,
  Sun,
  Trees,
  Type,
  Waves,
  X,
  Zap,
} from 'lucide-solid';
import { For, Show, createSignal } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import {
  BASE_PALETTES,
  type BaseColor,
  FONTS,
  SHADOWS,
  type ShadowLevel,
  type ThemeFont,
  hexToRgb,
  useTheme,
} from '../../../lib/hooks/useTheme';
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
import { Popover, PopoverTrigger, PopoverContent } from '../../../lib/ui/Popover';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../lib/ui/Tooltip';
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

const BASE_COLORS: { name: string; value: BaseColor; icon: any }[] = [
  { name: 'Pure', value: 'pure', icon: Palette },
  { name: 'Zinc', value: 'zinc', icon: Palette },
  { name: 'Slate', value: 'slate', icon: Palette },
  { name: 'Stone', value: 'stone', icon: Palette },
  { name: 'Crimson', value: 'crimson', icon: Palette },
  { name: 'Ocean', value: 'ocean', icon: Waves },
  { name: 'Forest', value: 'forest', icon: Trees },
  { name: 'Vintage', value: 'vintage', icon: Scroll },
  { name: 'OLED', value: 'oled', icon: Ghost },
  { name: 'Brutalist', value: 'brutalist', icon: Contrast },
];

const RADIUS_OPTIONS = [
  { label: '0', value: '0px' },
  { label: '0.3', value: '0.3rem' },
  { label: '0.5', value: '0.5rem' },
  { label: '0.75', value: '0.75rem' },
  { label: '1.0', value: '1.0rem' },
];

const SHADOW_OPTIONS: { label: string; value: ShadowLevel }[] = [
  { label: 'None', value: 'none' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'Neo', value: 'neo' },
  { label: 'Flat', value: 'flat' },
  { label: 'Hard', value: 'hard' },
];

const FONT_OPTIONS: { label: string; value: ThemeFont; family: string }[] = [
  { label: 'Sans', value: 'sans', family: '"Inter"' },
  { label: 'Mono', value: 'mono', family: '"JetBrains Mono"' },
  { label: 'Serif', value: 'serif', family: '"Playfair Display"' },
  { label: 'Display', value: 'display', family: '"Archivo Black"' },
  { label: 'Modern', value: 'modern', family: '"Space Grotesk"' },
  { label: 'Reading', value: 'reading', family: '"Lexend"' },
  { label: 'Geometric', value: 'geometric', family: '"Outfit"' },
  { label: 'Condensed', value: 'condensed', family: '"Bebas Neue"' },
  { label: 'Soft Serif', value: 'soft-serif', family: '"Fraunces"' },
  { label: 'System', value: 'system', family: 'system-ui' },
];

export const ThemeCreator = () => {
  const theme = useTheme();
  const [showExport, setShowExport] = createSignal(false);
  const [hasCopied, setHasCopied] = createSignal(false);
  const [sliderVal, setSliderVal] = createSignal([45]);

  const generateCSS = () => {
    const light = BASE_PALETTES[theme.baseColor()].light;
    const dark = BASE_PALETTES[theme.baseColor()].dark;
    const primaryColor = theme.accentColor();
    const primaryRgb = hexToRgb(primaryColor);

    return `:root {
    --primary-color: ${primaryColor};
    --primary-rgb: ${primaryRgb};

    --bg-main: ${light.bg};
    --bg-panel: ${light.panel};
    --bg-surface: ${light.surface};

    --fg-main: ${light.fg};
    --text-muted: ${light.muted};

    --border-main: ${light.border};
    --stroke: ${light.border};

    --ring-main: rgba(0, 0, 0, 0.05);
    --glass-border: rgba(0, 0, 0, 0.06);

    --radius: ${theme.radius()};
    --shadow-main: ${SHADOWS[theme.shadow()]};
    --shadow-btn: ${SHADOWS[theme.btnBoxShadow()]};
    --sans-main: ${FONTS[theme.bodyFont()]};
    --display-main: ${FONTS[theme.headerFont()]};
    --mono-main: ${FONTS.mono};

    color-scheme: light;
  }

  .dark {
    --primary-rgb: ${primaryRgb};
    --bg-main: ${dark.bg};
    --bg-panel: ${dark.panel};
    --bg-surface: ${dark.surface};
    --fg-main: ${dark.fg};
    --text-muted: ${dark.muted};
    --border-main: ${dark.border};
    --stroke: ${dark.border};
    --ring-main: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.05);
    color-scheme: dark;
  }`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS());
      setHasCopied(true);
      toast.success('CSS copied!');
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
            <Settings2 size={18} class="text-primary" />
            Theme Architecture
          </h2>
          <p class="text-[11px] text-muted mt-1">Design system configuration.</p>
        </div>

        <div class="p-6 space-y-10 flex-1">
          {/* Base Palette */}
          <div class="space-y-4">
            <Label class="text-[10px] font-bold uppercase tracking-widest text-muted">
              Base Palette
            </Label>
            <div class="grid grid-cols-2 gap-2">
              <For each={BASE_COLORS}>
                {(color) => (
                  <button
                    onClick={() => theme.setBaseColor(color.value)}
                    class={twMerge(
                      'flex items-center gap-2 px-3 py-2 rounded-md border text-[10px] font-bold transition-all text-left',
                      theme.baseColor() === color.value
                        ? 'border-primary bg-primary/5 text-fg shadow-[0_0_0_1px_var(--primary-color)]'
                        : 'border-stroke bg-surface/50 text-muted hover:border-muted hover:text-fg',
                    )}
                  >
                    <color.icon
                      size={12}
                      class={theme.baseColor() === color.value ? 'text-primary' : ''}
                    />
                    {color.name}
                  </button>
                )}
              </For>
            </div>
          </div>

          {/* Accent Color */}
          <div class="space-y-4">
            <Label class="text-[10px] font-bold uppercase tracking-widest text-muted">
              Primary Accent
            </Label>
            <ColorPicker value={theme.accentColor()} onValueChange={theme.setAccentColor} />
          </div>

          {/* Typography - Header */}
          <div class="space-y-4">
            <div class="flex items-center gap-2 text-muted">
              <Type size={14} />
              <Label class="text-[10px] font-bold uppercase tracking-widest">Header Font</Label>
            </div>
            <div class="grid grid-cols-3 gap-1.5">
              <For each={FONT_OPTIONS}>
                {(opt) => (
                  <button
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

          {/* Typography - Body */}
          <div class="space-y-4">
            <div class="flex items-center gap-2 text-muted">
              <Type size={14} />
              <Label class="text-[10px] font-bold uppercase tracking-widest">Body Font</Label>
            </div>
            <div class="grid grid-cols-3 gap-1.5">
              <For each={FONT_OPTIONS}>
                {(opt) => (
                  <button
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
                <Label class="text-[10px] font-bold uppercase tracking-widest">Global Depth</Label>
              </div>
              <div class="grid grid-cols-3 gap-1">
                <For each={SHADOW_OPTIONS}>
                  {(opt) => (
                    <button
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
                      onClick={() => theme.setBtnBoxShadow(opt.value)}
                      class={twMerge(
                        'py-1.5 rounded border text-[10px] font-bold transition-all truncate',
                        theme.btnBoxShadow() === opt.value
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
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-stroke bg-surface/30 space-y-3">
          <Button
            class="w-full gap-2 text-xs font-black uppercase tracking-tighter"
            size="sm"
            onClick={() => setShowExport(true)}
          >
            <DownloadCloud size={14} /> Get Snippet
          </Button>
          <button
            class="w-full text-[10px] font-bold text-muted hover:text-primary transition-colors flex items-center justify-center gap-1.5"
            onClick={() => {
              theme.setAccentColor('#e11d48');
              theme.setRadius('0.5rem');
              theme.setHeaderFont('display');
              theme.setBodyFont('sans');
              theme.setBaseColor('pure');
              theme.setShadow('sm');
              theme.setBtnBoxShadow('none');
              toast.info('Restored');
            }}
          >
            <RefreshCw size={10} /> Reset
          </button>
        </div>
      </aside>

      {/* Preview Workspace */}
      <main
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

            <div class="flex items-end justify-between border-b-4 border-fg pb-8">
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <Avatar class="h-12 w-12 border-2 border-fg">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div class="flex -space-x-3">
                    <Avatar class="h-8 w-8 border-2 border-bg">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" />
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <Avatar class="h-8 w-8 border-2 border-bg">
                      <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop" />
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
                <Card class="border-2 border-fg" style={{ 'box-shadow': 'var(--shadow-main)' }}>
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
                <Card class="border-2 border-fg" style={{ 'box-shadow': 'var(--shadow-main)' }}>
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
                <Card class="border-2 border-fg" style={{ 'box-shadow': 'var(--shadow-main)' }}>
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
                <Card class="border-2 border-fg" style={{ "box-shadow": "var(--shadow-main)" }}>
                   <CardHeader class="pb-4">
                     <div class="flex items-center justify-between">
                       <CardTitle class="text-[10px] font-black uppercase text-muted">Core 01</CardTitle>
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
                            <TooltipTrigger><Plus size={10} class="text-primary cursor-help" /></TooltipTrigger>
                            <TooltipContent>AES-256 Bit Encryption Active</TooltipContent>
                          </Tooltip>
                        </div>
                        <Switch checked />
                     </div>
                   </CardContent>
                </Card>
                
                <Card class="border-2 border-fg" style={{ "box-shadow": "var(--shadow-main)" }}>
                  <CardHeader class="pb-4">
                    <CardTitle class="text-[10px] font-black uppercase text-muted">Cluster Activity</CardTitle>
                  </CardHeader>
                  <CardContent class="flex flex-col items-center justify-center py-6 space-y-4">
                     <p class="text-[10px] font-bold text-center">Node synchronization in progress.</p>
                     <Popover align="bottom">
                        <PopoverTrigger>
                           <Button size="sm" variant="outline" class="h-8 text-[10px] font-bold">View Details</Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-64 p-4 border-2 border-fg bg-panel shadow-xl">
                           <h4 class="text-xs font-black uppercase mb-2">Active Syncs</h4>
                           <div class="space-y-2">
                              <div class="flex items-center justify-between text-[9px] font-bold">
                                 <span>Global-Edge-01</span>
                                 <Badge variant="success" class="text-[8px]">Syncing</Badge>
                              </div>
                              <div class="flex items-center justify-between text-[9px] font-bold">
                                 <span>Global-Edge-02</span>
                                 <Badge variant="warning" class="text-[8px]">Pending</Badge>
                              </div>
                           </div>
                           <Button size="sm" class="w-full mt-4 h-7 text-[9px] font-bold">Restart Sync</Button>
                        </PopoverContent>
                     </Popover>
                  </CardContent>
                </Card>
              </div>

              <Card
                class="border-2 border-fg overflow-hidden"
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
                  <Button variant="ghost" size="icon" class="rounded-none border-2 border-fg">
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
                            Auth Service Cluster
                            <Kbd class="text-[9px] px-1 border-stroke">⌘A</Kbd>
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
                            Database Replica 04
                            <Kbd class="text-[9px] px-1 border-stroke">⌘D</Kbd>
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
                    class="border-2 border-fg"
                  />
                </div>

                <Tabs defaultValue="overview" class="w-full max-w-md">
                  <TabsList class="grid grid-cols-3 border-2 border-fg p-1 bg-surface rounded-none">
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

              <div class="space-y-6 pt-10 border-t-4 border-fg">
                <h2
                  class="text-3xl font-black tracking-tighter uppercase"
                  style={{ 'font-family': 'var(--display-main)' }}
                >
                  Status Monitor
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert variant="success" class="border-2 border-fg rounded-none">
                    <AlertTitle class="font-black uppercase text-[10px]">
                      Backups Completed
                    </AlertTitle>
                    <AlertDescription class="text-[10px] font-bold">
                      All encrypted volumes synced to secondary regions.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="warning" class="border-2 border-fg rounded-none">
                    <AlertTitle class="font-black uppercase text-[10px]">
                      API Latency Spike
                    </AlertTitle>
                    <AlertDescription class="text-[10px] font-bold">
                      Inbound request threshold exceeded in EU-WEST-1.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="error" class="border-2 border-fg rounded-none">
                    <AlertTitle class="font-black uppercase text-[10px]">
                      Core Protocol Failure
                    </AlertTitle>
                    <AlertDescription class="text-[10px] font-bold">
                      Critical error detected in synchronization logic.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="default" class="border-2 border-fg rounded-none">
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
                class="border-2 border-fg bg-panel"
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
                          <Search size={10} class="text-primary cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent class="w-64 p-3 text-[10px] font-bold">
                          The unique alphanumeric string used to route internal traffic to this
                          specific node.
                        </HoverCardContent>
                      </HoverCard>
                    </Label>
                    <Input
                      value="starling-production-01"
                      class="border-2 border-fg rounded-none font-mono"
                    />
                  </div>

                  <div class="space-y-2">
                    <Label class="text-[10px] font-black uppercase text-muted">
                      Activation Date
                    </Label>
                    <DatePicker
                      value={new Date()}
                      onValueChange={() => {}}
                      class="border-2 border-fg rounded-none font-mono"
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
                      class="h-2 border border-fg rounded-none overflow-hidden"
                    />
                  </div>

                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <Label class="text-[10px] font-black uppercase text-muted">
                        Scaling Threshold
                      </Label>
                      <span class="text-[10px] font-mono font-bold">{sliderVal()[0]}%</span>
                    </div>
                    <Slider value={sliderVal()} max={100} step={1} onValueChange={setSliderVal} />
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
                    <RadioGroup defaultValue="us-east" name="region" onValueChange={() => {}}>
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

                  <Separator class="bg-stroke" />

                  <Accordion multiple class="border-t border-stroke">
                    <AccordionItem value="details" class="border-b border-stroke">
                      <AccordionTrigger class="text-[10px] font-black uppercase py-3">
                        Advanced Parameters
                      </AccordionTrigger>
                      <AccordionContent class="pb-4 text-[10px] font-bold text-muted">
                        Encryption levels and proxy rotation settings are managed automatically by
                        the core cluster.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button
                    class="w-full h-12 font-black uppercase tracking-widest border-2 border-fg"
                    style={{ 'box-shadow': 'var(--shadow-btn)' }}
                  >
                    Commit Changes
                  </Button>
                </CardFooter>
              </Card>

              <Alert
                variant="warning"
                class="border-2 border-fg bg-yellow-400/10 text-fg rounded-none"
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
      <Modal isOpen={showExport()} onClose={() => setShowExport(false)}>
        <ModalHeader>
          <ModalTitle class="font-black uppercase">Architecture Export</ModalTitle>
          <ModalDescription class="font-bold">Inject these variables into your global root.</ModalDescription>
        </ModalHeader>
        <ModalContent class="mt-4">
          <Code code={generateCSS()} language="css" fileName="theme.css" />
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
                  <Copy size={16} /> Copy CSS
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
