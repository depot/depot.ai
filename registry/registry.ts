import {Hono} from 'hono'
import type {Env} from './utils'
import {
  emptyResponse,
  getObject,
  importBlob,
  importManifest,
  json,
  parseDigest,
  parseTag,
  resolveTagToDigest,
  response,
} from './utils'

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

  let digest = parseDigest(reference)
  const tag = parseTag(reference)

  // If tag is supplied, resolve it to a digest
  if (tag) digest = await resolveTagToDigest(env, name, reference)
  if (!digest) return json({errors: [{code: 'MANIFEST_UNKNOWN'}]}, {status: 404})

  const headers = new Headers({
    'Docker-Content-Digest': digest.digest,
    'Docker-Distribution-Api-Version': 'registry/2.0',
  })

  if (req.method === 'HEAD') {
    let object = await env.storage.head(`${name}/manifests/${digest.digest}`)
    if (!object) {
      const res = await importManifest(env, name, digest)
      if (!res.ok) return res
      object = await env.storage.head(`${name}/manifests/${digest.digest}`)
    }
    if (object) {
      object.writeHttpMetadata(headers)
      headers.set('Content-Length', object.size.toString())
      return emptyResponse({headers})
    }
    return json({errors: [{code: 'MANIFEST_UNKNOWN'}]}, {status: 404})
  }

  const object = await env.storage.get(`${name}/manifests/${digest.digest}`)
  if (!object) return await importManifest(env, name, digest)
  object.writeHttpMetadata(headers)
  return response(object.body, {headers})
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

  if (req.method === 'HEAD') {
    let object = await env.storage.head(key)
    if (!object) {
      const res = await importBlob(env, name, digest)
      if (!res.ok) return res
      object = await env.storage.head(key)
    }
    if (!object) return json({errors: [{code: 'BLOB_UNKNOWN'}]}, {status: 404})
    object.writeHttpMetadata(headers)
    headers.set('Content-Length', object.size.toString())
    return emptyResponse({headers})
  }

  const res = await getObject(req, env, key, headers)
  if (!res) return importBlob(env, name, digest)
  return res
})

app.notFound(({json}) => json({errors: [{code: 'NOT_FOUND', message: 'not found'}]}, 404))

app.onError((err, {json}) => {
  console.log(err)
  return json({errors: [{code: 'INTERNAL_ERROR', message: err.message}]}, 500)
})

export default app
