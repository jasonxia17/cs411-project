import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../shared/sql_connection";
import verifyAuthentication from "../../shared/authentication_middleware";
import neo4j_driver from "../../shared/neo4j_connection";

async function makeCommentHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  await connection.execute(
    "INSERT INTO Comments(UserId, PostId, Body) VALUES (?, ?, ?)",
    [session.user["id"], req.body.postId, req.body.newComment]
  );

  const commenter_id = session.user["id"];
  // It doesn't make sense to add self-edges because we're using this graph to build
  // a preference list
  const [
    poster_id_rows
  ] = await connection.execute(
    "SELECT UserId, TopicId FROM Posts WHERE PostId = ?",
    [req.body.postId as number]
  );
  const poster_id = poster_id_rows[0].UserId as number;
  const topic_id = poster_id_rows[0].TopicId as number;

  if (commenter_id !== poster_id) {
    const [
      course_id_row
    ] = await connection.execute(
      "SELECT CourseId FROM Topics WHERE TopicId = ?",
      [topic_id]
    );
    const course_id = course_id_row[0].CourseId as number;

    const neo4j_session = neo4j_driver.session();
    await neo4j_session.run(
      `MERGE (commenter:User {user_id: $commenter_id})
      MERGE (poster:User {user_id: $poster_id})
      MERGE (commenter)-[e:COMMENTED {course_id: $course_id_match}]->(poster)
        ON CREATE SET e.weight = 1, e.course_id = $course_id_create
        ON MATCH SET e.weight = e.weight + 1`,
      {
        commenter_id,
        poster_id,
        course_id_match: course_id,
        course_id_create: course_id
      }
    );
    neo4j_session.close();
  }

  res.status(200).end();
}

export default makeCommentHandler;
