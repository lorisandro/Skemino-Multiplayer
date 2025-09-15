import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@state': path.resolve(__dirname, './src/state'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true, // Usa sempre porta 3000, non cambiare se occupata
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend sulla porta 3001
        changeOrigin: true,
        rewrite: (path) => path // Non modificare il path
      },
      '/socket.io': {
        target: 'http://localhost:3001', // Backend sulla porta 3001
        ws: true,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../dist/client',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'socket-vendor': ['socket.io-client'],
          'ui-vendor': ['framer-motion', 'react-hot-toast'],
          'state-vendor': ['zustand', '@tanstack/react-query']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'socket.io-client']
  }
});