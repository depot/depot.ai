type Source = 'huggingface'

// Stored as manifest:source:repo:path:ref:etag
interface Manifest {
  source: Source
  repo: string
  path: string
  ref: string
  etag: string
  content: string
}
