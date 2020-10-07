CREATE TABLE IF NOT EXISTS Posts (
    PostId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT, /* todo, foreign key */
    TopicId INT, /* todo, foreign key, don't need CourseId because we can get that from TopicId */
    Title VARCHAR(256),
    PostTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    Body TEXT
);

INSERT IGNORE INTO Posts(PostId, UserId, Title, Body) VALUES (1, 1, "Hello World!", 'cout << "Hello World" << endl');