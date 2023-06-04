export async function getStream(repo: string, path: string, version: string) {
  const metadata = await getMetadata(repo, path, version)
  const model = await fetch(metadata.location)
  const stream = model.body!
  return {stream, ...metadata}
}

export async function getMetadata(repo: string, path: string, version: string) {
  const url = `https://huggingface.co/${repo}/resolve/${version}/${path}`
  const res = await fetch(url, {method: 'HEAD', redirect: 'manual', headers: {'Accept-Encoding': 'identity'}})

  if (res.status >= 400) throw new Error('not found')

  const etagHeader = res.headers.get('X-Linked-ETag')! ?? res.headers.get('ETag')!
  const location = res.headers.get('Location')! ?? url

  const sizeHeader = res.headers.get('X-Linked-Size')! ?? res.headers.get('Content-Length')!
  const size = Number(sizeHeader)
  const headers = [...res.headers.entries()]

  const etag = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(etagHeader)).then((buf) => {
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  })

  return {headers, size, etag, location}
}
