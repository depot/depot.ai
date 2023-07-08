/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-floating-promises */
import type {HonoRequest} from 'hono'
import {Hono} from 'hono'
import {z} from 'zod'
import {ERROR, emptyResponse, errorResponse, response} from './utils'

function proxyArtifactRegistry(req: HonoRequest<any>, authorization: string) {
  const url = new URL(req.url)
  url.protocol = 'https:'
  url.hostname = 'us-docker.pkg.dev'
  url.pathname = `/v2/depot-gcp/depot-ai${url.pathname.replace('/v2/', '/').replace('/_slurp', '')}`

  const headers = new Headers(req.headers)
  headers.delete('range')
  headers.set('Authorization', authorization)

  return fetch(url, {method: req.method, headers})
}

interface Env {
  Bindings: {
    storage: R2Bucket
    uploadSessions: DurableObjectNamespace
    REGISTRY_TOKEN: string
  }
}

const app = new Hono<Env>().basePath('/')
export default app

/***********************************************
 * Base
 ***********************************************/

app.use('*', async (c, next) => {
  c.executionCtx.passThroughOnException()
  await next()
})

app.use('*', async (c, next) => {
  console.log('START', c.req.method, c.req.url)
  await next()
  console.log('END', c.req.method, c.req.url, c.res.status)
})

app.get('/', ({text}) => text('🔮'))
app.get('/v2/', ({text}) => text('🔮'))

/***********************************************
 * Manifests
 ***********************************************/

app.get('/v2/:name{.*}/manifests/:reference', async ({req, env}) => {
  return proxyArtifactRegistry(req, `Basic ${env.REGISTRY_TOKEN}`)

  const name = req.param('name')
  const reference = req.param('reference')

  let digest = parseDigest(reference)?.digest
  const tag = parseTag(reference)

  // If tag is supplied, resolve it to a digest
  if (tag) {
    const obj = await env.storage.get(`${name}/tags/${tag}`)
    if (!obj) return emptyResponse({status: 404})
    digest = await obj.text()
  }

  if (digest) {
    const headers = new Headers({'Docker-Content-Digest': digest})

    if (req.method === 'HEAD') {
      const object = await env.storage.head(`${name}/manifests/${digest}`)
      if (object) {
        object.writeHttpMetadata(headers)
        headers.set('Content-Length', object.size.toString())
        return emptyResponse({headers})
      }
    } else {
      const object = await env.storage.get(`${name}/manifests/${digest}`)
      if (object) {
        object.writeHttpMetadata(headers)
        return response(object.body, {headers})
      }
    }
  }

  return emptyResponse({status: 404})
})

app.post('/v2/:name{.*}/manifests/:reference/_slurp', async ({req, env}) => {
  const name = req.param('name')
  const reference = req.param('reference')

  const url = new URL(req.url)
  url.hostname = 'us-docker.pkg.dev'
  url.pathname = `/v2/depot-gcp/depot-ai${url.pathname.replace('/v2/', '/').replace('/_slurp', '')}`

  console.log(`Slurping ${url}`, {
    Authorization: `Basic ${env.REGISTRY_TOKEN}`,
  })

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${env.REGISTRY_TOKEN}`,
      Accept: '*/*',
    },
  })

  console.log(res.status, res.statusText)

  return res
})

/***********************************************
 * Blobs
 ***********************************************/

app.get('/v2/:name{.*}/blobs/:digest', async ({req, env}) => {
  const name = req.param('name')
  const digest = req.param('digest')

  const key = `${name}/blobs/${digest}`
  console.log(key, [...req.headers.entries()])

  if (!(await env.storage.head(key))) {
    console.log(`Attempting to slurp ${key} from artifact registry`)
    const res = await proxyArtifactRegistry(req, `Basic ${env.REGISTRY_TOKEN}`)
    if (!res.ok) return res
    const object = await env.storage.put(key, res.body!, {
      sha256: digest.replace('sha256:', ''),
      httpMetadata: {
        contentEncoding: res.headers.get('content-encoding') ?? undefined,
        contentType: res.headers.get('content-type') ?? undefined,
      },
    })
    console.log('success', object)
  }

  if (req.method === 'HEAD') {
    const obj = await env.storage.head(key)
    if (!obj) return emptyResponse({status: 404})
    return emptyResponse({
      headers: {
        'Content-Length': obj.size.toString(),
        'Docker-Content-Digest': digest,
      },
    })
  }

  const obj = await env.storage.get(key, {onlyIf: req.headers, range: req.headers})
  if (!obj) return errorResponse([ERROR.BLOB_UNKNOWN], {status: 404})
  const headers = new Headers({
    // 'Content-Length': obj.size.toString(),
    // 'Content-Type': 'application/octet-stream',
    'Docker-Content-Digest': digest,
  })
  console.log(obj.httpMetadata)
  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  if (obj.range) {
    headers.set('content-range', `bytes ${obj.range.offset}-${obj.range.offset + obj.range.length - 1}/${obj.size}`)
  }
  headers.set('content-length', (obj.range?.length ?? obj.size).toString())
  const status = obj.body ? (req.headers.get('range') !== null ? 206 : 200) : 304
  console.log('Handling with R2', key, status, obj.range, JSON.stringify([...headers.entries()]))
  return new Response(obj.body, {
    headers,
    status,
  })
})

app.notFound(({json}) => json({errors: [{code: 'NOT_FOUND', message: 'not found'}]}, 404))

app.onError((err, {json}) => {
  console.log(err)
  return json({errors: [{code: 'INTERNAL_ERROR', message: err.message}]}, 500)
})

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

const algorithmToCrypto = {sha256: 'SHA-256', sha384: 'SHA-384', sha512: 'SHA-512'} as const

const digestSchema = z.string().regex(/^[a-z0-9]+(?:[.+_-][a-z0-9]+)*:[a-zA-Z0-9=_-]+$/)
export function parseDigest(candidate: string): Digest | null {
  const result = digestSchema.safeParse(candidate)
  if (!result.success) return null
  const [algorithm, hash] = result.data.split(':')
  if (algorithm !== 'sha256' && algorithm !== 'sha384' && algorithm !== 'sha512') return null
  if (!hash) return null
  return {algorithm, hash, digest: result.data}
}

function arrayBufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function digestOfStream(algorithm: Digest['algorithm'], stream: ReadableStream) {
  const digestStream = new crypto.DigestStream(algorithmToCrypto[algorithm])
  stream.pipeTo(digestStream)
  const digestBuffer = await digestStream.digest
  return `${algorithm}:${arrayBufferToHex(digestBuffer)}`
}

export async function digestOfString(algorithm: Digest['algorithm'], string: string) {
  const digestBuffer = await crypto.subtle.digest(algorithmToCrypto[algorithm], new TextEncoder().encode(string))
  return `${algorithm}:${arrayBufferToHex(digestBuffer)}`
}

export async function storeWithDigest(
  storage: R2Bucket,
  key: string,
  stream: ReadableStream,
  algorithm: Digest['algorithm'],
) {
  const [a, b] = stream.tee()
  const digest = await digestOfStream(algorithm, a)
  return await storage.put(key, b, {customMetadata: {digest: digest}})
}

export const supportedManifestContentTypes = [
  'application/vnd.docker.distribution.manifest.v2+json',
  'application/vnd.docker.distribution.manifest.list.v2+json',

  'application/vnd.oci.descriptor.v1+json',
  'application/vnd.oci.layout.header.v1+json',
  'application/vnd.oci.image.index.v1+json',
  'application/vnd.oci.image.manifest.v1+json',
  'application/vnd.oci.image.config.v1+json',
]

export const supportedLayerContentTypes = [
  'application/vnd.docker.image.rootfs.diff.tar.gzip',

  'application/vnd.oci.image.layer.v1.tar',
  'application/vnd.oci.image.layer.v1.tar+gzip',
  'application/vnd.oci.image.layer.v1.tar+zstd',
]

export const supportedContentTypes = [...supportedManifestContentTypes, ...supportedLayerContentTypes]
