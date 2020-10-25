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
      rows
    ] = await connection.execute(
      "SELECT * FROM Posts WHERE EXISTS (SELECT * FROM Topics WHERE Topics.TopicId = Posts.TopicId AND Topics.CourseId = ?) AND (Body LIKE ? OR Title LIKE ?)",
      [courseId, `%${keywords}%`, `%${keywords}%`]
    );

    res.status(200).json({ posts: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
