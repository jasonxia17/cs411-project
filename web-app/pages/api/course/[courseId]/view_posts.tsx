import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../shared/sql_connection";

async function viewPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method === "GET") {
    const courseId = parseInt(req.query.courseId as string);

    const [
      rows
    ] = await connection.query(
      "SELECT * FROM Posts WHERE EXISTS (SELECT * FROM Topics WHERE Topics.TopicId = Posts.TopicId AND Topics.CourseId = ?)",
      [courseId]
    );
    res.status(200).json({ posts: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}

export default viewPostsHandler;
