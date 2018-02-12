FROM alpine:latest

RUN apk --no-cache add ca-certificates

RUN mkdir -p /rover/

WORKDIR /rover

COPY ./audience-segments-worker /rover/bin/

# service is configured from ENV vars
ENTRYPOINT ["/rover/bin/audience-segments-worker"]

# the port service listens on
EXPOSE 5100
