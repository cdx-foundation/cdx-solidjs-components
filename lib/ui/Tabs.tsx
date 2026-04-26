import {
  type Component,
  For,
  type JSX,
  Show,
  createContext,
  createSignal,
  splitProps,
  useContext,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

// --- Context ---

interface TabsContextValue {
  value: () => string;
  setValue: (v: string) => void;
}

const TabsContext = createContext<TabsContextValue>();

// --- Components ---

/**
 * Configuration properties for the Root Tabs container.
 */
interface TabsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The value of the tab that should be active when the component initially mounts.
   * Use this for uncontrolled components.
   */
  defaultValue?: string;

  /**
   * The value of the currently active tab.
   * Use this for controlled components where the state is managed by a parent.
   */
  value?: string;

  /**
   * Callback fired whenever the active tab selection changes.
   */
  onValueChange?: (v: string) => void;

  /**
   * A combination of `TabsList`, `TabsTrigger`, and `TabsContent`.
   */
  children?: JSX.Element;

  /**
   * Shorthand for rendering tabs from a data array.
   * If provided, the Tabs component will automatically render triggers.
   */
  items?: Array<{
    id: string;
    label: string;
    icon?: Component<any>;
  }>;
}

/**
 * ### Tabs Component
 *
 * A set of layered sections of content—known as tab panels—that are displayed one at a time.
 * Built using the compound component pattern for maximum flexibility, but also supports a shorthand `items` prop.
 *
 * @example
 * ```tsx
 * // Compound Pattern (Flexible)
 * <Tabs defaultValue="account">
 *   <TabsList>
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="password">Password</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">Account Content</TabsContent>
 *   <TabsContent value="password">Password Content</TabsContent>
 * </Tabs>
 *
 * // Shorthand Pattern (Clean)
 * <Tabs
 *   items={[
 *     { id: 'account', label: 'Account', icon: UserIcon },
 *     { id: 'security', label: 'Security', icon: LockIcon }
 *   ]}
 *   value={active()}
 *   onValueChange={setActive}
 * />
 * ```
 *
 * @param props - Root configuration including `defaultValue`, `value`, or `items`.
 */
export const Tabs = (props: TabsProps) => {
  const [local, others] = splitProps(props, [
    'defaultValue',
    'value',
    'onValueChange',
    'children',
    'items',
    'class',
  ]);

  const [internalValue, setInternalValue] = createSignal(
    local.defaultValue || local.items?.[0]?.id || '',
  );

  const value = () => local.value ?? internalValue();

  const setValue = (v: string) => {
    setInternalValue(v);
    local.onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div class={twMerge('', local.class)} {...others}>
        <Show when={local.items}>
          <TabsList class="mb-4">
            <For each={local.items}>
              {(item) => (
                <TabsTrigger value={item.id} class="gap-2">
                  <Show when={item.icon}>
                    <Dynamic component={item.icon} size={16} />
                  </Show>
                  {item.label}
                </TabsTrigger>
              )}
            </For>
          </TabsList>
        </Show>
        {local.children}
      </div>
    </TabsContext.Provider>
  );
};

/**
 * A horizontal or vertical list of `TabsTrigger` components.
 */
export const TabsList = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      class={twMerge(
        'inline-flex h-10 items-center justify-center rounded-md bg-surface p-1 text-muted',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

/**
 * Properties for individual tab triggers.
 */
interface TabsTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The unique identifier for this tab.
   * Must match the `value` prop of the corresponding `TabsContent`.
   */
  value: string;
}

/**
 * An interactive element that activates its associated `TabsContent` when clicked or focused.
 */
export const TabsTrigger = (props: TabsTriggerProps) => {
  const context = useContext(TabsContext);
  const [local, others] = splitProps(props, ['class', 'value', 'children']);

  if (!context) return null;

  const isActive = () => context.value() === local.value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive()}
      aria-controls={`panel-${local.value}`}
      id={`tab-${local.value}`}
      onClick={() => context.setValue(local.value)}
      class={twMerge(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-bg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive() ? 'bg-panel text-fg shadow-sm' : 'hover:text-fg',
        local.class,
      )}
      {...others}
    >
      {local.children}
    </button>
  );
};

/**
 * Properties for the tab content panels.
 */
interface TabsContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The unique identifier that links this content to its `TabsTrigger`.
   */
  value: string;
}

/**
 * A container that renders content only when its associated tab is active.
 */
export const TabsContent = (props: TabsContentProps) => {
  const context = useContext(TabsContext);
  const [local, others] = splitProps(props, ['class', 'value', 'children']);

  if (!context) return null;

  return (
    <Show when={context.value() === local.value}>
      <div
        role="tabpanel"
        id={`panel-${local.value}`}
        aria-labelledby={`tab-${local.value}`}
        tabindex="0"
        class={twMerge(
          'mt-2 ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          local.class,
        )}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  );
};
