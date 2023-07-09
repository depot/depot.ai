# 🔮 depot.ai

[`depot.ai`](https://depot.ai) is a free, open-source Docker registry for public machine learning models that makes it easy to include those models in your own `Dockerfile`.

- [Usage](#usage)
- [Add a Model](#add-a-model)

## Usage

```dockerfile
FROM base-image
WORKDIR /app

# Copy all files from the model repo to the current WORKDIR
COPY --link --from=depot.ai/runwayml/stable-diffusion-v1-5 / .

# COPY just one file from the model repo to the current WORKDIR
COPY --link --from=depot.ai/runwayml/stable-diffusion-v1-5 /v1-5-pruned.ckpt .
```

## Add a Model

The models that `depot.ai` serves are defined in `models/models.yaml` — you can fork this repo, add an additional model entry, and submit a PR to add another model. Once the PR merges, GitHub Actions will automatically build and publish it:

```yaml
- name: username/model
  sha: 1234567890abcdef1234567890abcdef12345678
  tag: latest
```
