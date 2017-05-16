FROM ruby:2.3.3

WORKDIR /opt/content-api
ADD Gemfile /opt/content-api/Gemfile
ADD Gemfile.lock /opt/content-api/Gemfile.lock

ENV GIT_AUTH_TOKEN="2722d1c1dfdadf0c9a334ae6bed003bf0f4872b6"

RUN bundle config --global silence_root_warning 1 \
	&& bundle pack \
    && bundle install --path vendor/bundle \
    && bundle clean

ADD ./ /opt/content-api/

EXPOSE 80

CMD bundle exec puma -C config/puma.rb
