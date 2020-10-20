CREATE TABLE IF NOT EXISTS Courses (
    CourseId INT,
    Title VARCHAR(256),
    Semester VARCHAR(256)
);

INSERT IGNORE INTO Courses(CourseId, Title, Semester) VALUES (1, "CS 900", "FA2020");