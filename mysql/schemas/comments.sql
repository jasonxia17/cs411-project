CREATE TABLE IF NOT EXISTS Comments (
    CommentId INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT FOREIGN KEY REFERENCES users.id,
    PostId INT REFERENCES Posts(PostId),
    PostTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    Body TEXT
);

INSERT IGNORE INTO Comments(CommentId, PostId, UserId, Body) VALUES (1, 2, 2, "First comment!");