import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../../shared/authentication_middleware";
import { getConnection } from "../../../../shared/sql_connection";

async function viewPostsHandler(
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

  const [rows] = await connection.query(
    `SELECT Posts.PostId, Posts.UserId, Posts.Title,
            Posts.PostTime, Posts.Body, COUNT(CommentId) AS NumComments
    FROM Posts LEFT JOIN Comments
    ON Posts.PostId = Comments.PostId
    WHERE Posts.TopicId IN (SELECT TopicId FROM Topics WHERE CourseId = ?)
    GROUP BY Posts.PostId`,
    [courseId]
  );
  res.status(200).json({ posts: rows });
}

export default viewPostsHandler;
