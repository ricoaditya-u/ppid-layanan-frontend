import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

import ProjectConst from './src/const'

const externalPackages = [
  '@bssn/ui-kit-frontend',
  'axios',
  'flowbite',
  'pinia',
  'tailwindcss',
  'vee-validate',
  'vue',
  'vue-router',
  'yup'
]

export default defineConfig({
  plugins: [vue(), tailwindcss(), EnvironmentPlugin('all')],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: ProjectConst.name,
      formats: ['es'],
      fileName: () => `${ProjectConst.slug}.js`
    },
    rollupOptions: {
      external: (id) => externalPackages.some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
    },
    outDir: 'dist/lib',
    minify: 'esbuild'
  }
})