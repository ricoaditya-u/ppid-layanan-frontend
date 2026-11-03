import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), EnvironmentPlugin('all')],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // Same-origin requests in dev -> no CORS.
  // Keep VITE_API_BASE_URL=/api/ppid to match this proxy prefix.
  server: {
    proxy: {
      '/api/ppid': {
        target: 'https://spl.bssn.go.id/ppid',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/ppid/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Upstream blocks write endpoints when Origin/Referer is present.
            proxyReq.removeHeader('origin')
            proxyReq.removeHeader('referer')
          })
        }
      },
      '/ppid/download': {
        target: 'https://spl-dev.bssn.go.id',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
