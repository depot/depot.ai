FROM debian:12-slim as downloader

# Specify the huggingface model such as microsoft/resnet-50
# depot build
# --build-arg="MODEL=microsoft/resnet-50"
# --build-arg="SHA=4067a2728b9c93fbd67b9d5a30b03495ac74a46e
# --output=type=image,name=depot.ai/microsoft/resnet-50:latest,push=true,compression=estargz,oci-mediatypes=true
# --provenance=false .
ARG MODEL
ARG SHA

RUN apt-get update \
 && apt-get install -y --no-install-recommends git-lfs=3.3.0-1+b5 ca-certificates \
 && git lfs install \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*


RUN git clone https://huggingface.co/${MODEL} /model && cd /model && git checkout ${SHA} && rm -rf /model/.git

FROM scratch as model

LABEL org.opencontainers.image.source="https://huggingface.co/$MODEL"
LABEL org.opencontainers.image.revision="$SHA"

COPY --from=downloader /model /