CREATE TABLE IF NOT EXISTS Topics (
    TopicId INT IDENTITY(1,1) NOT NULL PRIMARY KEY CLUSTERED, 
    CourseId INT REFERENCES Courses(CourseId),
    Title VARCHAR(256)
);

INSERT IGNORE INTO Topics(TopicId, CourseId, Title) VALUES (1, 1, "Hello World!");
INSERT IGNORE INTO Topics(TopicId, CourseId, Title) VALUES (2, 2, "Jason!");
