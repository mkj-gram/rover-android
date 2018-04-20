FROM alpine:latest

RUN apk --no-cache add ca-certificates

RUN mkdir -p /rover/ /rover/notification/postgres/migrations/ /rover/notification/scylla/migrations/

WORKDIR /rover

COPY ./notification-service /rover/bin/
COPY ./notification-push-worker /rover/bin/
COPY ./postgres-cli /rover/bin/
COPY ./scylla-cli /rover/bin/
COPY ./postgres/migrations /rover/notification/postgres/migrations
COPY ./scylla/migrations /rover/notification/scylla/migrations
