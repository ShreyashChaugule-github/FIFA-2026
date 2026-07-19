import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['components/**', 'lib/**', 'app/api/**', 'hooks/**'],
      exclude: ['node_modules', '.next', 'tests/setup.js'],
      thresholds: { lines: 5, functions: 5, branches: 5, statements: 5 },
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
