CREATE TABLE IF NOT EXISTS Courses (
    CourseId INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(256),
    Semester VARCHAR(256),
    JoinCode VARCHAR(256),
    UNIQUE(JoinCode)
);

INSERT IGNORE INTO Courses(CourseId, Title, Semester, JoinCode) VALUES (1, "CS 900", "FA2020", "avadog");
INSERT IGNORE INTO Courses(CourseId, Title, Semester, JoinCode) VALUES (2, "CS 126", "FA2021", "walkodoggo");
