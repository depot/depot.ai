```dockerfile
FROM base-image
WORKDIR /app

# Copy all files from the model repo to the current WORKDIR
COPY --link --from=depot.ai/runwayml/stable-diffusion-v1-5 / .

# COPY just one file from the model repo to the current WORKDIR
COPY --link --from=depot.ai/runwayml/stable-diffusion-v1-5 /v1-5-pruned.ckpt .
```
