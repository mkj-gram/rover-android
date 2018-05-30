FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

COPY ./build /rover

RUN find /rover

WORKDIR /rover

