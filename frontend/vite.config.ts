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

          // 1. Rich Text Editor (Khusus Admin / Editor)
          if (normalized.includes('/@tiptap/')) {
            return 'vendor-editor';
          }

          // 2. Lightbox & Photo Album (Khusus Galeri)
          if (normalized.includes('yet-another-react-lightbox') || normalized.includes('react-photo-album')) {
            return 'vendor-gallery';
          }

          // 3. Form Handling & Zod Validation (Khusus Form / Admin)
          if (normalized.includes('/react-hook-form/') || normalized.includes('/@hookform/') || normalized.includes('/zod/')) {
            return 'vendor-forms';
          }

          // 4. UI Components & Icons
          if (normalized.includes('/@radix-ui/') || normalized.includes('/lucide-react/') || normalized.includes('/react-icons/')) {
            return 'vendor-ui';
          }

          // 5. Data Fetching & HTTP Client
          if (normalized.includes('/@tanstack/react-query/') || normalized.includes('/axios/')) {
            return 'vendor-query';
          }

          // 6. Core React Runtime (Hanya pustaka runtime murni)
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