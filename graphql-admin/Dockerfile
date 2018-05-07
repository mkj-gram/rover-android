FROM node:8.9.0

WORKDIR /opt/graphql-admin

ADD ./dist/ /opt/graphql-admin/dist/
ADD ./node_modules/ /opt/graphql-admin/node_modules/

EXPOSE 80

CMD ["/usr/local/bin/node", "dist"]