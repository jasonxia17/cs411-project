CREATE TABLE IF NOT EXISTS Partners (
    UserIdA INT REFERENCES users.id,
    UserIdB INT REFERENCES users.id,
    CourseId INT REFERENCES Courses.CourseId,
    PRIMARY KEY (UserIdA, UserIdB, CourseId),
    CHECK(UserIdA IS NOT NULL AND UserIdB IS NOT NULL)
);