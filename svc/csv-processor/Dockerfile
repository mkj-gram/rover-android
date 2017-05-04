FROM node:6.4

WORKDIR /opt/csv-processor

ADD package.json package.json
ADD .npmrc .npmrc

RUN npm install

ADD . /opt/csv-processor

EXPOSE 5100

CMD node index.js
