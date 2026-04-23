import { join } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solidPlugin(),
    dts({
      include: ['index.ts', 'ui/**/*.tsx', 'lib/hooks/**/*.ts'],
      outDir: 'dist/types',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: join(__dirname, 'index.ts'),
        hooks: join(__dirname, 'lib/hooks/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'solid-js',
        'solid-js/web',
        'solid-js/store',
        'lucide-solid',
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
});
