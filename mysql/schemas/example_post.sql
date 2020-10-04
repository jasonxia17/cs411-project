CREATE TABLE IF NOT EXISTS ExamplePost (
    PostId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    TextBody VARCHAR(1000)
);

INSERT IGNORE INTO ExamplePost(PostId, UserId, TextBody) VALUES (1, 1, "Hello World!");
INSERT IGNORE INTO ExamplePost(PostId, UserId, TextBody) VALUES (2, 1, "Hello json xml!");
INSERT IGNORE INTO ExamplePost(PostId, UserId, TextBody) VALUES (3, 1, "Hello lizardbeth!");
INSERT IGNORE INTO ExamplePost(PostId, UserId, TextBody) VALUES (4, 1, "Hello col!");
INSERT IGNORE INTO ExamplePost(PostId, UserId, TextBody) VALUES (5, 2, "databases hard pls help :(");