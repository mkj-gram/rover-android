FROM ruby:2.3

WORKDIR /opt/content-api
ADD Gemfile /opt/content-api/Gemfile
ADD Gemfile.lock /opt/content-api/Gemfile.lock

RUN bundle config --global silence_root_warning 1 \
    && bundle install --path vendor/bundle \
    && bundle clean

ADD ./ /opt/content-api/

EXPOSE 80

CMD bundle exec puma -C config/puma.rb
