FROM postgres:12.6-alpine
RUN mkdir -p /tmp/data/
COPY timely.sql /tmp/data/timely.sql
COPY init_docker_postgres.sh /docker-entrypoint-initdb.d/