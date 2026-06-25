import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Two HTML entries so each share link is a real, crawlable page:
  //   /    – Hebrew preview (index.html)
  //   /en  – English preview (en/index.html)
  // Social crawlers (WhatsApp/Facebook) don't run JS, so the language has to
  // live in static meta tags rather than the in-app ?lang= toggle.
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        en: resolve(__dirname, 'en/index.html'),
      },
    },
  },
})
