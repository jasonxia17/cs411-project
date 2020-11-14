import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../../shared/authentication_middleware";
import { getConnection } from "../../../../shared/sql_connection";

export default async function searchPostKeywordsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await verifyAuthentication(req, res);
  const connection = await getConnection();
  const courseId = parseInt(req.query.courseId as string);
  const keywords = req.query.keywords;

  // Find posts where the keywords are substrings of the post text
  // or where the keywords are substrings of the comments text (where the comments are made in the post)
  // or where the keywords match the users who created the posts
  // or where the keywords match the users who wrote a comment underneath the post
  const [matched_posts] = await connection.execute(
    "SELECT PostId, UserId, Posts.TopicId, Posts.Title, PostTime, Body FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND (Body LIKE ? OR Posts.Title LIKE ?)\
     UNION SELECT PostId, UserId, Posts.TopicId, Posts.Title, PostTime, Body FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND EXISTS (SELECT * FROM Comments WHERE Comments.PostId = Posts.PostId AND Comments.Body LIKE ?)\
     UNION SELECT PostId, UserId, Posts.TopicId, Posts.Title, PostTime, Body FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND EXISTS (SELECT * FROM users WHERE users.id = Posts.UserId AND users.Name LIKE ?)\
     UNION SELECT PostId, UserId, Posts.TopicId, Posts.Title, PostTime, Body FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND EXISTS (SELECT * FROM users, Comments WHERE Comments.PostId = Posts.PostId AND users.id = Comments.UserId AND users.Name LIKE ?)",
    [
      courseId, // Post query
      `%${keywords}%`, // Post query
      `%${keywords}%`, // Post query
      courseId, // Comment query
      `%${keywords}%`, // Comment query
      courseId, // User post query
      `%${keywords}%`, // User post query
      courseId, // User comment query
      `%${keywords}%` // User comment query
    ]
  );

  console.log(matched_posts);
  res.status(200).json({
    matched_posts
  });
}
