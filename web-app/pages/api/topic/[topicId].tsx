import { RowDataPacket } from "mysql2";
import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../shared/authentication_middleware";
import { getConnection } from "../../../shared/sql_connection";

/**
 * Responds with {posts: null} if user does not have permission to see the posts in this topic,
 * which occurs if the user has not yet made their own post in this topic.
 * Note that this restriction does NOT apply to instructors.
 */
async function viewTopicPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  const [topic_rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM Topics WHERE TopicId = ?",
    [req.query.topicId]
  );

  if (topic_rows.length !== 1) {
    res.status(401).end("Topic does not exist");
    return;
  }

  const [
    num_posts_by_user
  ] = await connection.query(
    "SELECT COUNT(*) FROM Posts WHERE TopicId = ? AND UserId = ?",
    [req.query.topicId, session.user["id"]]
  );

  const [instructor_rows] = await connection.query<RowDataPacket[]>(
    `SELECT *
    FROM Instructors NATURAL JOIN Topics
    WHERE TopicId = ? AND InstructorId = ?`,
    [req.query.topicId, session.user["id"]]
  );

  if (
    num_posts_by_user[0]["COUNT(*)"] === 0 &&
    JSON.parse(JSON.stringify(instructor_rows)).length === 0
  ) {
    res.status(200).json({
      posts: null,
      courseId: topic_rows[0].CourseId,
      topicTitle: topic_rows[0].Title
    });
    return;
  }

  const [
    posts
  ] = await connection.query(
    "SELECT * FROM PostsWithCommentCounts WHERE TopicId = ?",
    [req.query.topicId]
  );

  res.status(200).json({
    posts,
    courseId: topic_rows[0].CourseId,
    topicTitle: topic_rows[0].Title
  });
}

export default viewTopicPostsHandler;
