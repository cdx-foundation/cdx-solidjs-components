import {
  Book,
  Cat,
  ChevronDown,
  Database,
  FileText,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Monitor,
  Navigation,
  Paintbrush,
  Palette,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-solid';
import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

import { Button } from '../../lib/ui/Button';
import { Command, CommandGroup, CommandItem } from '../../lib/ui/Command';
import { Input } from '../../lib/ui/Input';
import { Kbd } from '../../lib/ui/Kbd';
import { Label } from '../../lib/ui/Label';
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '../../lib/ui/Modal';
import { SegmentedControl } from '../../lib/ui/SegmentedControl';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../../lib/ui/Sheet';
import { Slider } from '../../lib/ui/Slider';
import { Switch } from '../../lib/ui/Switch';
import { Toaster, type ToasterPosition, toast } from '../../lib/ui/Toast';
import { Sidebar, SidebarProvider } from '../../lib/ui/Sidebar';
import { useAppTheme } from './hooks/useAppTheme';
import { BASE_PALETTES, FONTS, SHADOWS, hexToRgb } from './theme-constants';

import { DataSection } from './components/DataSection';
import { DisclosureSection } from './components/DisclosureSection';
import { FeedbackSection } from './components/FeedbackSection';
import { FormsSection } from './components/FormsSection';
import { GetStartedSection } from './components/GetStartedSection';
import { IntroSection } from './components/IntroSection';
import { LayoutSection } from './components/LayoutSection';
import { NavSection } from './components/NavSection';
import { OverlaysSection } from './components/OverlaysSection';
import { ThemeCreator } from './components/ThemeCreator';
import { ThemingSection } from './components/ThemingSection';
import { UtilsSection } from './components/UtilsSection';

type Section =
  | 'intro'
  | 'get-started'
  | 'theming'
  | 'theme-creator'
  | 'hud'
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
  const { isDark, accentColor, radius, headerFont, bodyFont, baseColor, shadow, btnBoxShadow } =
    useAppTheme();

  // App-specific implementation logic (Effects)
  createEffect(() => {
    document.documentElement.classList.toggle('dark', isDark());
    document.documentElement.style.colorScheme = isDark() ? 'dark' : 'light';
  });

  createEffect(() => {
    const root = document.documentElement;
    const palette = BASE_PALETTES[baseColor()][isDark() ? 'dark' : 'light'];

    root.style.setProperty('--primary-color', accentColor());
    root.style.setProperty('--primary-rgb', hexToRgb(accentColor()));

    root.style.setProperty('--bg-main', palette.bg);
    root.style.setProperty('--bg-panel', palette.panel);
    root.style.setProperty('--bg-surface', palette.surface);

    root.style.setProperty('--fg-main', palette.fg);
    root.style.setProperty('--text-muted', palette.muted);

    // Sidebar theme - use surface for sidebar bg, panel for surface, same fg
    root.style.setProperty('--sidebar', palette.surface);
    root.style.setProperty('--sidebar-fg', palette.fg);
    root.style.setProperty('--sidebar-primary', palette.fg);
    root.style.setProperty('--sidebar-primary-fg', palette.bg);
    root.style.setProperty('--sidebar-accent', palette.border);
    root.style.setProperty('--sidebar-accent-fg', palette.fg);
    root.style.setProperty('--sidebar-border', palette.border);
    root.style.setProperty('--sidebar-ring', accentColor());

    root.style.setProperty('--border-main', palette.border);
    root.style.setProperty('--stroke', palette.border);

    const isDarkVal = isDark();
    root.style.setProperty(
      '--ring-main',
      isDarkVal ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    );
    root.style.setProperty(
      '--glass-border',
      isDarkVal ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
    );

    root.style.setProperty('--shadow-main', SHADOWS[shadow()]);
    root.style.setProperty('--shadow-btn', SHADOWS[btnBoxShadow()]);

    const r = radius();
    root.style.setProperty('--radius-card', r);
    root.style.setProperty('--radius-lg', r);
    root.style.setProperty('--radius-btn', `calc(${r} - 0.2rem)`);
    root.style.setProperty('--radius-input', `calc(${r} - 0.1rem)`);
    root.style.setProperty('--radius-badge', `calc(${r} - 0.3rem)`);

    root.style.setProperty('--sans-main', FONTS[bodyFont()]);
    root.style.setProperty('--display-main', FONTS[headerFont()]);
    root.style.setProperty('--mono-main', FONTS.mono);

    document.body.style.fontFamily = FONTS[bodyFont()];
  });

  const [activeSection, setActiveSection] = createSignal<Section>('intro');
  const [currentTheme, setCurrentTheme] = createSignal<Theme>('professional');
  const [commandOpen, setCommandOpen] = createSignal(false);

  // Toast settings
  const [toastPos, setToastPos] = createSignal<ToasterPosition>('bottom-right');
  const [maxToasts, setMaxToasts] = createSignal(5);
  const [toastDuration, setToastDuration] = createSignal(4000);

  // Overlay states
  const [modalOpen, setModalOpen] = createSignal(false);
  const [sheetOpen, setSheetOpen] = createSignal(false);

  onMount(() => {
    // Reset sidebar to expanded state on each page load
    localStorage.removeItem('sidebar:state');

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    onCleanup(() => document.removeEventListener('keydown', down));
  });

  createEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-brutalist', 'theme-midnight');
    if (currentTheme() !== 'professional') {
      html.classList.add(`theme-${currentTheme()}`);
    }
  });

  const navItems = [
    { id: 'intro', label: 'Introduction', group: 'Getting Started', icon: Book, keywords: ['about', 'guide'] },
    {
      id: 'get-started',
      label: 'Installation',
      group: 'Getting Started',
      icon: Rocket,
      keywords: ['setup', 'install', 'usage'],
    },
    {
      id: 'theming',
      label: 'Theming',
      group: 'Getting Started',
      icon: Palette,
      keywords: ['colors', 'customization', 'branding'],
    },
    {
      id: 'theme-creator',
      label: 'Theme Creator',
      group: 'Getting Started',
      icon: Paintbrush,
      keywords: ['customize', 'editor', 'preview', 'export'],
    },
    {
      id: 'hud',
      label: 'HUD Variant',
      group: 'FiveM Specific',
      icon: Monitor,
      keywords: ['hud', 'fivem', 'gaming', 'vitals', 'overlay'],
    },
    {
      id: 'layout',
      label: 'Layout',
      group: 'Components',
      icon: LayoutDashboard,
      keywords: ['card', 'separator', 'aspect ratio', 'scrollarea', 'resizable'],
    },
    {
      id: 'forms',
      label: 'Forms & Inputs',
      group: 'Components',
      icon: FileText,
      keywords: [
        'button', 'input', 'textarea', 'checkbox', 'radio', 'select',
        'slider', 'switch', 'colorpicker', 'datepicker', 'label',
      ],
    },
    {
      id: 'nav',
      label: 'Navigation',
      group: 'Components',
      icon: Navigation,
      keywords: ['navigation menu', 'menubar', 'breadcrumb', 'pagination', 'tabs'],
    },
    {
      id: 'data',
      label: 'Data Display',
      group: 'Components',
      icon: Database,
      keywords: ['badge', 'table', 'avatar', 'kbd', 'calendar', 'code'],
    },
    {
      id: 'feedback',
      label: 'Feedback',
      group: 'Components',
      icon: MessageSquare,
      keywords: ['alert', 'progress', 'skeleton', 'toast', 'toaster'],
    },
    {
      id: 'overlays',
      label: 'Overlays',
      group: 'Components',
      icon: Layers,
      keywords: [
        'modal', 'dialog', 'sheet', 'popover', 'tooltip',
        'hover card', 'context menu', 'command', 'dropdown menu',
      ],
    },
    {
      id: 'disclosure',
      label: 'Disclosure',
      group: 'Components',
      icon: ChevronDown,
      keywords: ['accordion', 'collapsible', 'carousel'],
    },
    {
      id: 'utils',
      label: 'Utilities',
      group: 'Development',
      icon: Wrench,
      keywords: ['hooks', 'directives'],
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

  return (
    <SidebarProvider class="flex min-h-screen bg-bg text-fg">
      <Sidebar.Root collapsible="icon" side="left">
        <Sidebar.Header>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton class="gap-3">
                <span data-sidebar-icon>
                  <div class="h-8 w-8 shrink-0 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                    <span class="text-white font-black text-xl">S</span>
                  </div>
                </span>
                <span class="text-xl font-bold tracking-tight">Starling UI</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Header>

        <Sidebar.Content>
          <For each={Object.entries(groupedNav())}>
            {([group, items]) => (
              <Sidebar.Group>
                <Sidebar.GroupLabel>{group}</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                  <Sidebar.Menu>
                    <For each={items}>
                      {(item) => (
                        <Sidebar.MenuItem>
                          <Sidebar.MenuButton
                            isActive={activeSection() === item.id}
                            onClick={() => setActiveSection(item.id as Section)}
                            tooltip={item.label}
                          >
                            <span data-sidebar-icon>
                              <Dynamic component={item.icon} size={16} />
                            </span>
                            <span>{item.label}</span>
                          </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                      )}
                    </For>
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
            )}
          </For>
        </Sidebar.Content>

        <Sidebar.Footer>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                as="a"
                href="https://github.com/StarlingCityDevelopment/cdx-solidjs-components"
                target="_blank"
                tooltip="GitHub"
              >
                <span data-sidebar-icon>
                  <Cat size={16} />
                </span>
                <span>GitHub Repository</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Footer>

        <Sidebar.Rail />
      </Sidebar.Root>

      <main class="flex-1 flex flex-col h-screen overflow-y-auto scroll-smooth scrollbar-gutter-stable">
        <header class="h-16 border-b border-stroke bg-bg/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 shrink-0 transition-all duration-400">
          <div class="flex items-center gap-4 flex-1">
            <Sidebar.Trigger />

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
              v2.1.2
            </Button>
          </div>
        </header>

        <div
          class={twMerge(
            activeSection() === 'theme-creator' || activeSection() === 'hud'
              ? 'flex-1'
              : 'max-w-4xl w-full mx-auto p-6 md:p-12 lg:p-16',
          )}
        >
          <Show when={activeSection() === 'intro'}>
            <IntroSection onGetStarted={() => setActiveSection('get-started')} />
          </Show>

          <Show when={activeSection() === 'get-started'}>
            <GetStartedSection />
          </Show>

          <Show when={activeSection() === 'theming'}>
            <ThemingSection />
          </Show>

          <Show when={activeSection() === 'theme-creator'}>
            <ThemeCreator />
          </Show>

          <Show when={activeSection() === 'layout'}>
            <LayoutSection />
          </Show>

          <Show when={activeSection() === 'forms'}>
            <FormsSection
              currentTheme={currentTheme()}
              onThemeChange={(v) => setCurrentTheme(v as Theme)}
              themes={themes}
            />
          </Show>

          <Show when={activeSection() === 'nav'}>
            <NavSection />
          </Show>

          <Show when={activeSection() === 'data'}>
            <DataSection />
          </Show>

          <Show when={activeSection() === 'feedback'}>
            <FeedbackSection
              toastPos={toastPos()}
              setToastPos={setToastPos}
              maxToasts={maxToasts()}
              setMaxToasts={setMaxToasts}
              toastDuration={toastDuration()}
              setToastDuration={setToastDuration}
            />
          </Show>

          <Show when={activeSection() === 'overlays'}>
            <OverlaysSection setModalOpen={setModalOpen} setSheetOpen={setSheetOpen} />
          </Show>

          <Show when={activeSection() === 'disclosure'}>
            <DisclosureSection />
          </Show>

          <Show when={activeSection() === 'utils'}>
            <UtilsSection />
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

      <Toaster maxToasts={maxToasts()} duration={toastDuration()} />
    </SidebarProvider>
  );
}
