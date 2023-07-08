import type {HonoRequest} from 'hono'
import {z} from 'zod'

export interface Env {
  Bindings: {
    storage: R2Bucket
    REGISTRY_TOKEN: string
    UPSTREAM_REGISTRY: string
  }
}

export function response(bodyInit?: BodyInit | null | undefined, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers || {})
  headers.set('Docker-Distribution-API-Version', 'registry/2.0')
  init.headers = headers
  return new Response(bodyInit, init)
}

export function emptyResponse(responseInit?: ResponseInit): Response {
  return response(null, responseInit)
}

export function json(data: any, responseInit: ResponseInit = {}): Response {
  const headers = new Headers(responseInit.headers ?? {})
  headers.set('Content-Type', 'application/json')
  responseInit.headers = headers
  return response(JSON.stringify(data), responseInit)
}

let upstreamURL: URL | undefined

export async function importManifest(env: Env['Bindings'], name: string, digest: Digest) {
  upstreamURL = upstreamURL ?? new URL(env.UPSTREAM_REGISTRY)

  const url = new URL(`https://registry/v2/${upstreamURL.pathname}/${name}/manifests/${digest.digest}`)
  url.protocol = upstreamURL.protocol
  url.hostname = upstreamURL.hostname

  const headers = new Headers()
  headers.set('accept', '*/*')
  headers.set('authorization', `Basic ${env.REGISTRY_TOKEN}`)

  const res = await fetch(url, {headers})
  if (!res.ok || !res.body) return res

  await env.storage.put(`${name}/manifests/${digest.digest}`, res.body, {
    sha256: digest.hash,
    httpMetadata: {
      contentEncoding: res.headers.get('content-encoding') ?? undefined,
      contentType: res.headers.get('content-type') ?? undefined,
    },
  })

  const obj = await env.storage.get(`${name}/manifests/${digest.digest}`)
  if (!obj) return new Response(null, {status: 404})
  return new Response(obj.body, res)
}

export async function importBlob(env: Env['Bindings'], name: string, digest: Digest) {
  upstreamURL = upstreamURL ?? new URL(env.UPSTREAM_REGISTRY)

  const url = new URL(`https://registry/v2/${upstreamURL.pathname}/${name}/blobs/${digest.digest}`)
  url.protocol = upstreamURL.protocol
  url.hostname = upstreamURL.hostname

  const headers = new Headers()
  headers.set('accept', '*/*')
  headers.set('authorization', `Basic ${env.REGISTRY_TOKEN}`)

  const res = await fetch(url, {headers})
  if (!res.ok || !res.body) return res

  await env.storage.put(`${name}/blobs/${digest.digest}`, res.body, {
    sha256: digest.hash,
    httpMetadata: {
      contentEncoding: res.headers.get('content-encoding') ?? undefined,
      contentType: res.headers.get('content-type') ?? undefined,
    },
  })

  const obj = await env.storage.get(`${name}/blobs/${digest.digest}`)
  if (!obj) return new Response(null, {status: 404})
  return new Response(obj.body, res)
}

export async function resolveTagToDigest(env: Env['Bindings'], name: string, tag: string) {
  const obj = await env.storage.get(`${name}/tags/${tag}`)
  if (obj) return parseDigest(await obj.text())

  upstreamURL = upstreamURL ?? new URL(env.UPSTREAM_REGISTRY)

  const url = new URL(`https://registry/v2/${upstreamURL.pathname}/${name}/manifests/${tag}`)
  url.protocol = upstreamURL.protocol
  url.hostname = upstreamURL.hostname

  const headers = new Headers()
  headers.set('accept', '*/*')
  headers.set('authorization', `Basic ${env.REGISTRY_TOKEN}`)

  const res = await fetch(url, {headers})
  if (!res.ok) return null

  const digest = res.headers.get('Docker-Content-Digest')
  if (!digest) return null

  await env.storage.put(`${name}/tags/${tag}`, digest)
  return parseDigest(digest)
}

export async function getObject(req: HonoRequest<any>, env: Env['Bindings'], key: string, headers: Headers) {
  const obj = await env.storage.get(key, {onlyIf: req.headers, range: req.headers})
  if (!obj) return null

  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)

  if (
    obj.range &&
    'offset' in obj.range &&
    'length' in obj.range &&
    obj.range.offset != undefined &&
    obj.range.length != undefined
  ) {
    headers.set('content-range', `bytes ${obj.range.offset}-${obj.range.offset + obj.range.length - 1}/${obj.size}`)
    headers.set('content-length', (obj.range.length != undefined ? obj.range.length : obj.size).toString())
  } else {
    headers.set('content-length', obj.size.toString())
  }

  const body = 'body' in obj && obj.body ? obj.body : null
  const status = 'body' in obj && obj.body ? (req.headers.get('range') !== null ? 206 : 200) : 304
  console.log('Handling with R2', key, status, obj.range, JSON.stringify([...headers.entries()]))
  return new Response(body, {headers, status})
}

const tagSchema = z.string().regex(/^[\w][\w.-]{0,127}$/)

export function parseTag(candidate: string) {
  const result = tagSchema.safeParse(candidate)
  return result.success ? result.data : null
}

export interface Digest {
  readonly algorithm: 'sha256' | 'sha384' | 'sha512'
  readonly hash: string
  readonly digest: string
}

const digestSchema = z.string().regex(/^[a-z0-9]+(?:[.+_-][a-z0-9]+)*:[a-zA-Z0-9=_-]+$/)
export function parseDigest(candidate: string): Digest | null {
  const result = digestSchema.safeParse(candidate)
  if (!result.success) return null
  const [algorithm, hash] = result.data.split(':')
  if (algorithm !== 'sha256' && algorithm !== 'sha384' && algorithm !== 'sha512') return null
  if (!hash) return null
  return {algorithm, hash, digest: result.data}
}
