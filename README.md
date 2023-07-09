# 🔮

## Add a Model

The models that `depot.ai` serves are defined in `models/models.yaml` — you can fork this repo, add an additional model entry, and submit a PR to add another model. Once the PR merges, GitHub Actions will automatically build and publish it:

```yaml
- name: username/model
  sha: 1234567890abcdef1234567890abcdef12345678
  tag: latest
```
