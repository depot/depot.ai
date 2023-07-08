export async function stringDigest(str: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return `sha256:${toHex(digest)}`
}

export function toHex(buf: ArrayLike<number> | ArrayBufferLike) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
