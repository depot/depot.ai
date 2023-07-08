// const modelURL = 'https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned.safetensors'
// const modelURL = 'https://huggingface.co/microsoft/resnet-50/resolve/main/flax_model.msgpack'
const modelURL = 'https://huggingface.co/microsoft/resnet-50/resolve/main/README.md'

const OFFSETS = {
  name: 0,
  mode: 100,
  uid: 108,
  gid: 116,
  size: 124,
  mtime: 136,
  checksum: 148,
  typeflag: 156,
  linkname: 157,
  magic: 257,
  version: 263,
  uname: 265,
  gname: 297,
  devmajor: 329,
  devminor: 337,
  prefix: 345,
}

function writeText(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i))
  }
}

function writeOctal(view: DataView, offset: number, num: number, length: number) {
  const str = num.toString(8).padStart(length, '0')
  for (let i = 0; i < length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

const BLOCK_LENGTH = 512

function getChecksum(view: DataView) {
  const checkSumStart = OFFSETS.checksum
  const checkSumEnd = OFFSETS.checksum + 8 - 1

  let sum = 0
  for (let i = 0; i < BLOCK_LENGTH; ++i) {
    sum += i < checkSumStart || i > checkSumEnd ? view.getUint8(i) : 32
  }

  return sum
}

function byteLength(string: string) {
  let length = 0

  for (let i = 0, n = string.length; i < n; i++) {
    const code = string.charCodeAt(i)

    if (code >= 0xd800 && code <= 0xdbff && i + 1 < n) {
      const code = string.charCodeAt(i + 1)

      if (code >= 0xdc00 && code <= 0xdfff) {
        length += 4
        i++
        continue
      }
    }

    if (code <= 0x7f) length += 1
    else if (code <= 0x7ff) length += 2
    else length += 3
  }

  return length
}

const addLength = function (str: string) {
  const len = byteLength(str)
  let digits = Math.floor(Math.log(len) / Math.log(10)) + 1
  if (len + digits >= Math.pow(10, digits)) digits++

  return len + digits + str
}

export async function tarFromStream(stream: ReadableStream, filename: string, size: bigint) {
  const overflow = Number(size % BigInt(BLOCK_LENGTH)) > 0 ? 512 - Number(size % BigInt(BLOCK_LENGTH)) : 0

  // PAX header (https://pubs.opengroup.org/onlinepubs/9699919799/utilities/pax.html)

  const paxKeywords = [addLength(` path=${filename}\n`), addLength(` size=${size.toString()}\n`)]
  const paxHeaderContent = paxKeywords.join('')
  const paxHeaderContentLength = byteLength(paxHeaderContent)
  const paxOverflow = paxHeaderContentLength % BLOCK_LENGTH > 0 ? 512 - (paxHeaderContentLength % BLOCK_LENGTH) : 0
  const paxHeader = new ArrayBuffer(paxHeaderContentLength + paxOverflow)
  const paxHeaderView = new DataView(paxHeader)
  writeText(paxHeaderView, 0, paxHeaderContent)

  const paxBlock = new ArrayBuffer(512)
  const paxView = new DataView(paxBlock)

  writeText(paxView, OFFSETS.name, 'PaxHeader')
  writeText(paxView, OFFSETS.mode, '0000775')
  writeText(paxView, OFFSETS.uid, '0000000')
  writeText(paxView, OFFSETS.gid, '0000000')
  writeOctal(paxView, OFFSETS.size, paxHeaderContentLength, 11)
  writeOctal(paxView, OFFSETS.mtime, 0, 11)
  writeText(paxView, OFFSETS.checksum, '        ')
  writeText(paxView, OFFSETS.typeflag, 'x')
  writeText(paxView, OFFSETS.magic, 'ustar')
  writeText(paxView, OFFSETS.version, '00')
  writeText(paxView, OFFSETS.devmajor, '0000000')
  writeText(paxView, OFFSETS.devminor, '0000000')
  writeText(paxView, OFFSETS.prefix, '')

  const paxChecksum = getChecksum(paxView)
  writeOctal(paxView, OFFSETS.checksum, paxChecksum, 6)
  paxView.setUint8(154, 0)

  // File header

  const header = new ArrayBuffer(512)
  const view = new DataView(header)

  writeText(view, OFFSETS.name, filename.substring(0, 100))
  writeText(view, OFFSETS.mode, '0000775')
  writeText(view, OFFSETS.uid, '0000000')
  writeText(view, OFFSETS.gid, '0000000')
  writeOctal(view, OFFSETS.size, Math.max(Number(size) & 8589934591, 0), 11)
  writeOctal(view, OFFSETS.mtime, 0, 11)
  writeText(view, OFFSETS.checksum, '        ')
  writeText(view, OFFSETS.typeflag, '0')
  writeText(view, OFFSETS.magic, 'ustar')
  writeText(view, OFFSETS.version, '00')
  writeText(view, OFFSETS.devmajor, '0000000')
  writeText(view, OFFSETS.devminor, '0000000')
  writeText(view, OFFSETS.prefix, '')

  const checksum = getChecksum(view)
  writeOctal(view, OFFSETS.checksum, checksum, 6)
  view.setUint8(154, 0)

  const totalSize = 512n + BigInt(paxHeaderContentLength + paxOverflow) + 512n + size + 1024n + BigInt(overflow)

  const responseStream = new FixedLengthStream(totalSize)

  const writer = responseStream.writable.getWriter()
  writer.write(paxBlock)
  writer.write(paxHeader)
  writer.write(header)
  writer.releaseLock()

  const fileBlock = stream.pipeTo(responseStream.writable, {preventClose: true})

  fileBlock.then(() => {
    const endOfArchive = new ArrayBuffer(1024 + overflow)
    const writer = responseStream.writable.getWriter()
    writer.write(endOfArchive)
    writer.releaseLock()
    responseStream.writable.close()
  })

  return {responseStream}
}

async function tarFromURL(url: string, filename: string) {
  const res = await fetch(url, {method: 'HEAD', redirect: 'manual', headers: {'Accept-Encoding': 'identity'}})

  const sizeHeader = res.headers.get('X-Linked-Size')! ?? res.headers.get('Content-Length')!
  const size = BigInt(sizeHeader)
  const overflow = Number(size % BigInt(BLOCK_LENGTH)) > 0 ? 512 - Number(size % BigInt(BLOCK_LENGTH)) : 0

  // PAX header (https://pubs.opengroup.org/onlinepubs/9699919799/utilities/pax.html)

  const paxKeywords = [addLength(` path=${filename}\n`), addLength(` size=${size.toString()}\n`)]
  const paxHeaderContent = paxKeywords.join('')
  const paxHeaderContentLength = byteLength(paxHeaderContent)
  const paxOverflow = paxHeaderContentLength % BLOCK_LENGTH > 0 ? 512 - (paxHeaderContentLength % BLOCK_LENGTH) : 0
  const paxHeader = new ArrayBuffer(paxHeaderContentLength + paxOverflow)
  const paxHeaderView = new DataView(paxHeader)
  writeText(paxHeaderView, 0, paxHeaderContent)

  const paxBlock = new ArrayBuffer(512)
  const paxView = new DataView(paxBlock)

  writeText(paxView, OFFSETS.name, 'PaxHeader')
  writeText(paxView, OFFSETS.mode, '0000775')
  writeText(paxView, OFFSETS.uid, '0000000')
  writeText(paxView, OFFSETS.gid, '0000000')
  writeOctal(paxView, OFFSETS.size, paxHeaderContentLength, 11)
  writeOctal(paxView, OFFSETS.mtime, 0, 11)
  writeText(paxView, OFFSETS.checksum, '        ')
  writeText(paxView, OFFSETS.typeflag, 'x')
  writeText(paxView, OFFSETS.magic, 'ustar')
  writeText(paxView, OFFSETS.version, '00')
  writeText(paxView, OFFSETS.devmajor, '0000000')
  writeText(paxView, OFFSETS.devminor, '0000000')
  writeText(paxView, OFFSETS.prefix, '')

  const paxChecksum = getChecksum(paxView)
  writeOctal(paxView, OFFSETS.checksum, paxChecksum, 6)
  paxView.setUint8(154, 0)

  // File header

  const header = new ArrayBuffer(512)
  const view = new DataView(header)

  writeText(view, OFFSETS.name, filename)
  writeText(view, OFFSETS.mode, '0000775')
  writeText(view, OFFSETS.uid, '0000000')
  writeText(view, OFFSETS.gid, '0000000')
  writeOctal(view, OFFSETS.size, Math.max(Number(size) & 8589934591, 0), 11)
  writeOctal(view, OFFSETS.mtime, 0, 11)
  writeText(view, OFFSETS.checksum, '        ')
  writeText(view, OFFSETS.typeflag, '0')
  writeText(view, OFFSETS.magic, 'ustar')
  writeText(view, OFFSETS.version, '00')
  writeText(view, OFFSETS.devmajor, '0000000')
  writeText(view, OFFSETS.devminor, '0000000')
  writeText(view, OFFSETS.prefix, '')

  const checksum = getChecksum(view)
  writeOctal(view, OFFSETS.checksum, checksum, 6)
  view.setUint8(154, 0)

  const totalSize = 512n + BigInt(paxHeaderContentLength + paxOverflow) + 512n + size + 1024n + BigInt(overflow)

  const responseStream = new FixedLengthStream(totalSize)

  const writer = responseStream.writable.getWriter()
  writer.write(paxBlock)
  writer.write(paxHeader)
  writer.write(header)
  writer.releaseLock()

  const model = await fetch(url)
  const fileBlock = model.body!.pipeTo(responseStream.writable, {preventClose: true})

  fileBlock.then(() => {
    const endOfArchive = new ArrayBuffer(1024 + overflow)
    const writer = responseStream.writable.getWriter()
    writer.write(endOfArchive)
    writer.releaseLock()
    responseStream.writable.close()
  })

  return {responseStream}
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/') {
      return new Response(JSON.stringify({ok: true}), {headers: {'Content-Type': 'application/json'}})
    }

    if (url.pathname === '/metadata') {
      const res = await fetch(modelURL, {method: 'HEAD', redirect: 'manual', headers: {'Accept-Encoding': 'identity'}})
      const headers = [...res.headers.entries()]
      return new Response(JSON.stringify({headers}), {
        status: 200,
        headers: {'Content-Type': 'application/json', 'Content-Encoding': 'gzip'},
      })
    }

    if (url.pathname === '/hash') {
      const {responseStream} = await tarFromURL(modelURL, 'flax_model.msgpack')

      const digestStream = new crypto.DigestStream('SHA-256')
      responseStream.readable!.pipeTo(digestStream)
      const digest = await digestStream.digest
      const hexString = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')

      return new Response(JSON.stringify({digest: `sha256:${hexString}`}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      })
    }

    if (url.pathname === '/model.tar') {
      const {responseStream} = await tarFromURL(modelURL, 'flax_model.msgpack')

      return new Response(responseStream.readable, {
        status: 200,
        headers: {
          'Content-Type': 'application/x-tar',
          'Content-Disposition': 'attachment; filename="model.tar"',
          // 'Content-Encoding': 'gzip',
        },
      })
    }

    if (url.pathname === '/model.tar.gz') {
      const {responseStream} = await tarFromURL(modelURL, 'flax_model.msgpack')

      return new Response(responseStream.readable, {
        status: 200,
        headers: {
          'Content-Type': 'application/gzip',
          'Content-Disposition': 'attachment; filename="model.tar.gz"',
          'Content-Encoding': 'gzip',
        },
      })
    }

    return new Response('Not found', {status: 404})
  },
}
