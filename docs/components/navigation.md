# Navigation Components

Components for building complex site navigation, pagination, and multi-layered menus.

## NavigationMenu

A high-level site navigation component with hover-activated dropdown panels.

```tsx
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from 'starling-components/ui/NavigationMenu';

<NavigationMenu>
  <NavigationMenuItem trigger="Documentation">
    <div class="p-4 w-48">
      <NavigationMenuLink href="/docs/intro">Introduction</NavigationMenuLink>
      <NavigationMenuLink href="/docs/components">Components</NavigationMenuLink>
    </div>
  </NavigationMenuItem>
  <NavigationMenuItem trigger="Community">
    <div class="p-4 w-48">
      <NavigationMenuLink href="/github">GitHub</NavigationMenuLink>
    </div>
  </NavigationMenuItem>
</NavigationMenu>
```

---

## Menubar

A top-level horizontal bar for desktop-style application menus.

```tsx
import { Menubar, MenubarMenu, MenubarItem, MenubarSeparator } from 'starling-components/ui/Menubar';

<Menubar>
  <MenubarMenu trigger="File">
    <MenubarItem onClick={onNew}>New File</MenubarItem>
    <MenubarSeparator />
    <MenubarItem onClick={onQuit}>Quit</MenubarItem>
  </MenubarMenu>
  <MenubarMenu trigger="View">
    <MenubarItem>Zoom In</MenubarItem>
    <MenubarItem>Zoom Out</MenubarItem>
  </MenubarMenu>
</Menubar>
```

---

## Breadcrumb

A trail of links showing the current location in the application hierarchy.

```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from 'starling-components/ui/Breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## Pagination

A navigation element for traversing through paginated data sets.

```tsx
import { Pagination } from 'starling-components/ui/Pagination';

<Pagination
  currentPage={page()}
  totalPages={10}
  onPageChange={setPage}
/>
```

---

## Tabs

A set of layered sections of content displayed one at a time. Supports both compound and shorthand patterns.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'starling-components/ui/Tabs';

{/* Compound Pattern */}
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">General info...</TabsContent>
  <TabsContent value="settings">User settings...</TabsContent>
</Tabs>

{/* Shorthand Pattern */}
<Tabs
  items={[
    { id: 'logs', label: 'Logs' },
    { id: 'metrics', label: 'Metrics' }
  ]}
  activeTab={active()}
  onTabChange={setActive}
/>
```
