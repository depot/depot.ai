import * as fsp from 'node:fs/promises'
import {stringify} from 'yaml'
import type {Model} from './build'

// Gets the names of the top downloaded models from HuggingFace.
async function getTopHuggingFaceModels(topN: number): Promise<Model[]> {
  const response = await fetch(`https://huggingface.co/api/models?sort=downloads&direction=-1&limit=${topN}&full=true`)

  interface HuggingFaceModel {
    id: string
    sha: string
  }

  const data: HuggingFaceModel[] = await response.json()
  return data.map(({id, sha}) => ({name: id, sha}))
}

async function main() {
  const args = process.argv.slice(2)
  args.length === 1 ||
    args.length === 2 ||
    (() => {
      throw new Error('Usage: top.ts <topN> [outputFile]')
    })()
  if (args.length === 1) {
    args.push('models/models.yaml')
  }
  const topN = parseInt(args[0] || '100')
  const outputFile = args[1] || 'models/models.yaml'

  const models = {models: await getTopHuggingFaceModels(topN)}
  const yaml = stringify(models)
  await fsp.writeFile(outputFile, yaml)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
