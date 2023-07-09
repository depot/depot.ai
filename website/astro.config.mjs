import tailwind from '@astrojs/tailwind'
import {defineConfig} from 'astro/config'
import customTheme from './support/syntax-theme.mjs'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {theme: customTheme},
  },
})
