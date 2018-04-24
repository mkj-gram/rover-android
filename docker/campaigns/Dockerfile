FROM alpine:latest

RUN apk --no-cache add ca-certificates

RUN mkdir -p /rover/bin /rover/campaigns/postgres

WORKDIR /rover

COPY ./campaigns-* /rover/bin/
COPY ./postgres-cli /rover/bin/
COPY ./postgres/migrations /rover/campaigns/postgres/migrations
