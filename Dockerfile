FROM ruby:2.3

WORKDIR /app

ADD Gemfile* /app/

RUN bundle config --global silence_root_warning 1

RUN bundle install --path vendor/bundle

ADD ./ /app

EXPOSE 80

CMD bundle exec puma -C config/puma.rb
