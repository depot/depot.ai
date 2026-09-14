import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import {defineConfig} from 'astro/config'

import customTheme from './support/syntax-theme.mjs'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [react()],
  markdown: {
    shikiConfig: {
      theme: customTheme,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
