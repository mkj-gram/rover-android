FROM node:6.4

RUN apt-get update && apt-get install -y --no-install-recommends \
   libpq-dev

WORKDIR /opt/sdk-api
ADD package.json package.json
ADD .npmrc .npmrc
ENV NPM_TOKEN="dad33a01-0f48-47df-9797-9b36dd5f957c"
RUN npm install

ADD . /opt/sdk-api

EXPOSE 80

CMD node index.js
