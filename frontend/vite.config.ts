import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (!normalized.includes('/node_modules/')) return;

          // 1. Core React Runtime (React, Router, State Management)
          if (
            normalized.includes('/node_modules/react/') ||
            normalized.includes('/node_modules/react-dom/') ||
            normalized.includes('/node_modules/react-router/') ||
            normalized.includes('/node_modules/react-router-dom/') ||
            normalized.includes('/node_modules/react-helmet-async/') ||
            normalized.includes('/node_modules/scheduler/') ||
            normalized.includes('/node_modules/zustand/')
          ) {
            return 'vendor-react';
          }

          // 2. Data Fetching & HTTP Client
          if (normalized.includes('/@tanstack/react-query/') || normalized.includes('/axios/')) {
            return 'vendor-query';
          }

          // 3. Radix UI (Used mostly in Admin & interactive modals)
          if (normalized.includes('/@radix-ui/')) {
            return 'vendor-radix';
          }

          // 4. Icons
          if (normalized.includes('/react-icons/')) {
            return 'vendor-react-icons';
          }
          if (normalized.includes('/lucide-react/')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})