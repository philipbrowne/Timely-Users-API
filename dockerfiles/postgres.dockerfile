FROM postgres:12.6-alpine
RUN mkdir -p /tmp/data/
COPY timely-schema.sql /tmp/data/timely-schema.sql
COPY timely-seed.sql /tmp/data/timely-seed.sql
COPY timely.sql /tmp/data/timely.sql
COPY init_docker_postgres.sh /docker-entrypoint-initdb.d/