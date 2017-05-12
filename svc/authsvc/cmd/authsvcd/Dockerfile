FROM alpine:latest

ENV APP authsvcd
ADD ./.build/authsvcd /go/bin/

ENTRYPOINT ["/go/bin/authsvcd"]
