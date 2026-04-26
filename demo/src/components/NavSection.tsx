import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../../lib/ui/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../lib/ui/Tabs';
import { Preview } from './Preview';

export const NavSection = () => {
  return (
    <section class="space-y-12">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">Navigation</h1>
        <p class="text-lg text-muted">Components for complex site structure and traversal.</p>
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
  );
};
