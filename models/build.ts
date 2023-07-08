import * as fsp from 'node:fs/promises'
import {parse} from 'yaml'

export interface Model {
  name: string
  sha: string
}

async function main() {
  const args = process.argv.slice(2)
  args.length !== 1 ||
    (() => {
      throw new Error('Usage: build.ts <modelList>')
    })()

  const modelListFile = args[1] || 'models.yaml'
  const octets = await fsp.readFile(modelListFile, 'utf8')
  const parsed: {models: Model[]} = parse(octets)

  for (const model of parsed.models) {
    await $({
      stdio: 'inherit',
    })`depot build --platform linux/amd64,linux/arm64 --build-arg=MODEL=${model.name} --build-arg=SHA=${model.sha} --output=type=image,name=us-docker.pkg.dev/depot-gcp/depot-ai/${model.name}:latest,push=true,compression=estargz,oci-mediatypes=true,annotation.org.opencontainers.image.revision=${model.sha},annotation.org.opencontainers.image.source=https://huggingface.co/${model.name},annotation-index.org.opencontainers.image.revision=${model.sha},annotation-index.org.opencontainers.image.source=https://huggingface.co/${model.name},annotation-manifest-descriptor.org.opencontainers.image.revision=${model.sha},annotation-manifest-descriptor.org.opencontainers.image.source=https://huggingface.co/${model.name} --provenance false --progress plain -f Dockerfile .`
  }
  console.log('Done!')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
