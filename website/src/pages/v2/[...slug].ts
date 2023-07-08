import {getRuntime} from '@astrojs/cloudflare/runtime'
import type {APIRoute} from 'astro'
import {onRequest} from '../../registry'

export const all: APIRoute = ({request}) => {
  const runtime = getRuntime(request)
  const eventContext = {...runtime, request} as unknown as EventContext<any, string, any>
  return onRequest(eventContext)
}
