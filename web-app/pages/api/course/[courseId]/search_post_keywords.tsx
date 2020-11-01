import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../shared/sql_connection";

export default async function searchPostKeywordsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method === "GET") {
    const courseId = parseInt(req.query.courseId as string);
    const keywords = req.query.keywords;

    const [
      directly_matched_posts, // Posts that contain keywords in title/body
      directly_matched_posts_fields
    ] = await connection.execute(
      "SELECT * FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND (Body LIKE ? OR Posts.Title LIKE ?)",
      [courseId, `%${keywords}%`, `%${keywords}%`]
    );

    const [
      matching_comments_posts,
      matching_comments_posts_fields
    ] = await connection.execute(
      "SELECT * FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND EXISTS (SELECT * FROM Comments WHERE Comments.PostId = Posts.PostId AND Comments.Body LIKE ?)",
      [courseId, `%${keywords}%`]
    );

    res.status(200).json({
      directly_matched_posts,
      matching_comments_posts
    });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
