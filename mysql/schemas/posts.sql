CREATE TABLE IF NOT EXISTS Posts (
    PostId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT, /* todo, foreign key */
    CourseId INT REFERENCES Courses(CourseId),
    TopicId INT REFERENCES Topics(TopicId),
    Title VARCHAR(256),
    PostTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    Body TEXT
);

INSERT IGNORE INTO Posts(PostId, UserId, CourseId, TopicId, Title, Body) VALUES (1, 1, 1, 1, "Hello World!", 'cout << "Hello World" << endl');
