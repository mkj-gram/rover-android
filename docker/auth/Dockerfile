FROM alpine:latest

RUN apk --no-cache add ca-certificates

COPY ./build /rover

RUN find /rover

WORKDIR /rover
