FROM node:7.10

RUN apt-get update && apt-get install -y --no-install-recommends \
   libpq-dev

WORKDIR /opt/bulk-gateway

ADD . /opt/bulk-gateway

EXPOSE 80

CMD node index.js
