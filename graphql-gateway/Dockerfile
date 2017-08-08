FROM node:7.5.0

WORKDIR /opt/graphql-gateway

ADD ./dist/ /opt/graphql-gateway/dist/
ADD ./node_modules/ /opt/graphql-gateway/node_modules/

EXPOSE 80

CMD node dist/server
