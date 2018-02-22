FROM alpine:latest

RUN apk --no-cache add ca-certificates tmux

RUN mkdir -p /rover/
WORKDIR /rover

ENTRYPOINT ["/usr/bin/tmux"]
