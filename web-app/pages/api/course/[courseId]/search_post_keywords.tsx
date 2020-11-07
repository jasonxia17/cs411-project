import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../shared/sql_connection";

export default async function searchPostKeywordsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method === "GET") {
    const courseId = parseInt(req.query.courseId as string);
    const keywords = req.query.keywords;

    const [
      matched_posts
    ] = await connection.execute(
      "SELECT * FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND (Body LIKE ? OR Posts.Title LIKE ?) UNION SELECT * FROM Posts JOIN Topics ON Topics.TopicId = Posts.TopicId WHERE CourseId = ? AND EXISTS (SELECT * FROM Comments WHERE Comments.PostId = Posts.PostId AND Comments.Body LIKE ?)",
      [courseId, `%${keywords}%`, `%${keywords}%`, courseId, `%${keywords}%`]
    );
    res.status(200).json({
      matched_posts
    });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
