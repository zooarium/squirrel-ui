import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Bundle analysis: active only when VITE_ANALYZE=true (via `make analyze`)
    // Outputs stats.html — open in browser to see interactive treemap.
    mode === 'analyze' &&
      visualizer({
        filename: 'stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap', // 'treemap' | 'sunburst' | 'network'
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      // Absolute imports: use @/ instead of ../../../../
      // Example: import { Button } from '@/ui';
      '@': resolve(__dirname, './src'),
    },
    // Prevent duplicate React when @aviary-ui/* packages are symlinked via file: deps.
    // Without this, React resolves from ../aviary-ui/node_modules/react → hooks crash.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    watch: {
      // Watch @aviary-ui dist/ so HMR fires when `make dev-ui` rebuilds the packages.
      // Vite ignores node_modules by default; this carves out @aviary-ui as an exception.
      ignored: (path) => path.includes('node_modules') && !path.includes('@aviary-ui'),
    },
  },
  optimizeDeps: {
    // Don't pre-bundle aviary-ui packages — load dist/ fresh on each rebuild during dev.
    exclude: ['@aviary-ui/core', '@aviary-ui/ui'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
}));
