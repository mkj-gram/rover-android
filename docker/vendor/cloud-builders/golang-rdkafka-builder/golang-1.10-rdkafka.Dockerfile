FROM roverio/golang-rdkafka:1.10-alpine

# We blank out the GOPATH because the base image sets it, and
# if the user of this build step does *not* set it, we want to
# explore other options for workspace derivation.
ENV GOPATH=

RUN mkdir /builder

COPY prepare_workspace.inc /builder/

COPY go.ash /builder/bin/
ENV PATH=/builder/bin:$PATH

ENTRYPOINT ["go.ash"]
