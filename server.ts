import {logDevReady} from '@remix-run/cloudflare'
import {createPagesFunctionHandler} from '@remix-run/cloudflare-pages'
import * as build from '@remix-run/dev/server-build'

declare module '@remix-run/cloudflare' {
  export interface AppLoadContext extends EventContext<{storage: R2Bucket}, any, any> {}
}

if (process.env.NODE_ENV === 'development') {
  logDevReady(build)
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    return context
  },
  mode: process.env.NODE_ENV,
})
