FROM postgres:9.6-alpine

COPY ./initdb.d/*.sql  /docker-entrypoint-initdb.d/

CMD ["postgres"]
