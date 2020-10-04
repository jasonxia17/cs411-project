#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Usage: ./initialize.sh <mysql_username>"
    exit
fi

DB_NAME=cs411_project
echo "Creating database $DB_NAME..."

cat create_database.sql | mysql -u $1 -p

echo "Creating tables and running scripts..."
cat ./schemas/*.sql ./scripts/*.sql | mysql -u $1 -p $DB_NAME