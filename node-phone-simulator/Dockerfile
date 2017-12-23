FROM node:7.5.0

WORKDIR /opt/node-phone-simulator

ADD ./pki-validation/ /opt/node-phone-simulator/pki-validation/
ADD ./public/ /opt/node-phone-simulator/public/
ADD ./dist/ /opt/node-phone-simulator/dist/
ADD ./node_modules/ /opt/node-phone-simulator/node_modules/
ADD ./views/ /opt/node-phone-simulator/views/
ADD ./newrelic.js /opt/node-phone-simulator/newrelic.js

EXPOSE 80

CMD node dist/server