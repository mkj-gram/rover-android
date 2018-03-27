FROM alpine:latest

RUN apk --no-cache add ca-certificates

RUN mkdir -p /rover/

WORKDIR /rover

COPY ./scheduled_notification_tasks-worker /rover/bin/

# service is configured from ENV vars
ENTRYPOINT ["/rover/bin/scheduled_notification_tasks-worker"]

# the port service listens on
EXPOSE 5100
