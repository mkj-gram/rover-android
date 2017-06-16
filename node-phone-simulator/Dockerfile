FROM node:7.5.0

WORKDIR /opt/node-phone-simulator

ADD ./public/ /opt/node-phone-simulator/public/
ADD ./dist/ /opt/node-phone-simulator/dist/
ADD ./node_modules/ /opt/node-phone-simulator/node_modules/
ADD ./views/ /opt/node-phone-simulator/views/

EXPOSE 80

CMD node dist/server