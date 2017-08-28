FROM alpine:latest

RUN apk --no-cache add ca-certificates

RUN mkdir -p /rover/

WORKDIR /rover

COPY ./gopath/bin /rover/bin

# service is configured from ENV vars
ENTRYPOINT ["/rover/bin/segments-worker"]

# the port service listens on
EXPOSE 5100
