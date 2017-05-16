FROM ruby:2.4.1-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    libpq-dev \
    make \
    g++ \
    gcc \
    automake \
    autoconf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/segment-service/db

# Install db dependencies

ADD Gemfile /opt/segment-service/db/Gemfile
ADD Gemfile.lock /opt/segment-service/db/Gemfile.lock

RUN bundle config \
    && bundle install --path vendor/bundle \
    && bundle clean

ADD . /opt/segment-service/db

CMD ["irb"]