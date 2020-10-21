#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Usage: ./initialize.sh <mysql_username>"
    exit
fi

DB_NAME=cs411_project
echo "Creating database $DB_NAME..."

cat create_database.sql | mysql -u $1 -p

echo "Creating tables and running scripts..."
# CourseId is used as a foreign key in posts and topics so we need to create the courses table first
cat ./schemas/courses.sql ./schemas/posts.sql ./schemas/topics.sql ./scripts/*.sql | mysql -u $1 -p $DB_NAME
