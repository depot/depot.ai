import {stringDigest} from './digest'

export interface Descriptor {
  mediaType: string
  size: number
  digest: string
}

export interface DescriptorWithContent extends Descriptor {
  content: string
}

export interface ManifestDescriptor extends Descriptor {
  platform: {
    architecture: string
    os: string
  }
}

export async function buildIndex(manifests: ManifestDescriptor[]): Promise<DescriptorWithContent> {
  const content = JSON.stringify({
    schemaVersion: 2,
    manifests,
  })
  const digest = await stringDigest(content)
  return {content, mediaType: 'application/vnd.oci.image.index.v1+json', size: content.length, digest}
}

export async function buildManifest(config: Descriptor, layers: Descriptor[]): Promise<DescriptorWithContent> {
  const content = JSON.stringify({
    schemaVersion: 2,
    config,
    layers,
  })
  const digest = await stringDigest(content)
  return {content, mediaType: 'application/vnd.oci.image.manifest.v1+json', size: content.length, digest}
}

export async function buildConfig(layers: string[]): Promise<DescriptorWithContent> {
  const content = JSON.stringify({
    created: new Date(0).toISOString(),
    architecture: 'amd64',
    os: 'linux',
    rootfs: {type: 'layers', diff_ids: layers},
  })
  const digest = await stringDigest(content)
  return {content, mediaType: 'application/vnd.oci.image.config.v1+json', size: content.length, digest}
}
