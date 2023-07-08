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

export interface ResponseError {
  code: string
  message: string
  detail?: any
}

export function errorResponse(errors: ResponseError[], responseInit: ResponseInit = {status: 400}) {
  return json({errors}, responseInit)
}

export const ERROR = {
  BLOB_UNKNOWN: {
    code: 'BLOB_UNKNOWN',
    message: 'blob unknown to registry',
  },
  BLOB_UPLOAD_INVALID: {
    code: 'BLOB_UPLOAD_INVALID',
    message: 'blob upload invalid',
  },
  BLOB_UPLOAD_UNKNOWN: {
    code: 'BLOB_UPLOAD_UNKNOWN',
    message: 'blob upload unknown to registry',
  },
  DIGEST_INVALID: {
    code: 'DIGEST_INVALID',
    message: 'provided digest did not match uploaded content',
  },
  MANIFEST_BLOB_UNKNOWN: {
    code: 'MANIFEST_BLOB_UNKNOWN',
    message: 'manifest references a manifest or blob unknown to registry',
  },
  MANIFEST_INVALID: {
    code: 'MANIFEST_INVALID',
    message: 'manifest invalid',
  },
  MANIFEST_UNKNOWN: {
    code: 'MANIFEST_UNKNOWN',
    message: 'manifest unknown to registry',
  },
  NAME_INVALID: {
    code: 'NAME_INVALID',
    message: 'invalid repository name',
  },
  NAME_UNKNOWN: {
    code: 'NAME_UNKNOWN',
    message: 'repository name not known to registry',
  },
  SIZE_INVALID: {
    code: 'SIZE_INVALID',
    message: 'provided length did not match content length',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'authentication required',
  },
  DENIED: {
    code: 'DENIED',
    message: 'requested access to the resource is denied',
  },
  UNSUPPORTED: {
    code: 'UNSUPPORTED',
    message: 'the operation is unsupported',
  },
  TOOMANYREQUESTS: {
    code: 'TOOMANYREQUESTS',
    message: 'too many requests',
  },
}
