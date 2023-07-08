FROM debian:12-slim as downloader

# Specify the huggingface model such as microsoft/resnet-50
# `depot build --build-arg="MODEL=microsoft/resnet-50" --output=type=image,name=depot.ai/microsoft/resnet-50:latest,push=true,compression=estargz,oci-mediatypes=true .`
ARG MODEL

RUN apt-get update \
 && apt-get install -y --no-install-recommends git-lfs=3.3.0-1+b5 ca-certificates \
 && git lfs install \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*


RUN git clone https://huggingface.co/${MODEL} /model && rm -rf /model/.git

FROM scratch as model
COPY --from=downloader /model /
