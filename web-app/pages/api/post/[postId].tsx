import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../shared/authentication_middleware";
import { getConnection } from "../../../shared/sql_connection";

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

  const [posts] = await connection.query(
    "SELECT * FROM Posts WHERE PostId = ?",
    req.query.postId
  );

  const [comments] = await connection.query(
    "SELECT * FROM Comments WHERE PostId = ?",
    req.query.postId
  );

  res.status(200).json({ posts, comments });
}

export default viewPostsHandler;
