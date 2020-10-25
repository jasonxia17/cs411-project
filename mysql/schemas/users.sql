/* 
Schemas are taken directly from the NextAuth documentation.
*/

CREATE TABLE sessions
  (
    id            INT NOT NULL AUTO_INCREMENT,
    user_id       INTEGER NOT NULL,
    expires       TIMESTAMP(6) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    access_token  VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
  );

CREATE TABLE users
  (
    id             INT NOT NULL AUTO_INCREMENT,
    name           VARCHAR(255),
    email          VARCHAR(255),
    email_verified TIMESTAMP(6),
    image          VARCHAR(255),
    created_at     TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
  );

CREATE TABLE verification_requests
  (
    id         INT NOT NULL AUTO_INCREMENT,
    identifier VARCHAR(255) NOT NULL,
    token      VARCHAR(255) NOT NULL,
    expires    TIMESTAMP(6) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
  );

CREATE UNIQUE INDEX session_token
  ON sessions(session_token);

CREATE UNIQUE INDEX access_token
  ON sessions(access_token);

CREATE UNIQUE INDEX email
  ON users(email);

CREATE UNIQUE INDEX token
  ON verification_requests(token);