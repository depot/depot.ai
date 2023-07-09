# 🔮 depot.ai

[`depot.ai`](https://depot.ai) is a free, open-source Docker registry for public machine learning models that makes it easy to include those models in your own `Dockerfile`.

The registry serves the [top 100 models](https://huggingface.co/models?sort=downloads) on Hugging Face, as defined in [`models/models.yaml`](models/models.yaml). You can [see a full list of models](https://depot.ai#models), or [open a PR](#add-a-model) to add a new model.

### Table of Contents

- [Usage](#usage)
- [How it works](#how-it-works)
- [Contributing](#contributing)
  - [Add a Model](#add-a-model)
- [License](#license)

## Usage

Each of [model](https://depot.ai#models) is published as a Docker image, named after its Hugging Face repository. For example, the [stable-diffusion-v1-5](https://depot.ai/runwayml/stable-diffusion-v1-5) model is published as `depot.ai/runwayml/stable-diffusion-v1-5`.

You can then use the `COPY --from` command in your `Dockerfile` to copy the model contents into your own image:

```dockerfile
# Copy all files from the model repo to the current WORKDIR
COPY --from=depot.ai/runwayml/stable-diffusion-v1-5 / .

# COPY just one file from the model repo to the current WORKDIR
COPY --from=depot.ai/runwayml/stable-diffusion-v1-5 /v1-5-pruned.ckpt .
```

👉 **If you build images with [Depot](https://depot.dev), this is all you need to do!** Depot is preconfigured to use BuildKit and eStargz to optimially build your image with the `COPY` command. If you `COPY` specific files from a model repo, Depot will pull just those files from the model image, rather than the entire repo contents, speeding up your build.

Otherwise, if you are not using Depot and would like the same lazy-loading support, you will need to do two things:

1. You will need to use [BuildKit](https://docs.docker.com/build/buildkit/) as your Docker build engine. If you are using Docker Desktop or Docker Engine v23.0 or newer, BuildKit is the default build engine. If you are using Docker Buildx, you are using BuildKit (see below about enabling support for lazy-pulling with eStargz). And if you are using an older version of Docker Engine, you can enable BuildKit by setting the `DOCKER_BUILDKIT=1` environment variable.

2. To enable lazy-pulling of just the files you need, you will also need to enable support for [eStargz](https://github.com/containerd/stargz-snapshotter/blob/main/docs/estargz.md). This means that BuildKit will only fetch the files you need from the image, rather than downloading the entire repo contents. To enable eStargz. For this, you will need to use BuildKit with Docker Buildx, and create a new builder with the following command:

   ```bash
   docker buildx create --use --buildkitd-flags '--oci-worker-snapshotter=stargz'
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

See the [Dockerfile](./models/Dockerfile) for the full implementation.

We publish images to a private [Artifact Registry](https://cloud.google.com/artifact-registry) as a temporary storage location, then a [Cloudflare Worker](./src/registry.ts) imports the image from Artifact Registry, stores it in R2, and serves it as a public Docker registry.

## Contributing

Contributions are welcome!

### Add a Model

The models that `depot.ai` serves are defined in `models/models.yaml` — you can fork this repo, add an additional model entry, and submit a PR to add another model. Once the PR merges, GitHub Actions will automatically build and publish it:

```yaml
- name: username/model
  sha: 1234567890abcdef1234567890abcdef12345678
  tag: latest
```

## License

MIT License, see [LICENSE](./LICENSE).
