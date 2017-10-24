FROM node:7.10.1-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /opt/csv-processor-worker

ADD . /opt/csv-processor-worker

CMD node index.js
