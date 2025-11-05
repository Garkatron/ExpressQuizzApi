import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,             
    environment: 'node',      
    include: ['tests/**/*.test.ts'], 
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: "v8",        
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,js}'],
      exclude: ['tests/**/*', 'node_modules'],
    },
  },
  resolve: {
    alias: {
      '#configs': path.resolve(__dirname, './src/configs'),
      '#helpers': path.resolve(__dirname, './src/helpers'),
      '#controllers': path.resolve(__dirname, './src/controllers'),
      '#databases': path.resolve(__dirname, './src/databases'),
      '#dtos': path.resolve(__dirname, './src/dtos'),
      '#interfaces': path.resolve(__dirname, './src/interfaces'),
      '#middlewares': path.resolve(__dirname, './src/middlewares'),
      '#models': path.resolve(__dirname, './src/models'),
      '#modules': path.resolve(__dirname, './src/modules'),
      '#routes': path.resolve(__dirname, './src/routes'),
      '#utils': path.resolve(__dirname, './src/utils'),
      '#constants': path.resolve(__dirname, './src/constants.ts'),
    },
  },
});
