import { join, resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ command, mode }) => {
  const isDemo = process.env.BUILD_DEMO === 'true' || command === 'serve';

  const commonConfig = {
    base: process.env.VITE_BASE || '/',
    resolve: {
      alias: {
        '@': resolve(__dirname, '.'),
      },
    },
  };

  if (isDemo) {
    return {
      ...commonConfig,
      root: 'demo',
      plugins: [tailwindcss(), solidPlugin()],
      build: {
        outDir: '../dist-demo',
        emptyOutDir: true,
      },
    };
  }

  return {
    ...commonConfig,
    plugins: [solidPlugin()],
    build: {
      lib: {
        entry: {
          index: join(__dirname, 'lib/index.ts'),
          hooks: join(__dirname, 'lib/hooks/index.ts'),
        },
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        external: [
          'solid-js',
          'solid-js/web',
          'solid-js/store',
          'tailwind-merge',
          'clsx',
          'class-variance-authority',
          '@solid-primitives/event-listener',
          '@solid-primitives/keyboard',
          '@solid-primitives/media',
          '@solid-primitives/storage',
          'solid-transition-group',
        ],
        output: {
          dir: 'dist',
          entryFileNames: '[name].[format].js',
          chunkFileNames: '[name]-[hash].[format].js',
        },
      },
      minify: 'esbuild',
      target: 'esnext',
    },
  };
});
