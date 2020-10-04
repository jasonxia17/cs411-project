CREATE DATABASE IF NOT EXISTS cs411_project;

CREATE USER IF NOT EXISTS 'nodejs'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

GRANT ALL ON cs411_project.* to 'nodejs'@'localhost'