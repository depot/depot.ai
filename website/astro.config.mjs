import {defineConfig} from 'astro/config'

import cloudflare from '@astrojs/cloudflare'
import tailwind from '@astrojs/tailwind'

import customTheme from './support/syntax-theme.cjs'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {theme: customTheme},
  },
})
