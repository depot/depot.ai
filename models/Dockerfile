FROM debian:12-slim as downloader

# Specify the huggingface model such as microsoft/resnet-50
# depot build
# --build-arg="MODEL=microsoft/resnet-50"
# --build-arg="SHA=4067a2728b9c93fbd67b9d5a30b03495ac74a46e
# --output=type=image,name=depot.ai/microsoft/resnet-50:latest,push=true,compression=estargz,oci-mediatypes=true
# --provenance=false .
ARG MODEL
ARG SHA
ARG SOURCE_DATE_EPOCH

RUN apt-get update \
  && apt-get install -y --no-install-recommends git-lfs=3.3.0-1+b5 ca-certificates openssh-client \
  && git lfs install \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN --mount=type=ssh \
  mkdir -p ~/.ssh && \
  ssh-keyscan hf.co >> ~/.ssh/known_hosts && \
  git clone git@hf.co:${MODEL} /model && \
  cd /model && \
  git checkout ${SHA} && \
  rm -rf .git .gitattributes && \
  find . -newermt "@${SOURCE_DATE_EPOCH}" -writable -xdev | xargs touch --date="@${SOURCE_DATE_EPOCH}" --no-dereference

FROM scratch as model

LABEL org.opencontainers.image.source="https://huggingface.co/$MODEL"
LABEL org.opencontainers.image.revision="$SHA"

COPY --from=downloader /model /
