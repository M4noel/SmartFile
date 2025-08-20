import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: '[name].[hash][extname]',
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      esmExternals: true,
    },
  },
  worker: {
    format: 'es',
    plugins: () => [], // <- aqui deve ser função que retorna um array
  },
  optimizeDeps: {
    include: [
      'pdfjs-dist/legacy/build/pdf.mjs',
      'pdfjs-dist/legacy/build/pdf.worker.mjs',
    ],
    exclude: [
      '@vue/devtools-api',
      'pdfjs-dist/build/pdf',
      'pdfjs-dist/build/pdf.worker',
      'pdfjs-dist/legacy/build/pdf',
      'pdfjs-dist/legacy/build/pdf.worker',
    ],
    esbuildOptions: {
      keepNames: true,
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    },
  },
})
