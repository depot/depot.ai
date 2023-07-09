import rehypePrettyCode from 'rehype-pretty-code'
import {BUNDLED_LANGUAGES, getHighlighter} from 'shiki'
import theme from './support/syntax-theme.js'

/**
 *
 * @param {import('shiki').ILanguageRegistration[]} all
 * @param {string} lang
 * @param {string} alias
 */
function aliasLanguage(all, id, alias) {
  const targetLang = all.find((lang) => lang.id === id)
  const allElse = all.filter((lang) => lang.id !== id)
  if (!targetLang) return [...all]
  const path =
    targetLang.path && !targetLang.path.startsWith('languages/') ? `languages/${targetLang.path}` : targetLang.path
  const withAlias = {...targetLang, path, aliases: targetLang.aliases ? [...targetLang.aliases, alias] : [alias]}
  return [...allElse, withAlias]
}

/**
 * @type {import('rehype-pretty-code').Options}
 */
const rehypePrettyCodeOptions = {
  theme,
  onVisitHighlightedLine(node) {
    node.properties.className.push('highlighted-line')
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ['highlighted-word']
  },
  getHighlighter: (options) => {
    let langs = BUNDLED_LANGUAGES
    langs = aliasLanguage(langs, 'docker', 'Dockerfile')
    langs = aliasLanguage(langs, 'hcl', 'terraform')
    return getHighlighter({...options, langs})
  },
}

/**
 * @type {import('rehype-autolink-headings').Options}
 */
const rehypeAutolinkHeadingsOptions = {
  test: ['h2', 'h3', 'h4', 'h5', 'h6'],
}

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ['**/.*'],
  server: './server.ts',
  serverBuildPath: 'functions/[[path]].js',
  serverConditions: ['worker'],
  serverDependenciesToBundle: 'all',
  serverMainFields: ['browser', 'module', 'main'],
  serverMinify: true,
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  tailwind: true,
  postcss: true,
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  mdx: async (_filename) => {
    const rehypeSlug = await import('rehype-slug').then((mod) => mod.default)
    const rehypeAutolinkHeadings = await import('rehype-autolink-headings').then((mod) => mod.default)
    const remarkGfm = await import('remark-gfm').then((mod) => mod.default)
    return {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
        [rehypePrettyCode, rehypePrettyCodeOptions],
      ],
      remarkPlugins: [remarkGfm],
    }
  },
}
