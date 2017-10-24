FROM node:7.10.1-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /opt/csv-processor-service

ADD . /opt/csv-processor-service

EXPOSE 5100

CMD node index.js
