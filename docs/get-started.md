# Getting Started

Learn how to install and set up Starling UI in your project.

## Installation

Starling UI is distributed via npm. You can install it using your preferred package manager:

```bash
# npm
npm install starling-components

# bun
bun add starling-components
```

## Peer Dependencies

Ensure you have the following dependencies installed in your project:

- `solid-js` (^1.9.0)
- `tailwindcss` (^4.0.0)

## Setup

### 1. Tailwind Configuration

Starling UI is built for Tailwind CSS v4. In your main CSS entry point, import the library's theme and components:

```css
@import "tailwindcss";
@import "starling-components/theme";

/* Optional: Source the components if you are using Tailwind's JIT scanner on the library */
@source "../node_modules/starling-components/ui/**/*.tsx";
```

### 2. Provider Setup (Optional)

If you plan to use the `Toaster` or `useTheme` hook, make sure to add the `Toaster` component at the root of your application.

```tsx
import { Toaster } from 'starling-components/ui/Toast';

function App() {
  return (
    <>
      <Toaster />
      <MyApplication />
    </>
  );
}
```

## Basic Usage

Import components directly and start building:

```tsx
import { Button } from 'starling-components/ui/Button';
import { Card, CardTitle, CardContent } from 'starling-components/ui/Card';

export default function Home() {
  return (
    <Card class="max-w-sm">
      <CardTitle>Welcome to Starling</CardTitle>
      <CardContent>
        <p class="mb-4">This is a data-heavy component library.</p>
        <Button variant="primary" onClick={() => alert('Hello!')}>
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}
```
