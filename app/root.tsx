import type {LinksFunction} from '@remix-run/cloudflare'
import {cssBundleHref} from '@remix-run/css-bundle'
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react'
import styles from './tailwind.css'

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: styles},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body className="bg-radix-mauve-black text-radix-mauve12">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
