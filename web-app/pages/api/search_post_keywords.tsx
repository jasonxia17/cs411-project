import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../shared/sql_connection";
import { convertCourseIdToString } from "../shared/helper_utilities";

export default async function searchPostKeywordsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method === "GET") {
    const courseIdAsInt = parseInt(
      convertCourseIdToString(req.headers.courseid)
    );

    const [
      rows,
      _
    ] = await connection.execute(
      "SELECT * FROM Posts WHERE EXISTS (SELECT * FROM Topics WHERE Topics.TopicId = Posts.TopicId AND Topics.CourseId = ?) AND (Body LIKE ? OR Title LIKE ?)",
      [courseIdAsInt, `%${req.headers.keywords}%`, `%${req.headers.keywords}%`]
    );

    res.status(200).json({ posts: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
