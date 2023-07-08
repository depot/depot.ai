import type {HonoRequest} from 'hono'
import {Hono} from 'hono'
import {z} from 'zod'

// Types **********************************************************************

interface Env {
  Bindings: {
    storage: R2Bucket
    REGISTRY_TOKEN: string
    UPSTREAM_REGISTRY: string
  }
}

// Routes *********************************************************************

const app = new Hono<Env>()

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

app.get('/v2/:name{.*}/manifests/:reference', async ({req, env}) => {
  const name = req.param('name')
  const reference = req.param('reference')

  const tag = parseTag(reference)
  const digest = tag ? await resolveTagToDigest(env, name, tag) : parseDigest(reference)
  if (!digest) return json({errors: [{code: 'MANIFEST_UNKNOWN'}]}, {status: 404})
  const key = `${name}/manifests/${digest.digest}`

  const headers = new Headers({
    'Docker-Content-Digest': digest.digest,
    'Docker-Distribution-Api-Version': 'registry/2.0',
  })

  return pullThroughRegistry(
    req,
    () => getObject(req, env, key, headers),
    () => importManifest(env, name, digest),
  )
})

app.get('/v2/:name{.*}/blobs/:digest', async ({req, env}) => {
  const name = req.param('name')
  const digest = parseDigest(req.param('digest'))
  if (!digest) return json({errors: [{code: 'BLOB_UNKNOWN'}]}, {status: 404})
  const key = `${name}/blobs/${digest.digest}`

  const headers = new Headers({
    'Docker-Content-Digest': digest.digest,
    'Docker-Distribution-Api-Version': 'registry/2.0',
  })

  return pullThroughRegistry(
    req,
    () => getObject(req, env, key, headers),
    () => importBlob(env, name, digest),
  )
})

app.notFound(({json}) => json({errors: [{code: 'NOT_FOUND', message: 'not found'}]}, 404))

app.onError((err, {json}) => {
  console.log(err)
  return json({errors: [{code: 'INTERNAL_ERROR', message: err.message}]}, 500)
})

export default app

// Utils **********************************************************************

function response(bodyInit?: BodyInit | null | undefined, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers || {})
  headers.set('Docker-Distribution-API-Version', 'registry/2.0')
  init.headers = headers
  return new Response(bodyInit, init)
}

function emptyResponse(responseInit?: ResponseInit): Response {
  return response(null, responseInit)
}

function json(data: any, responseInit: ResponseInit = {}): Response {
  const headers = new Headers(responseInit.headers ?? {})
  headers.set('Content-Type', 'application/json')
  responseInit.headers = headers
  return response(JSON.stringify(data), responseInit)
}

let upstreamURL: URL | undefined

async function pullThroughRegistry(
  req: HonoRequest<any>,
  fromR2: () => Promise<Response | null>,
  fromRegistry: () => Promise<Response>,
) {
  if (req.method === 'HEAD') {
    let object = await fromR2()
    if (!object) {
      const res = await fromRegistry()
      if (!res.ok) return res
      object = await fromR2()
    }
    if (!object) return json({errors: [{code: 'BLOB_UNKNOWN'}]}, {status: 404})
    return object
  }

  const object = await fromR2()
  if (!object) return fromRegistry()
  return object
}

async function importManifest(env: Env['Bindings'], name: string, digest: Digest) {
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

async function importBlob(env: Env['Bindings'], name: string, digest: Digest) {
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

async function resolveTagToDigest(env: Env['Bindings'], name: string, tag: string) {
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

async function getObject(req: HonoRequest<any>, env: Env['Bindings'], key: string, headers: Headers) {
  if (req.method === 'HEAD') {
    const obj = await env.storage.head(key)
    if (!obj) return null
    obj.writeHttpMetadata(headers)
    headers.set('accept-ranges', 'bytes')
    headers.set('etag', obj.httpEtag)
    headers.set('content-length', obj.size.toString())
    return emptyResponse({headers})
  }

  const obj = await env.storage.get(key, {onlyIf: req.headers, range: req.headers})
  if (!obj) return null

  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  headers.set('accept-ranges', 'bytes')

  if (
    req.headers.has('range') &&
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
  console.log('Handling with R2', key, status, obj.range, [...headers.entries()])
  return new Response(body, {headers, status})
}

const tagSchema = z.string().regex(/^[\w][\w.-]{0,127}$/)

function parseTag(candidate: string) {
  const result = tagSchema.safeParse(candidate)
  return result.success ? result.data : null
}

interface Digest {
  readonly algorithm: 'sha256' | 'sha384' | 'sha512'
  readonly hash: string
  readonly digest: string
}

const digestSchema = z.string().regex(/^[a-z0-9]+(?:[.+_-][a-z0-9]+)*:[a-zA-Z0-9=_-]+$/)
function parseDigest(candidate: string): Digest | null {
  const result = digestSchema.safeParse(candidate)
  if (!result.success) return null
  const [algorithm, hash] = result.data.split(':')
  if (algorithm !== 'sha256' && algorithm !== 'sha384' && algorithm !== 'sha512') return null
  if (!hash) return null
  return {algorithm, hash, digest: result.data}
}
