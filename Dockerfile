FROM ruby:2.3

WORKDIR /opt/content-api
ADD ./ /opt/content-api/

RUN bundle config --global silence_root_warning 1

RUN bundle install --path vendor/bundle

EXPOSE 80

CMD bundle exec puma -C config/puma.rb
