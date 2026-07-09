import { join, resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type UserConfig } from 'vite-plus';
import solidPlugin from 'vite-plugin-solid';

const sharedConfig: UserConfig = {
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    singleQuote: true,
    semi: true,
    printWidth: 100,
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    conditions: ['development', 'browser'],
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
};

export default defineConfig(({ command }) => {
  const isDemo = (process.env.BUILD_DEMO === 'true' || command === 'serve') && !process.env.VITEST;

  if (isDemo) {
    const demoPlugins: any[] = [tailwindcss(), solidPlugin()];
    return {
      ...sharedConfig,
      base: process.env.VITE_BASE || '/',
      root: 'demo',
      plugins: demoPlugins,
      build: {
        outDir: '../dist-demo',
        emptyOutDir: true,
      },
    };
  }

  const libPlugins: any[] = [solidPlugin(process.env.VITEST ? { hot: false } : {})];
  return {
    ...sharedConfig,
    base: process.env.VITE_BASE || '/',
    plugins: libPlugins,
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
