# 🔮 depot.ai

[`depot.ai`](https://depot.ai) is a free, open-source Docker registry for public machine learning models that makes it easy to include those models in your own `Dockerfile`.

The registry serves the [top 100 models](https://huggingface.co/models?sort=downloads) on Hugging Face, as defined in [`models/models.yaml`](models/models.yaml). You can [see a full list of models](https://depot.ai#models), or [open a PR](#add-a-model) to add a new model.

### Table of Contents

- [Usage](#usage)
- [How it works](#how-it-works)
- [Add a Model](#add-a-model)

## Usage

Each of [the models](https://depot.ai#models) are published as a Docker image, named after the Hugging Face repository. For example, the [stable-diffusion-v1-5](https://depot.ai/runwayml/stable-diffusion-v1-5) model is published as `depot.ai/runwayml/stable-diffusion-v1-5`.

You can then use the `COPY --from` command in your `Dockerfile` to copy the model contents into your own image:

```dockerfile
# Copy all files from the model repo to the current WORKDIR
COPY --link --from=depot.ai/runwayml/stable-diffusion-v1-5 / .

# COPY just one file from the model repo to the current WORKDIR
COPY --link --from=depot.ai/runwayml/stable-diffusion-v1-5 /v1-5-pruned.ckpt .
```

## How it works

Each model is published as a Docker image containing the model contents as a single layer. Conceptually, the image is constructed like:

```dockerfile
FROM scratch
COPY model /
```

Finally, the image layer is built with two specific techniques:

1. We set [SOURCE_DATE_EPOCH](https://github.com/moby/buildkit/blob/master/docs/build-repro.md#source_date_epoch) to `0`, which sets the file created time to the Unix epoch. This ensures that the image layer is reproducible, meaning if the model file contents inside have not changed, the build produces the same layer.
2. The image is compressed with [eStargz](https://github.com/containerd/stargz-snapshotter/blob/main/docs/estargz.md), which creates an index of the files inside the layer and enables lazy-pulling of just the files requested by the `COPY` command. This means that if you want to include just one file from an otherwise large model repo, BuildKit will only copy that one file into your image.

## Add a Model

The models that `depot.ai` serves are defined in `models/models.yaml` — you can fork this repo, add an additional model entry, and submit a PR to add another model. Once the PR merges, GitHub Actions will automatically build and publish it:

```yaml
- name: username/model
  sha: 1234567890abcdef1234567890abcdef12345678
  tag: latest
```
