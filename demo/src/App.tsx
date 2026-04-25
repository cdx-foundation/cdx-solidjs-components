import { Cat, ChevronRight, Cpu, Menu, Palette, Search, Shield, Sparkles, Zap } from 'lucide-solid';
import { createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { twMerge } from 'tailwind-merge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../lib/ui/Accordion';
import { Alert, AlertDescription, AlertTitle } from '../../lib/ui/Alert';
import { AspectRatio } from '../../lib/ui/AspectRatio';
import { Avatar, AvatarFallback, AvatarImage } from '../../lib/ui/Avatar';
import { Badge } from '../../lib/ui/Badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../lib/ui/Breadcrumb';
import { Button } from '../../lib/ui/Button';
import { Calendar } from '../../lib/ui/Calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../lib/ui/Card';
import { Code } from '../../lib/ui/Code';
import { Command, CommandGroup, CommandItem } from '../../lib/ui/Command';
import { HoverCard } from '../../lib/ui/HoverCard';
import { Input } from '../../lib/ui/Input';
import { Kbd } from '../../lib/ui/Kbd';
import { Label } from '../../lib/ui/Label';
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '../../lib/ui/Modal';
import { Popover } from '../../lib/ui/Popover';
import { Progress } from '../../lib/ui/Progress';
import { ScrollArea } from '../../lib/ui/ScrollArea';
import { SegmentedControl } from '../../lib/ui/SegmentedControl';
import { Select } from '../../lib/ui/Select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../../lib/ui/Sheet';
import { Skeleton } from '../../lib/ui/Skeleton';
import { Slider } from '../../lib/ui/Slider';
import { Switch } from '../../lib/ui/Switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../lib/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../lib/ui/Tabs';
import { Toaster, type ToasterPosition, toast } from '../../lib/ui/Toast';
import { Tooltip } from '../../lib/ui/Tooltip';

type Section =
  | 'intro'
  | 'get-started'
  | 'theming'
  | 'layout'
  | 'forms'
  | 'nav'
  | 'data'
  | 'feedback'
  | 'overlays'
  | 'disclosure'
  | 'utils';
type Theme = 'professional' | 'brutalist' | 'midnight';

export default function App() {
  const [activeSection, setActiveSection] = createSignal<Section>('intro');
  const [currentTheme, setCurrentTheme] = createSignal<Theme>('professional');
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [commandOpen, setCommandOpen] = createSignal(false);
  const [toastPos, setToastPos] = createSignal<ToasterPosition>('bottom-right');
  const [maxToasts, setMaxToasts] = createSignal(5);
  const [toastDuration, setToastDuration] = createSignal(4000);

  // Interaction States for demos
  const [sliderVal, setSliderVal] = createSignal(65);
  const [modalOpen, setModalOpen] = createSignal(false);
  const [sheetOpen, setSheetOpen] = createSignal(false);
  const [selectVal, setSelectVal] = createSignal<string | number>('prod');
  const [date, setDate] = createSignal<Date>(new Date());

  onMount(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    onCleanup(() => document.removeEventListener('keydown', down));
  });

  // Handle global theme persistence on <html> for maximum coverage
  createEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-brutalist', 'theme-midnight');
    if (currentTheme() !== 'professional') {
      html.classList.add(`theme-${currentTheme()}`);
    }
  });

  const navItems = [
    { id: 'intro', label: 'Introduction', group: 'Getting Started', keywords: ['about', 'guide'] },
    {
      id: 'get-started',
      label: 'Installation',
      group: 'Getting Started',
      keywords: ['setup', 'install', 'usage'],
    },
    {
      id: 'theming',
      label: 'Theming',
      group: 'Getting Started',
      keywords: ['colors', 'customization', 'branding'],
    },
    {
      id: 'layout',
      label: 'Layout',
      group: 'Components',
      keywords: ['card', 'separator', 'aspect ratio', 'scrollarea', 'resizable'],
    },
    {
      id: 'forms',
      label: 'Forms & Inputs',
      group: 'Components',
      keywords: [
        'button',
        'input',
        'textarea',
        'checkbox',
        'radio',
        'select',
        'slider',
        'switch',
        'colorpicker',
        'datepicker',
        'label',
      ],
    },
    {
      id: 'nav',
      label: 'Navigation',
      group: 'Components',
      keywords: ['navigation menu', 'menubar', 'breadcrumb', 'pagination', 'tabs'],
    },
    {
      id: 'data',
      label: 'Data Display',
      group: 'Components',
      keywords: ['badge', 'table', 'avatar', 'kbd', 'calendar', 'code'],
    },
    {
      id: 'feedback',
      label: 'Feedback',
      group: 'Components',
      keywords: ['alert', 'progress', 'skeleton', 'toast', 'toaster'],
    },
    {
      id: 'overlays',
      label: 'Overlays',
      group: 'Components',
      keywords: [
        'modal',
        'dialog',
        'sheet',
        'popover',
        'tooltip',
        'hover card',
        'context menu',
        'command',
        'dropdown menu',
      ],
    },
    {
      id: 'disclosure',
      label: 'Disclosure',
      group: 'Components',
      keywords: ['accordion', 'collapsible', 'carousel'],
    },
    {
      id: 'utils',
      label: 'Utilities',
      group: 'Development',
      keywords: ['clickOutside', 'hooks', 'directives'],
    },
  ];

  const themes = [
    { value: 'professional', label: 'Pro', icon: Shield },
    { value: 'brutalist', label: 'Brutal', icon: Zap },
    { value: 'midnight', label: 'Midnight', icon: Sparkles },
  ];

  const groupedNav = createMemo(() => {
    const groups: Record<string, typeof navItems> = {};
    for (const item of navItems) {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    }
    return groups;
  });

  const Sidebar = () => (
    <aside
      class={twMerge(
        'fixed inset-y-0 left-0 z-40 w-64 bg-panel border-r border-stroke transition-all duration-400 lg:translate-x-0 lg:static lg:inset-auto lg:z-0',
        sidebarOpen() ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div class="h-full flex flex-col p-6 overflow-y-auto">
        <div class="flex items-center gap-3 mb-10">
          <div class="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span class="text-white font-black text-xl">S</span>
          </div>
          <span class="text-xl font-bold tracking-tight">Starling UI</span>
        </div>

        <nav class="space-y-8">
          <For each={Object.entries(groupedNav())}>
            {([group, items]) => (
              <div class="space-y-3">
                <h4 class="text-[11px] font-bold uppercase tracking-wider text-muted/60 px-3">
                  {group}
                </h4>
                <div class="space-y-1">
                  <For each={items}>
                    {(item) => (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection(item.id as Section);
                          setSidebarOpen(false);
                        }}
                        class={twMerge(
                          'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                          activeSection() === item.id
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted hover:bg-surface hover:text-fg',
                        )}
                      >
                        {item.label}
                        {activeSection() === item.id && <ChevronRight size={14} />}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </nav>

        <div class="mt-auto pt-8 border-t border-stroke/50">
          <a
            href="https://github.com/StarlingCityDevelopment/starling-components"
            class="flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
          >
            <Cat size={16} />
            GitHub Repository
          </a>
        </div>
      </div>
    </aside>
  );

  const Preview = (props: {
    title: string;
    description: string;
    children: any;
    code: string;
    fileName?: string;
  }) => (
    <div class="space-y-6 mb-20">
      <div class="flex flex-col gap-1">
        <h3 class="text-2xl font-bold tracking-tight">{props.title}</h3>
        <p class="text-sm text-muted">{props.description}</p>
      </div>
      <div class="flex flex-col gap-4">
        <div class="border border-stroke rounded-xl overflow-hidden bg-bg/50 grid-bg p-12 flex items-center justify-center min-h-[250px]">
          {props.children}
        </div>
        <Code code={props.code} fileName={props.fileName || 'Usage'} language="tsx" />
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-bg text-fg flex overflow-hidden">
      <Sidebar />

      {/* Mobile Backdrop */}
      <Show when={sidebarOpen()}>
        <div
          class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      </Show>

      <main class="flex-1 flex flex-col h-screen overflow-y-auto scroll-smooth scrollbar-gutter-stable">
        <header class="h-16 border-b border-stroke bg-bg/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 shrink-0 transition-all duration-400">
          <div class="flex items-center gap-4 flex-1">
            <button
              type="button"
              class="lg:hidden p-2 -ml-2 text-muted hover:text-fg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <SegmentedControl
              class="hidden sm:inline-flex"
              value={currentTheme()}
              onChange={(v) => setCurrentTheme(v as Theme)}
              options={themes}
            />
          </div>

          <div class="flex-1 flex justify-center max-w-xl mx-auto lg:mx-0">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              class="w-full flex items-center gap-3 px-4 h-10 border border-stroke rounded-lg bg-panel/50 text-muted hover:border-muted transition-colors text-sm"
            >
              <Search size={16} />
              <span class="hidden md:inline">Search documentation...</span>
              <span class="md:hidden">Search...</span>
              <Kbd class="ml-auto text-[10px]">⌘K</Kbd>
            </button>
          </div>

          <div class="flex-1 flex justify-end items-center gap-4">
            <Button variant="ghost" class="h-9 w-9 p-0 rounded-full">
              <Cat size={18} />
            </Button>
            <Button
              variant="primary"
              class="hidden sm:flex h-9 px-4 text-xs font-bold uppercase tracking-tight"
            >
              v2.0.3
            </Button>
          </div>
        </header>

        <div class="max-w-4xl w-full mx-auto p-6 md:p-12 lg:p-16">
          {/* Section: Introduction */}
          <Show when={activeSection() === 'intro'}>
            <section class="space-y-6">
              <Badge variant="outline" class="text-primary border-primary/20 bg-primary/5">
                Documentation
              </Badge>
              <h1 class="text-5xl font-extrabold tracking-tight leading-[1.1]">
                Precision components for <span class="gradient-text">technical teams</span>.
              </h1>
              <p class="text-xl text-muted leading-relaxed max-w-2xl">
                Starling UI is a meticulously crafted component library for SolidJS, optimized for
                data-heavy interfaces. It emphasizes precision, accessibility, and professional
                aesthetics.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <Card class="bg-panel/30 border-dashed">
                  <CardHeader>
                    <Cpu size={24} class="text-primary mb-2" />
                    <CardTitle>Performance First</CardTitle>
                    <CardDescription>
                      Zero-cost abstractions and built-in tree shaking ensure minimal bundle sizes.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card class="bg-panel/30 border-dashed">
                  <CardHeader>
                    <Palette size={24} class="text-primary mb-2" />
                    <CardTitle>Multiple Presets</CardTitle>
                    <CardDescription>
                      Switch between several theme presets with zero configuration, optimized for
                      all technical scenarios.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <div class="pt-10 flex gap-4">
                <Button onClick={() => setActiveSection('get-started')}>
                  Get Started <ChevronRight size={16} class="ml-2" />
                </Button>
                <Button
                  variant="secondary"
                  as="a"
                  href="https://github.com/StarlingCityDevelopment/starling-components"
                >
                  GitHub Repository
                </Button>
              </div>
            </section>
          </Show>

          {/* Section: Installation */}
          <Show when={activeSection() === 'get-started'}>
            <section class="space-y-10">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight mb-4">Installation</h1>
                <p class="text-muted">Set up Starling UI in your project in seconds.</p>
              </div>

              <div class="space-y-4">
                <h2 class="text-xl font-bold">1. Install Package</h2>
                <Code code="npm install starling-components" fileName="terminal" language="bash" />
              </div>

              <div class="space-y-4">
                <h2 class="text-xl font-bold">2. Add Tailwind Styles</h2>
                <p class="text-sm text-muted">
                  Import the theme and base styles into your CSS entry point (Tailwind v4
                  compatible).
                </p>
                <Code
                  code={`@import "tailwindcss";\n@import "starling-components/theme";`}
                  fileName="app.css"
                  language="css"
                />
              </div>

              <Alert class="bg-primary/5 border-primary/20">
                <AlertTitle class="text-primary font-bold">Important Step</AlertTitle>
                <AlertDescription>
                  The notification system requires the `Toaster` component at your app's root.
                </AlertDescription>
                <div class="mt-4">
                  <Code
                    code={`import { Toaster } from 'starling-components/ui/Toast';\n\nfunction App() {\n  return (\n    <main>\n      <Toaster />\n      <Router />\n    </main>\n  );\n}`}
                    fileName="App.tsx"
                  />
                </div>
              </Alert>
            </section>
          </Show>

          {/* Section: Theming */}
          <Show when={activeSection() === 'theming'}>
            <section class="space-y-8">
              <h1 class="text-4xl font-extrabold tracking-tight">Theming</h1>
              <p class="text-muted leading-relaxed max-w-2xl">
                Starling UI uses a CSS variable-based design system. You can override these
                variables in your global CSS to customize the entire library.
              </p>

              <div class="space-y-10">
                <div>
                  <h2 class="text-xl font-bold mb-4">Core Colors</h2>
                  <div class="border border-stroke rounded-xl overflow-hidden bg-bg">
                    <Table>
                      <TableHeader class="bg-surface">
                        <TableRow>
                          <TableHead>Variable</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead class="text-right">Token</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--color-primary</TableCell>
                          <TableCell class="text-sm text-muted">Main accent/action color</TableCell>
                          <TableCell class="text-right font-mono text-xs">bg-primary</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--color-bg</TableCell>
                          <TableCell class="text-sm text-muted">Page background</TableCell>
                          <TableCell class="text-right font-mono text-xs">bg-bg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--color-panel</TableCell>
                          <TableCell class="text-sm text-muted">
                            Card & floating backgrounds
                          </TableCell>
                          <TableCell class="text-right font-mono text-xs">bg-panel</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--color-surface</TableCell>
                          <TableCell class="text-sm text-muted">
                            Subtle hover/active surfaces
                          </TableCell>
                          <TableCell class="text-right font-mono text-xs">bg-surface</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--color-fg</TableCell>
                          <TableCell class="text-sm text-muted">Primary text color</TableCell>
                          <TableCell class="text-right font-mono text-xs">text-fg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--color-muted</TableCell>
                          <TableCell class="text-sm text-muted">
                            Secondary/de-emphasized text
                          </TableCell>
                          <TableCell class="text-right font-mono text-xs">text-muted</TableCell>
                        </TableRow>
                        <TableRow class="border-none">
                          <TableCell class="font-mono text-xs">--color-stroke</TableCell>
                          <TableCell class="text-sm text-muted">Border and divider color</TableCell>
                          <TableCell class="text-right font-mono text-xs">border-stroke</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h2 class="text-xl font-bold mb-4">Border Radii</h2>
                  <div class="border border-stroke rounded-xl overflow-hidden bg-bg">
                    <Table>
                      <TableHeader class="bg-surface">
                        <TableRow>
                          <TableHead>Variable</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead class="text-right">Token</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--radius-card</TableCell>
                          <TableCell class="text-sm text-muted">
                            Radius for Cards and Panels
                          </TableCell>
                          <TableCell class="text-right font-mono text-xs">rounded-card</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--radius-btn</TableCell>
                          <TableCell class="text-sm text-muted">Radius for Buttons</TableCell>
                          <TableCell class="text-right font-mono text-xs">rounded-btn</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--radius-input</TableCell>
                          <TableCell class="text-sm text-muted">
                            Radius for Inputs & Selects
                          </TableCell>
                          <TableCell class="text-right font-mono text-xs">rounded-input</TableCell>
                        </TableRow>
                        <TableRow class="border-none">
                          <TableCell class="font-mono text-xs">--radius-badge</TableCell>
                          <TableCell class="text-sm text-muted">Radius for Badges</TableCell>
                          <TableCell class="text-right font-mono text-xs">rounded-badge</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h2 class="text-xl font-bold mb-4">Typography</h2>
                  <div class="border border-stroke rounded-xl overflow-hidden bg-bg">
                    <Table>
                      <TableHeader class="bg-surface">
                        <TableRow>
                          <TableHead>Variable</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead class="text-right">Token</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell class="font-mono text-xs">--font-sans</TableCell>
                          <TableCell class="text-sm text-muted">Main UI font stack</TableCell>
                          <TableCell class="text-right font-mono text-xs">font-sans</TableCell>
                        </TableRow>
                        <TableRow class="border-none">
                          <TableCell class="font-mono text-xs">--font-mono</TableCell>
                          <TableCell class="text-sm text-muted">
                            Technical/data font stack
                          </TableCell>
                          <TableCell class="text-right font-mono text-xs">font-mono</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div class="space-y-4 pt-6">
                  <h2 class="text-xl font-bold">Usage Example</h2>
                  <p class="text-sm text-muted mb-4">
                    You can apply these variables globally or scope them to a specific container.
                  </p>
                  <Code
                    code={`:root {\n  --color-primary: #10b981;\n  --radius-card: 0px;\n  --radius-btn: 4px;\n  --font-mono: "Fira Code", monospace;\n}`}
                    fileName="global.css"
                    language="css"
                  />
                </div>
              </div>
            </section>
          </Show>

          {/* Section: Layout */}
          <Show when={activeSection() === 'layout'}>
            <section class="space-y-12">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight mb-4">Layout</h1>
                <p class="text-lg text-muted">
                  Essential components for structuring application pages.
                </p>
              </div>

              <Preview
                title="Card"
                description="A fundamental layout container for grouping related content."
                code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from 'starling-components/ui/Card';\nimport { Button } from 'starling-components/ui/Button';\n\n<Card class="max-w-sm">\n  <CardHeader>\n    <CardTitle>Instance Overview</CardTitle>\n    <CardDescription>Managed by Starling Cloud</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <p class="text-sm text-muted">All systems in us-east-1 are operational.</p>\n  </CardContent>\n  <CardFooter>\n    <Button variant="outline" class="w-full">View Cluster Metrics</Button>\n  </CardFooter>\n</Card>`}
              >
                <Card class="max-w-sm">
                  <CardHeader>
                    <CardTitle>Instance Overview</CardTitle>
                    <CardDescription>Managed by Starling Cloud</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p class="text-sm text-muted">
                      All systems in us-east-1 are operational. Deployment #4288 passed CI.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" class="w-full">
                      View Cluster Metrics
                    </Button>
                  </CardFooter>
                </Card>
              </Preview>

              <Preview
                title="Scroll Area"
                description="Custom minimal scrollbars for contained content."
                code={`import { ScrollArea } from 'starling-components/ui/ScrollArea';\n\n<ScrollArea maxHeight="120px" class="border border-stroke p-4 rounded-lg bg-panel">\n  <div class="space-y-4 font-mono text-sm text-muted">\n    <p>[08:42:01] System initializing...</p>\n    <p>[08:42:05] Loading kernel modules...</p>\n    <p>[08:42:10] Database connection established.</p>\n  </div>\n</ScrollArea>`}
              >
                <ScrollArea
                  maxHeight="120px"
                  class="w-full max-w-sm border border-stroke p-4 rounded-lg bg-panel"
                >
                  <div class="space-y-4">
                    <p class="text-sm text-muted font-mono">[08:42:01] System initializing...</p>
                    <p class="text-sm text-muted font-mono">[08:42:05] Loading kernel modules...</p>
                    <p class="text-sm text-muted font-mono">
                      [08:42:10] Database connection established.
                    </p>
                    <p class="text-sm text-muted font-mono">
                      [08:42:12] Web server listening on :4000
                    </p>
                    <p class="text-sm text-muted font-mono">[08:42:15] Monitoring agents active.</p>
                  </div>
                </ScrollArea>
              </Preview>

              <Preview
                title="AspectRatio"
                description="Maintain specific width-to-height ratios."
                code={`import { AspectRatio } from 'starling-components/ui/AspectRatio';\n\n<div class="w-full max-w-sm overflow-hidden rounded-xl border border-stroke shadow-lg">\n  <AspectRatio ratio={16/9}>\n    <div class="w-full h-full bg-surface grid-bg flex items-center justify-center">\n       <span class="text-muted font-bold tracking-wider">16:9 Aspect Ratio</span>\n    </div>\n  </AspectRatio>\n</div>`}
              >
                <div class="w-full max-w-sm overflow-hidden rounded-xl border border-stroke shadow-lg">
                  <AspectRatio ratio={16 / 9}>
                    <div class="w-full h-full bg-surface grid-bg flex items-center justify-center">
                      <span class="text-muted font-bold">16:9 Aspect Ratio</span>
                    </div>
                  </AspectRatio>
                </div>
              </Preview>
            </section>
          </Show>

          {/* Section: Forms */}
          <Show when={activeSection() === 'forms'}>
            <section class="space-y-12">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight mb-4">Forms & Inputs</h1>
                <p class="text-lg text-muted">Precision primitives for user data entry.</p>
              </div>

              <Preview
                title="Button"
                description="Primary, secondary, and destructive actions."
                code={`import { Button } from 'starling-components/ui/Button';\n\n<div class="flex flex-wrap gap-4">\n  <Button variant="primary">Default</Button>\n  <Button variant="secondary">Secondary</Button>\n  <Button variant="destructive">Delete</Button>\n  <Button isLoading variant="outline">Processing</Button>\n</div>`}
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
                code={`import { SegmentedControl } from 'starling-components/ui/SegmentedControl';\nimport { Shield, Zap, Sparkles } from 'lucide-solid';\n\nconst options = [\n  { value: 'pro', label: 'Pro', icon: Shield },\n  { value: 'brutal', label: 'Brutal', icon: Zap },\n  { value: 'midnight', label: 'Midnight', icon: Sparkles }\n];\n\n<SegmentedControl \n  value={val()} \n  onChange={setVal}\n  options={options} \n/>`}
              >
                <SegmentedControl
                  value={currentTheme()}
                  onChange={(v) => setCurrentTheme(v as Theme)}
                  options={themes}
                />
              </Preview>

              <Preview
                title="Select"
                description="A fully themeable replacement for the native dropdown."
                code={`import { Select } from 'starling-components/ui/Select';\n\n<Select \n  label="Environment"\n  value={env()} \n  onChange={setEnv}\n  options={[\n    { label: 'Production', value: 'prod' },\n    { label: 'Staging', value: 'stage' }\n  ]}\n/>`}
              >
                <div class="w-full max-w-xs">
                  <Select
                    label="Deployment Environment"
                    value={selectVal()}
                    onChange={setSelectVal}
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
                description="Standard text inputs with optional descriptions and switches."
                code={`import { Input } from 'starling-components/ui/Input';\nimport { Switch } from 'starling-components/ui/Switch';\nimport { Label } from 'starling-components/ui/Label';\n\n<div class="flex flex-col gap-6">\n  <Input \n    label="Username" \n    placeholder="yanis" \n    description="This is your public display name." \n  />\n  <div class="flex items-center justify-between p-4 bg-panel border border-stroke rounded-xl">\n    <Label>Public Visibility</Label>\n    <Switch checked />\n  </div>\n</div>`}
              >
                <div class="w-full max-sm flex flex-col gap-6 transition-all duration-400">
                  <Input
                    label="Username"
                    placeholder="yanis"
                    description="This is your public display name."
                  />
                  <div class="flex items-center justify-between p-4 bg-panel border border-stroke rounded-xl">
                    <Label>Public Visibility</Label>
                    <Switch checked />
                  </div>
                </div>
              </Preview>

              <Preview
                title="Range Slider"
                description="Granular control for numeric values."
                code={`import { Slider } from 'starling-components/ui/Slider';\n\n<div class="w-full max-w-sm flex flex-col gap-4">\n  <Label>Memory Allocation</Label>\n  <Slider value={sliderVal()} onValueChange={setSliderVal} max={100} />\n</div>`}
              >
                <div class="w-full max-w-sm flex flex-col gap-4">
                  <div class="flex justify-between font-mono text-xs">
                    <Label class="text-muted">Memory Allocation</Label>
                    <span class="text-primary font-bold">{sliderVal()}%</span>
                  </div>
                  <Slider value={sliderVal()} onValueChange={setSliderVal} max={100} />
                </div>
              </Preview>
            </section>
          </Show>

          {/* Section: Navigation */}
          <Show when={activeSection() === 'nav'}>
            <section class="space-y-12">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight mb-4">Navigation</h1>
                <p class="text-lg text-muted">
                  Components for complex site structure and traversal.
                </p>
              </div>

              <Preview
                title="Tabs"
                description="Layered content with smooth transitions."
                code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from 'starling-components/ui/Tabs';\n\n<Tabs defaultValue="account">\n  <TabsList>\n    <TabsTrigger value="account">Account</TabsTrigger>\n    <TabsTrigger value="security">Security</TabsTrigger>\n  </TabsList>\n  <TabsContent value="account">General info...</TabsContent>\n  <TabsContent value="security">MFA settings...</TabsContent>\n</Tabs>`}
              >
                <Tabs defaultValue="account" class="w-full max-w-sm">
                  <TabsList class="w-full bg-surface p-1 rounded-lg">
                    <TabsTrigger value="account" class="flex-1">
                      Account
                    </TabsTrigger>
                    <TabsTrigger value="security" class="flex-1">
                      Security
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" class="pt-4 text-sm text-muted">
                    Configure your personal settings and display name.
                  </TabsContent>
                  <TabsContent value="security" class="pt-4 text-sm text-muted">
                    Manage your MFA and active session tokens.
                  </TabsContent>
                </Tabs>
              </Preview>

              <Preview
                title="Breadcrumb"
                description="Visualize hierarchy and current location."
                code={`import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from 'starling-components/ui/Breadcrumb';\n\n<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="#">Cluster</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbLink href="#">Nodes</BreadcrumbLink></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`}
              >
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Cluster</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Nodes</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Analytics</BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </Preview>
            </section>
          </Show>

          {/* Section: Data Display */}
          <Show when={activeSection() === 'data'}>
            <section class="space-y-12">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight mb-4">Data Display</h1>
                <p class="text-lg text-muted">Structured layout for complex information.</p>
              </div>

              <Preview
                title="Code Block"
                description="A professional code container with copy action."
                code={`import { Code } from 'starling-components/ui/Code';\n\n<Code \n  fileName="lib/ui/Code.tsx" \n  language="typescript"\n  code="export const Code = () => { ... }"\n/>`}
              >
                <div class="w-full max-w-md">
                  <Code
                    fileName="lib/ui/Code.tsx"
                    language="typescript"
                    code={
                      'export const Code = (props: CodeProps) => {\n  const [copied, setCopied] = createSignal(false);\n  // ... implementation details\n};'
                    }
                  />
                </div>
              </Preview>

              <Preview
                title="Interactive Table"
                description="Data-dense tabular layouts."
                code={`import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from 'starling-components/ui/Table';\nimport { Badge } from 'starling-components/ui/Badge';\n\n<Table>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Instance</TableHead>\n      <TableHead>Status</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n       <TableCell>US-EAST-1</TableCell>\n       <TableCell><Badge>Healthy</Badge></TableCell>\n    </TableRow>\n  </TableBody>\n</Table>`}
              >
                <div class="w-full border border-stroke rounded-xl overflow-hidden bg-bg">
                  <Table>
                    <TableHeader class="bg-surface">
                      <TableRow>
                        <TableHead>Instance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead class="text-right">Latency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell class="font-mono text-xs">US-EAST-1</TableCell>
                        <TableCell>
                          <Badge class="bg-green-500/10 text-green-500 border-none">Healthy</Badge>
                        </TableCell>
                        <TableCell class="text-right font-mono text-xs text-muted">12ms</TableCell>
                      </TableRow>
                      <TableRow class="border-none">
                        <TableCell class="font-mono text-xs">EU-WEST-1</TableCell>
                        <TableCell>
                          <Badge
                            variant="destructive"
                            class="bg-red-500/10 text-red-500 border-none"
                          >
                            Degraded
                          </Badge>
                        </TableCell>
                        <TableCell class="text-right font-mono text-xs text-muted">145ms</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Preview>

              <Preview
                title="Calendar"
                description="Single, range, and multiple date selection."
                code={`import { Calendar } from 'starling-components/ui/Calendar';\n\nconst [date, setDate] = createSignal(new Date());\n\n<Card class="max-w-sm">\n  <Calendar \n    mode="single" \n    selected={date()} \n    onSelect={setDate} \n  />\n</Card>`}
              >
                <Card class="bg-panel max-w-sm transition-all duration-400">
                  <Calendar
                    mode="single"
                    selected={date()}
                    onSelect={setDate}
                    class="border-none p-0"
                  />
                </Card>
              </Preview>
            </section>
          </Show>

          {/* Section: Feedback */}
          <Show when={activeSection() === 'feedback'}>
            <section class="space-y-12">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight mb-4">Feedback</h1>
                <p class="text-lg text-muted">Communicate system status and task progress.</p>
              </div>

              <Preview
                title="Alert"
                description="Prominent, contextual messaging."
                code={`import { Alert, AlertTitle, AlertDescription } from 'starling-components/ui/Alert';\n\n<Alert variant="destructive">\n  <AlertTitle>Critical Error</AlertTitle>\n  <AlertDescription>Regional cluster failure detected.</AlertDescription>\n</Alert>`}
              >
                <div class="flex flex-col gap-4 w-full max-w-md transition-all duration-400">
                  <Alert>
                    <AlertTitle>System Update</AlertTitle>
                    <AlertDescription>A new version is available for deployment.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Critical Error</AlertTitle>
                    <AlertDescription>Memory leak detected in regional cluster.</AlertDescription>
                  </Alert>
                </div>
              </Preview>

              <Preview
                title="Progress & Skeletons"
                description="Visualizing async states and completion."
                code={`import { Progress } from 'starling-components/ui/Progress';\nimport { Skeleton } from 'starling-components/ui/Skeleton';\n\n<Progress value={78} />\n<Skeleton class="h-12 w-full rounded-xl" />`}
              >
                <div class="w-full max-w-sm space-y-6 transition-all duration-400">
                  <Progress value={78} class="h-1.5" />
                  <div class="space-y-3">
                    <Skeleton class="h-3 w-full" />
                    <Skeleton class="h-3 w-[70%]" />
                    <Skeleton class="h-12 w-full rounded-xl" />
                  </div>
                </div>
              </Preview>

              <Preview
                title="Toast Notifications"
                description="Fluid, non-interruptive feedback. Now with configurable positioning, limits, and duration."
                code={`import { toast, Toaster } from 'starling-components/ui/Toast';\n\n<Toaster \n  position="${toastPos()}" \n  maxToasts={${maxToasts()}} \n  duration={${toastDuration()}} \n/>\n\n<Button onClick={() => toast({ title: "Done", type: "success" })}>\n  Show Success\n</Button>`}
              >
                <div class="flex flex-col gap-6 w-full max-w-xs transition-all duration-400">
                  <Select
                    label="Toaster Position"
                    value={toastPos()}
                    onChange={(v) => setToastPos(v as ToasterPosition)}
                    options={[
                      { label: 'Top Left', value: 'top-left' },
                      { label: 'Top Center', value: 'top-center' },
                      { label: 'Top Right', value: 'top-right' },
                      { label: 'Bottom Left', value: 'bottom-left' },
                      { label: 'Bottom Center', value: 'bottom-center' },
                      { label: 'Bottom Right', value: 'bottom-right' },
                    ]}
                  />
                  <div class="grid grid-cols-2 gap-4">
                    <Input
                      label="Max Toasts"
                      type="number"
                      value={maxToasts()}
                      onInput={(e) => setMaxToasts(Number.parseInt(e.currentTarget.value))}
                    />
                    <Input
                      label="Duration (ms)"
                      type="number"
                      value={toastDuration()}
                      onInput={(e) => setToastDuration(Number.parseInt(e.currentTarget.value))}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast({
                        title: 'System Ready',
                        description: 'All clusters operational.',
                        type: 'success',
                      })
                    }
                  >
                    Trigger Notification
                  </Button>
                </div>
              </Preview>
            </section>
          </Show>

          {/* Section: Overlays */}
          <Show when={activeSection() === 'overlays'}>
            <section class="space-y-12">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight mb-4">Overlays</h1>
                <p class="text-lg text-muted">Accessible dialogs, sheets, and popovers.</p>
              </div>

              <Preview
                title="Dialog (Modal)"
                description="Focused interruptions for critical tasks."
                code={`import { Modal, ModalHeader, ModalTitle, ModalFooter } from 'starling-components/ui/Modal';\n\n<Modal isOpen={open()} onClose={close}>\n  <ModalHeader>\n    <ModalTitle>Confirm Deployment</ModalTitle>\n  </ModalHeader>\n  <ModalFooter>\n    <Button onClick={close}>Cancel</Button>\n    <Button variant="primary">Confirm</Button>\n  </ModalFooter>\n</Modal>`}
              >
                <Button variant="secondary" onClick={() => setModalOpen(true)}>
                  Launch Dialog
                </Button>
              </Preview>

              <Preview
                title="Slide Overlay (Sheet)"
                description="Lateral panels for detail views."
                code={`import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetFooter } from 'starling-components/ui/Sheet';\n\n<Sheet isOpen={open()} onClose={close} side="right">\n  <SheetHeader>\n    <SheetTitle>Configuration</SheetTitle>\n  </SheetHeader>\n  <SheetContent>...</SheetContent>\n  <SheetFooter>\n    <Button>Save Changes</Button>\n  </SheetFooter>\n</Sheet>`}
              >
                <Button variant="secondary" onClick={() => setSheetOpen(true)}>
                  Open Right Sheet
                </Button>
              </Preview>

              <Preview
                title="Tooltip"
                description="A small floating label that appears on hover."
                code={`import { Tooltip } from 'starling-components/ui/Tooltip';\n\n<Tooltip\n  trigger={<Button variant="outline">Hover Me</Button>}\n  content="Archive this resource"\n  align="top"\n/>`}
              >
                <div class="flex gap-4">
                  <Tooltip
                    trigger={<Button variant="outline">Top</Button>}
                    content="Top Tooltip"
                    align="top"
                  />
                  <Tooltip
                    trigger={<Button variant="outline">Bottom</Button>}
                    content="Bottom Tooltip"
                    align="bottom"
                  />
                  <Tooltip
                    trigger={<Button variant="outline">Left</Button>}
                    content="Left Tooltip"
                    align="left"
                  />
                  <Tooltip
                    trigger={<Button variant="outline">Right</Button>}
                    content="Right Tooltip"
                    align="right"
                  />
                </div>
              </Preview>

              <Preview
                title="Popover"
                description="A floating container for rich content. Now supports cardinal and diagonal (corner) alignment."
                code={`import { Popover } from 'starling-components/ui/Popover';\n\n<div class="grid grid-cols-3 gap-4">\n  <Popover trigger={<Button variant="outline">Bottom Left</Button>} align="bottom-left">...</Popover>\n  <Popover trigger={<Button variant="outline">Bottom Right</Button>} align="bottom-right">...</Popover>\n  <Popover trigger={<Button variant="outline">Top Right</Button>} align="top-right">...</Popover>\n</div>`}
              >
                <div class="flex flex-col gap-8 w-full items-center">
                  <div class="flex flex-wrap justify-center gap-4">
                    <Popover
                      trigger={<Button variant="outline">Top Left</Button>}
                      align="top-left"
                    >
                      <div class="p-4 w-48 text-sm">Aligned to trigger's top-left corner.</div>
                    </Popover>
                    <Popover trigger={<Button variant="outline">Top</Button>} align="top">
                      <div class="p-4 w-48 text-sm text-center">Standard top alignment.</div>
                    </Popover>
                    <Popover
                      trigger={<Button variant="outline">Top Right</Button>}
                      align="top-right"
                    >
                      <div class="p-4 w-48 text-sm text-right">Aligned to top-right corner.</div>
                    </Popover>
                  </div>

                  <div class="flex flex-wrap justify-center gap-4">
                    <Popover
                      trigger={<Button variant="outline">Bottom Left</Button>}
                      align="bottom-left"
                    >
                      <div class="p-4 w-48 text-sm">Aligned to bottom-left corner.</div>
                    </Popover>
                    <Popover trigger={<Button variant="outline">Bottom</Button>} align="bottom">
                      <div class="p-4 w-48 text-sm text-center">Standard bottom alignment.</div>
                    </Popover>
                    <Popover
                      trigger={<Button variant="outline">Bottom Right</Button>}
                      align="bottom-right"
                    >
                      <div class="p-4 w-48 text-sm text-right">Aligned to bottom-right corner.</div>
                    </Popover>
                  </div>

                  <div class="flex flex-wrap justify-center gap-4">
                    <Popover
                      trigger={<Button variant="outline">Left Top</Button>}
                      align="left-top"
                    >
                      <div class="p-4 w-48 text-sm">Side-aligned to the top.</div>
                    </Popover>
                    <Popover
                      trigger={<Button variant="outline">Right Bottom</Button>}
                      align="right-bottom"
                    >
                      <div class="p-4 w-48 text-sm">Side-aligned to the bottom.</div>
                    </Popover>
                  </div>
                </div>
              </Preview>

              <Preview
                title="Hover Card"
                description="A non-interactive preview that appears on hover. Alignment is now fully configurable."
                code={`import { HoverCard } from 'starling-components/ui/HoverCard';\n\n<HoverCard trigger={<Button>Bottom Right</Button>} align="bottom-right">\n  Content aligned to corner\n</HoverCard>`}
              >
                <div class="flex flex-wrap justify-center gap-8">
                  <HoverCard
                    align="top-left"
                    trigger={
                      <span class="text-primary underline cursor-help font-mono text-xs">
                        top-left
                      </span>
                    }
                  >
                    <div class="space-y-2">
                      <h4 class="text-sm font-bold">Top Left Card</h4>
                      <p class="text-xs text-muted leading-tight">
                        Perfect for triggers located at the edges of a container.
                      </p>
                    </div>
                  </HoverCard>

                  <HoverCard
                    align="right-top"
                    trigger={
                      <span class="text-primary underline cursor-help font-mono text-xs">
                        right-top
                      </span>
                    }
                  >
                    <div class="space-y-2">
                      <h4 class="text-sm font-bold">Right Top Card</h4>
                      <p class="text-xs text-muted leading-tight">
                        Appears to the right, flush with the top of the trigger.
                      </p>
                    </div>
                  </HoverCard>

                  <HoverCard
                    align="bottom-right"
                    trigger={
                      <span class="text-primary underline cursor-help font-mono text-xs">
                        bottom-right
                      </span>
                    }
                  >
                    <div class="space-y-2">
                      <h4 class="text-sm font-bold">Bottom Right Card</h4>
                      <p class="text-xs text-muted leading-tight">
                        Spawns below and extends to the left from the right edge.
                      </p>
                    </div>
                  </HoverCard>
                </div>
              </Preview>
            </section>
          </Show>

          {/* Section: Disclosure */}
          <Show when={activeSection() === 'disclosure'}>
            <section class="space-y-12">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight mb-4">Disclosure</h1>
                <p class="text-lg text-muted">Toggle visibility of large content sections.</p>
              </div>

              <Preview
                title="Accordion"
                description="Vertically stacked collapsible headings."
                code={`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'starling-components/ui/Accordion';\n\n<Accordion collapsible>\n  <AccordionItem>\n    <AccordionTrigger>How it works?</AccordionTrigger>\n    <AccordionContent>Details...</AccordionContent>\n  </AccordionItem>\n</Accordion>`}
              >
                <Accordion
                  collapsible
                  class="w-full max-w-sm border border-stroke rounded-xl px-4 bg-panel/30 transition-all duration-400"
                >
                  <AccordionItem class="border-b border-stroke">
                    <AccordionTrigger class="py-4 text-sm font-medium">
                      System Security
                    </AccordionTrigger>
                    <AccordionContent class="pb-4 text-sm text-muted font-mono text-xs">
                      We use AES-256-GCM encryption at rest for all data chunks.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem class="border-none">
                    <AccordionTrigger class="py-4 text-sm font-medium">
                      Automatic Scaling
                    </AccordionTrigger>
                    <AccordionContent class="pb-4 text-sm text-muted font-mono text-xs">
                      Nodes scale horizontally based on RPS and latency metrics.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Preview>
            </section>
          </Show>

          {/* Section: Utilities */}
          <Show when={activeSection() === 'utils'}>
            <section class="space-y-10">
              <h1 class="text-4xl font-extrabold tracking-tight">Utilities</h1>
              <p class="text-muted leading-relaxed max-w-2xl">
                Shared hooks and directives that power Starling UI's interactive features.
              </p>

              <div class="space-y-4">
                <h2 class="text-xl font-bold">useTheme Hook</h2>
                <p class="text-sm text-muted mb-4">
                  Reactive hook for managing application theme states and persistent storage.
                </p>
                <Code
                  code={`import { useTheme } from 'starling-components/hooks';\n\nconst { isDark, toggleTheme, setAccentColor } = useTheme();`}
                  fileName="hooks"
                  language="typescript"
                />
              </div>

              <div class="space-y-4 pt-6">
                <h2 class="text-xl font-bold">clickOutside Directive</h2>
                <p class="text-sm text-muted mb-4">
                  A directive to detect clicks outside an element, perfect for custom menus.
                </p>
                <Code
                  code={`import { clickOutside } from 'starling-components/directives';\n\n<div use:clickOutside={() => setOpen(false)}>\n  My Custom Dropdown\n</div>`}
                  fileName="directives"
                  language="tsx"
                />
              </div>
            </section>
          </Show>
        </div>
      </main>

      {/* Global Overlays */}
      <Modal isOpen={modalOpen()} onClose={() => setModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Confirm Deployment?</ModalTitle>
          <ModalDescription>
            This will push your local configuration to production.
          </ModalDescription>
        </ModalHeader>
        <div class="py-6">
          <p class="text-sm text-muted">
            Your changes will be live instantly across all regions. Ensure CI checks have passed.
          </p>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              toast({ title: 'Deployment started', type: 'default' });
              setModalOpen(false);
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>

      <Sheet isOpen={sheetOpen()} onClose={() => setSheetOpen(false)}>
        <SheetHeader>
          <SheetTitle>Environment Configuration</SheetTitle>
          <SheetDescription>Settings for the current workspace cluster.</SheetDescription>
        </SheetHeader>
        <SheetContent class="pt-6 space-y-6">
          <div class="space-y-2">
            <Label class="text-xs uppercase font-bold text-muted tracking-wider">Region Name</Label>
            <Input value="Production (AWS)" />
          </div>
          <div class="space-y-2">
            <Label class="text-xs uppercase font-bold text-muted tracking-wider">
              Storage Quota
            </Label>
            <div class="flex justify-between font-mono text-[10px] text-primary">
              <span>80% USED</span>
              <span>20GB FREE</span>
            </div>
            <Slider value={80} />
          </div>
          <div class="flex items-center justify-between p-4 bg-surface rounded-xl border border-stroke shadow-sm">
            <div class="space-y-0.5">
              <Label class="text-sm">Maintenance Mode</Label>
              <p class="text-xs text-muted">Disable public traffic.</p>
            </div>
            <Switch />
          </div>
        </SheetContent>
        <SheetFooter>
          <Button variant="outline" onClick={() => setSheetOpen(false)}>
            Discard
          </Button>
          <Button onClick={() => setSheetOpen(false)}>Apply Changes</Button>
        </SheetFooter>
      </Sheet>

      <Command isOpen={commandOpen()} onClose={() => setCommandOpen(false)}>
        <CommandGroup heading="Navigation">
          <For each={navItems}>
            {(item) => (
              <CommandItem
                value={item.id}
                keywords={item.keywords}
                onClick={() => {
                  setActiveSection(item.id as Section);
                  setCommandOpen(false);
                }}
              >
                <div class="flex flex-col">
                  <span>{item.label}</span>
                  <span class="text-[10px] text-muted font-mono opacity-70">
                    {item.group} • {item.keywords.slice(0, 3).join(', ')}...
                  </span>
                </div>
              </CommandItem>
            )}
          </For>
        </CommandGroup>
      </Command>

      <Toaster position={toastPos()} maxToasts={maxToasts()} duration={toastDuration()} />
    </div>
  );
}
