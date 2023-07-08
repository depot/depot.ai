import {$} from 'execa'
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

  const modelListFile = args[1] || 'models/models.yaml'
  const octets = await fsp.readFile(modelListFile, 'utf8')
  const parsed: {models: Model[]} = parse(octets)

  for (const model of parsed.models) {
    await $({
      stdio: 'inherit',
    })`depot build --build-arg=MODEL=${model.name} --output=type=image,name=us-docker.pkg.dev/depot-gcp/depot-ai/${model.name}:latest,push=true,compression=estargz,oci-mediatypes=true --provenance false --progress plain -f models/Dockerfile .`
  }
  console.log('Done!')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
