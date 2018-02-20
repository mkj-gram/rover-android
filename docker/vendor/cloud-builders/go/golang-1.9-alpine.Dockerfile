# from https://github.com/GoogleCloudPlatform/cloud-builders/tree/master/go
FROM golang:1.9-alpine

# Install VCS tools to support "go get" commands and install gcc.
RUN apk add --update --no-cache git bash build-base

# We blank out the GOPATH because the base image sets it, and
# if the user of this build step does *not* set it, we want to
# explore other options for workspace derivation.
ENV GOPATH=

RUN mkdir /builder

COPY prepare_workspace.inc /builder/

COPY go.ash /builder/bin/
ENV PATH=/builder/bin:$PATH

ENTRYPOINT ["go.ash"]
