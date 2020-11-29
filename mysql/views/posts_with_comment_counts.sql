CREATE OR REPLACE VIEW PostsWithCommentCounts AS
SELECT Posts.PostId, Posts.UserId, users.name AS Username, Posts.Title,
       Posts.PostTime, Posts.Body, Posts.TopicId, COUNT(CommentId) AS NumComments
FROM Posts 
    LEFT JOIN Comments ON Posts.PostId = Comments.PostId
    LEFT JOIN users    ON Posts.UserId = users.id
GROUP BY Posts.PostId