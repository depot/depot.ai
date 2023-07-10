import * as fsp from 'node:fs/promises'
import {parse, stringify} from 'yaml'
import type {Model} from './build'

interface HuggingFaceModel {
  id: string
  sha: string
}

async function getHuggingFaceModel(name: string): Promise<HuggingFaceModel> {
  const response = await fetch(`https://huggingface.co/api/models/${name}`)
  return await response.json()
}

async function main() {
  const args = process.argv.slice(2)
  const modelsFile = args.length === 1 ? args[0] : 'models/models.yaml'

  const octets = await fsp.readFile(modelsFile, 'utf-8')
  const parsed: {models: Model[]} = parse(octets)
  parsed.models = await Promise.all(
    parsed.models.map(async (model) => {
      const huggingFaceModel = await getHuggingFaceModel(model.name)
      return {
        name: model.name,
        sha: huggingFaceModel.sha,
        tagAs: model.tagAs,
      }
    }),
  )

  const yaml = stringify(parsed)
  await fsp.writeFile(modelsFile, yaml)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
