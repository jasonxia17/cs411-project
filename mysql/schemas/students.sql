CREATE TABLE IF NOT EXISTS Students (
    StudentId INT REFERENCES users.id,
    CourseId INT REFERENCES Courses(CourseId),
    PRIMARY KEY(StudentId, CourseId)
);