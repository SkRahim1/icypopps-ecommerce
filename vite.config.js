import { defineConfig } from 'vite'

import { resolve } from 'path'

export default defineConfig({
  base: '/icypopps-ecommerce/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        franchisee: resolve(__dirname, 'franchisee.html'),
      }
    }
  }
})
