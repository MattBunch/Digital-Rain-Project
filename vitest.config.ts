import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
      include: ['src/**/*.{test,spec}.{js,ts}'],
      alias: [{ find: /^sveltely$/, replacement: 'svelte' }], // some svelte 5 testing fixes
      server: {
        deps: {
          inline: [/svelte/],
        },
      },
    },
    resolve: {
      conditions: ['browser', 'development'],
    },
  }),
);
