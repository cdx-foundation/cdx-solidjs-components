import { Cat, ChevronRight, Menu, Search, Shield, Sparkles, Zap } from 'lucide-solid';
import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
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

import { DataSection } from './components/DataSection';
import { DisclosureSection } from './components/DisclosureSection';
import { FeedbackSection } from './components/FeedbackSection';
import { FormsSection } from './components/FormsSection';
import { GetStartedSection } from './components/GetStartedSection';
// Section Components
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

  // Toast settings
  const [toastPos, setToastPos] = createSignal<ToasterPosition>('bottom-right');
  const [maxToasts, setMaxToasts] = createSignal(5);
  const [toastDuration, setToastDuration] = createSignal(4000);

  // Overlay states
  const [modalOpen, setModalOpen] = createSignal(false);
  const [sheetOpen, setSheetOpen] = createSignal(false);

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
      id: 'theme-creator',
      label: 'Theme Creator',
      group: 'Getting Started',
      keywords: ['customize', 'editor', 'preview', 'export'],
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
              v2.1.2
            </Button>
          </div>
        </header>

        <div
          class={twMerge(
            activeSection() === 'theme-creator'
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
    </div>
  );
}
