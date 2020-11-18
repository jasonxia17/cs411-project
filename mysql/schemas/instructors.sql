CREATE TABLE IF NOT EXISTS Instructors (
    InstructorId INT REFERENCES users.id,
    CourseId INT REFERENCES Courses(CourseId),
    PRIMARY KEY(InstructorId, CourseId)
);