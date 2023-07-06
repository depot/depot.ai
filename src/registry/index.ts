import {handle} from 'hono/cloudflare-pages'
import {Hono} from 'hono'
import {getMetadata} from './adapters/huggingface'
import type {Env} from './env'

const app = new Hono<Env>().basePath('/v2')

app.get('/', ({text}) => text('🔮'))

const NAME_REGEX = /^[a-z0-9]+([._-][a-z0-9]+)*(\/[a-z0-9]+([._-][a-z0-9]+)*)*$/i
const REFERENCE_REGEX = /^[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}$/i
const DIGEST_REGEX = /sha256:[a-f0-9]{64}/

app.get('/:name{.*}/manifests/:reference', ({req, json}) => {
  const name = req.param('name')
  const reference = req.param('reference')

  if (!NAME_REGEX.test(name) || !REFERENCE_REGEX.test(reference) || !name.startsWith('hf/')) {
    return json({errors: [{code: 'MANIFEST_UNKNOWN', message: `manifest unknown: ${name}:${reference}`}]}, 404)
  }

  return json({name, reference})
})

app.get('/:name{.*}/blobs/:digest', ({req, json}) => {
  const name = req.param('name')
  const digest = req.param('digest')

  if (!NAME_REGEX.test(name) || !DIGEST_REGEX.test(digest) || !name.startsWith('hf/')) {
    return json({errors: [{code: 'BLOB_UNKNOWN', message: `blob unknown: ${digest}`}]}, 404)
  }

  return json({name, digest})
})

app.get('/:name{.*}/metadata/:reference', async ({req, json}) => {
  const name = req.param('name')
  const reference = req.param('reference')

  if (!NAME_REGEX.test(name) || !name.startsWith('hf/')) {
    return json({errors: [{code: 'NAME_UNKNOWN', message: `name unknown: ${name}`}]}, 404)
  }

  const parts = name.split('/')
  if (parts.length < 4) {
    return json({errors: [{code: 'NAME_UNKNOWN', message: `name unknown: ${name}`}]}, 404)
  }

  const repo = parts.slice(1, 3).join('/')
  const path = parts.slice(3).join('/')

  try {
    const metadata = await getMetadata(repo, path, reference)
    return json(metadata)
  } catch (e) {
    return json({errors: [{code: 'NAME_UNKNOWN', message: `name unknown: ${name}`}]}, 404)
  }
})

app.notFound(({json}) => json({errors: [{code: 'NOT_FOUND', message: 'not found'}]}, 404))

export const onRequest = handle(app)
