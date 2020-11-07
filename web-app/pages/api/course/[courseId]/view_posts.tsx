import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../shared/sql_connection";

async function viewPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method === "GET") {
    const courseId = parseInt(req.query.courseId as string);

    const [rows, fields] = await connection.query(
      `SELECT Posts.PostId, Posts.UserId, Posts.Title,
              Posts.PostTime, Posts.Body, COUNT(CommentId) AS NumComments
      FROM Posts LEFT JOIN Comments
      ON Posts.PostId = Comments.PostId
      WHERE Posts.TopicId IN (SELECT TopicId FROM Topics WHERE CourseId = ?)
      GROUP BY Posts.PostId`,
      [courseId]
    );
    res.status(200).json({ posts: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}

export default viewPostsHandler;
