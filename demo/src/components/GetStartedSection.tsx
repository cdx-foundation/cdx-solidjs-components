import { Alert, AlertDescription, AlertTitle } from '../../../lib/ui/Alert';
import { Code } from '../../../lib/ui/Code';

export const GetStartedSection = () => {
  return (
    <section class="space-y-10">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">Installation</h1>
        <p class="text-muted">Set up Starling UI in your project in seconds.</p>
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-bold">1. Install Package</h2>
        <Code code="bun install cdx-solidjs-components" fileName="terminal" language="bash" />
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-bold">2. Add Tailwind Styles</h2>
        <p class="text-sm text-muted">
          Import the theme and base styles into your CSS entry point (Tailwind v4 compatible).
        </p>
        <Code
          code={`@import "tailwindcss";\n@import "cdx-solidjs-components";`}
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
            code={`import { Toaster } from 'cdx-solidjs-components/ui/Toast';\n\nfunction App() {\n  return (\n    <main>\n      <Toaster />\n      <Router />\n    </main>\n  );\n}`}
            fileName="App.tsx"
          />
        </div>
      </Alert>
    </section>
  );
};
