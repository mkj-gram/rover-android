FROM node:7.5.0

WORKDIR /opt/graphql-server
ADD package.json package.json
ADD .npmrc .npmrc
ENV NPM_TOKEN="dad33a01-0f48-47df-9797-9b36dd5f957c"
RUN npm install

ADD . /opt/graphql-server
RUN npm run build

EXPOSE 80

CMD npm run serve
