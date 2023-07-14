import tailwind from '@astrojs/tailwind'
import {defineConfig} from 'astro/config'
import customTheme from './support/syntax-theme.mjs'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [tailwind(), react()],
  markdown: {
    shikiConfig: {
      theme: customTheme,
    },
  },
})
