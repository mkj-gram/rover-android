FROM postgres:alpine

COPY docker/vendor/postgres/initdb.d/*.sql  /docker-entrypoint-initdb.d/

CMD ["postgres"]



