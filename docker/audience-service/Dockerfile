FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

RUN mkdir -p /rover/

WORKDIR /rover

COPY ./audience /rover/bin/

# service is configured from ENV vars
ENTRYPOINT ["/rover/bin/audience"]

# the port service listens on
EXPOSE 5100
