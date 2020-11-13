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
  const [
    matched_posts
  ] = await connection.execute(
    "SELECT PostId, UserId, Posts.TopicId, Posts.Title, PostTime, Body FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND (Body LIKE ? OR Posts.Title LIKE ?)\
     UNION SELECT PostId, UserId, Posts.TopicId, Posts.Title, PostTime, Body FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND EXISTS (SELECT * FROM Comments WHERE Comments.PostId = Posts.PostId AND Comments.Body LIKE ?)\
     UNION SELECT PostId, UserId, Posts.TopicId, Posts.Title, PostTime, Body FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND EXISTS (SELECT * FROM users WHERE users.id = Posts.UserId AND users.Name LIKE ?)",
    [
      courseId,
      `%${keywords}%`,
      `%${keywords}%`,
      courseId,
      `%${keywords}%`,
      courseId,
      `%${keywords}%`
    ]
  );

  console.log(matched_posts);
  res.status(200).json({
    matched_posts
  });
}
