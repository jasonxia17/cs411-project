import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../shared/authentication_middleware";
import { getConnection } from "../../../shared/sql_connection";
import neo4j_driver from "../../../shared/neo4j_connection";
import { RowDataPacket } from "mysql2";

async function viewPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  const [posts] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM PostsWithCommentCounts WHERE PostId = ?",
    req.query.postId
  );

  if (posts.length !== 1) {
    res.status(401).end("Post does not exist");
    return;
  }

  const [comments] = await connection.query(
    "SELECT * FROM Comments, users WHERE PostId = ? AND UserId = users.id",
    req.query.postId
  );

  const [courseIdRow] = await connection.query(
    "SELECT CourseId FROM Topics WHERE TopicId = ?",
    posts[0].TopicId
  );

  const viewer_id = session.user["id"];
  const poster_id = posts[0].UserId;
  const course_id = courseIdRow[0].CourseId as number;

  if (viewer_id !== poster_id) {
    const neo4j_session = neo4j_driver.session();
    await neo4j_session.run(
      `MERGE (viewer:User {user_id: $viewer_id})
      MERGE (poster:User {user_id: $poster_id})
      MERGE (viewer)-[e:VIEWED {course_id: $course_id_match}]->(poster)
        ON CREATE SET e.weight = 1, e.course_id = $course_id_create
        ON MATCH SET e.weight = e.weight + 1`,
      {
        viewer_id,
        poster_id,
        course_id_match: course_id,
        course_id_create: course_id
      }
    );
    neo4j_session.close();
  }

  res.status(200).json({ post: posts[0], comments });
}

export default viewPostsHandler;
