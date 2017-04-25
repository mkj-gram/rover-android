FROM ruby:2.3.3

WORKDIR /opt/content-api
ADD Gemfile /opt/content-api/Gemfile
ADD Gemfile.lock /opt/content-api/Gemfile.lock

ENV GIT_AUTH_TOKEN="0e072ef6aa48f3247d1fc1332b1f5e0ac3761ecb"

RUN bundle config --global silence_root_warning 1 \
    && bundle install --path vendor/bundle \
    && bundle clean

ADD ./ /opt/content-api/

EXPOSE 80

CMD bundle exec puma -C config/puma.rb
