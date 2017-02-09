FROM node:6.4
# FROM debian:jessie
# 
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     libpq-dev \
#     curl \
#     ca-certificates \
#     xz-utils \
#     && rm -rf /var/lib/apt/lists/*
#     
#     RUN groupadd --gid 1000 node \
#       && useradd --uid 1000 --gid node --shell /bin/bash --create-home node
# 
# # gpg keys listed at https://github.com/nodejs/node
# RUN set -ex \
#   && for key in \
#     9554F04D7259F04124DE6B476D5A82AC7E37093B \
#     94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
#     0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
#     FD3A5288F042B6850C66B31F09FE44734EB7990E \
#     71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
#     DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
#     B9AE9905FFD7803F25714661B63B535A4C206CA9 \
#     C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
#   ; do \
#     gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key"; \
#   done
# 
# ENV NPM_CONFIG_LOGLEVEL info
# ENV NODE_VERSION 6.4.0
# 
# RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
#   && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
#   && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
#   && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
#   && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
#   && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
#   && ln -s /usr/local/bin/node /usr/local/bin/nodejs

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
