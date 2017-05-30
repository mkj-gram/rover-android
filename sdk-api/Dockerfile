FROM node:6.4

RUN apt-get update && apt-get install -y --no-install-recommends \
   libpq-dev

WORKDIR /opt/sdk-api

ADD . /opt/sdk-api

EXPOSE 80

CMD node index.js
