CREATE TABLE IF NOT EXISTS Partners (
    LeaderId INT REFERENCES users.id,
    PartnerId INT REFERENCES users.id,
    CourseId INT REFERENCES Courses.CourseId,
    PRIMARY KEY (LeaderId, PartnerId, CourseId),
    CHECK(LeaderId IS NOT NULL or PartnerId IS NOT NULL),
    CHECK (PartnerId IS NULL OR LeaderId < PartnerId)
);