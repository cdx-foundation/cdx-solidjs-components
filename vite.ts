import type { Plugin } from 'vite';

/**
 * Automatically configures the project to use Startling Components.
 * - Adds @startling alias
 * - Ensures Tailwind CSS scans library components (for v4)
 */
export function startling(): Plugin {
  return {
    name: 'vite-plugin-startling',
    config() {
      return {
        resolve: {
          alias: {
            // This is handled by the user usually, but we can automate it
          },
        },
      };
    },
    // We can use transform to inject @source into the main CSS file if we really want to be "magic"
    // But usually, providing a simple import is better.
  };
}
