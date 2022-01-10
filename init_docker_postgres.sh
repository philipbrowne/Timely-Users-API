#!/bin/bash

DB_DUMP_LOCATION="/tmp/data/timely.sql"

echo "*** CREATING DATABASE ***"

psql -U postgres < "$DB_DUMP_LOCATION";

echo "*** DATABASE CREATED! ***"