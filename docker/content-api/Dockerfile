FROM ruby:2.3.3

RUN find /usr/src
RUN bundle install

CMD bundle exec puma -C config/puma.rb
