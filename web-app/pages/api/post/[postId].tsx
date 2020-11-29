import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../shared/authentication_middleware";
import { getConnection } from "../../../shared/sql_connection";
import neo4j_driver from "../../../shared/neo4j_connection";

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

  const [posts] = await connection.query(
    "SELECT * FROM Posts WHERE PostId = ?",
    req.query.postId
  );

  const [comments] = await connection.query(
    "SELECT * FROM Comments WHERE PostId = ?",
    req.query.postId
  );

  const viewer_id = session.user["id"];
  const poster_id = posts[0].UserId;
  if (viewer_id !== poster_id) {
    const neo4j_session = neo4j_driver.session();
    await neo4j_session.run(
      `MERGE (viewer:User {user_id: $viewer_id})
      MERGE (poster:User {user_id: $poster_id})
      MERGE (viewer)-[e:VIEWED]->(poster)
        ON CREATE SET e.weight = 1
        ON MATCH SET e.weight = e.weight + 1`,
      { viewer_id, poster_id }
    );
    neo4j_session.close();
  }

  res.status(200).json({ posts, comments });
}

export default viewPostsHandler;
