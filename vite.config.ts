import { join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ command, mode }) => {
  const isDemo = process.env.BUILD_DEMO === 'true' || command === 'serve';

  if (isDemo) {
    return {
      root: 'demo',
      plugins: [tailwindcss(), solidPlugin()],
      build: {
        outDir: '../dist-demo',
        emptyOutDir: true,
      },
    };
  }

  return {
    plugins: [
      solidPlugin(),
      dts({
        include: ['lib/index.ts', 'lib/ui/**/*.tsx', 'lib/hooks/**/*.ts'],
        outDir: 'dist/types',
      }),
    ],
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
