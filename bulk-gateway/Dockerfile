FROM node:7.10.1-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /opt/bulk-gateway

ADD . /opt/bulk-gateway

EXPOSE 80

CMD node index.js
