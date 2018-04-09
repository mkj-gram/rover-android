FROM alpine:latest

RUN apk --no-cache add ca-certificates

RUN mkdir -p /rover/ /rover/notification/postgres/migrations/

WORKDIR /rover

COPY ./notification-service /rover/bin/
COPY ./postgres-cli /rover/bin/
COPY ./migrations /rover/notification/postgres/migrations

# service is configured from ENV vars
ENTRYPOINT ["/rover/bin/notification-service"]

# the port service listens on
EXPOSE 5100
