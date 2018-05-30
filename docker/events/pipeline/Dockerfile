FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

COPY ./pipeline /rover/bin/

# service is configured from ENV vars
ENTRYPOINT ["/rover/bin/pipeline"]
