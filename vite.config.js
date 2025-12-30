import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@pages': path.resolve(__dirname, './pages'),
      '@components': path.resolve(__dirname, './Components'),
      '@entities': path.resolve(__dirname, './Entities'),
      '@api': path.resolve(__dirname, './api'),
      '@lib': path.resolve(__dirname, './lib'),
    },
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    strictPort: false,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'tailwindcss'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react',
      'date-fns'
    ]
  }
})
