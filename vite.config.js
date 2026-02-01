import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Custom plugin to handle SPA routing (prevent /app from being treated as App.jsx)
function spaFallbackPlugin() {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // List of SPA routes that should serve index.html
        const spaRoutes = ['/app', '/login', '/register', '/dashboard', '/admin', '/confirm'];
        const url = req.url?.split('?')[0] || '';

        // If the URL starts with any SPA route, serve index.html
        if (spaRoutes.some(route => url === route || url.startsWith(route + '/'))) {
          req.url = '/';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  // Point Vite at your app folder
  root: path.resolve(__dirname, 'src/app'),
  publicDir: path.resolve(__dirname, 'public'),

  // Make sure env files are loaded from project root
  envDir: path.resolve(__dirname),

  // SPA mode for proper history API fallback
  appType: 'spa',

  plugins: [spaFallbackPlugin(), react()],

  resolve: {
    alias: {
      // "@" now means <project-root>/src
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/services/utils'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'terser', // Better minification
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk for core React libraries (loaded on all pages)
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }

          // Google Maps in separate chunk (only loaded when map page is accessed)
          if (id.includes('@react-google-maps/api') ||
              id.includes('node_modules/@googlemaps')) {
            return 'vendor-maps';
          }

          // Firebase (authentication, etc.)
          if (id.includes('node_modules/firebase') ||
              id.includes('node_modules/@firebase')) {
            return 'vendor-firebase';
          }

          // Redux and state management
          if (id.includes('node_modules/@reduxjs') ||
              id.includes('node_modules/redux')) {
            return 'vendor-state';
          }

          // Form libraries
          if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/yup')) {
            return 'vendor-forms';
          }

          // UI libraries (icons, etc.)
          if (id.includes('node_modules/@mui') ||
              id.includes('node_modules/@emotion') ||
              id.includes('node_modules/lucide-react')) {
            return 'vendor-ui';
          }

          // Utilities (axios, date libraries, etc.)
          if (id.includes('node_modules/axios') ||
              id.includes('node_modules/date-fns')) {
            return 'vendor-utils';
          }

          // All other node_modules go into a general vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor-other';
          }

          // Code-split pages into separate chunks (route-based splitting)
          if (id.includes('src/pages/')) {
            // Extract page name from path for better chunk names
            const pageName = id.split('src/pages/')[1]?.split('/')[0]?.split('.')[0];
            if (pageName) {
              return `page-${pageName.toLowerCase()}`;
            }
          }

          // Code-split admin pages separately
          if (id.includes('src/pages/admin/')) {
            const pageName = id.split('src/pages/admin/')[1]?.split('.')[0];
            if (pageName) {
              return `admin-${pageName.toLowerCase()}`;
            }
          }
        },
        // Optimize chunk file names for better caching
        entryFileNames: 'assets/entry-[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Enable compression reporting
    reportCompressedSize: true,
    // Optimize chunk size
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },

  // Ensure environment variables are properly handled
  define: {
    // This makes sure env vars are available at build time
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
})