FROM ruby:2.3.3

WORKDIR /opt/content-api

ADD ./ /opt/content-api

RUN bundle install --local --path vendor/bundle

EXPOSE 80

ENV BUNDLE_APP_CONFIG=/opt/content-api/.bundle

CMD bundle exec puma -C config/puma.rb
