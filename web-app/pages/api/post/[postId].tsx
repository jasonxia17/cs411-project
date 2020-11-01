import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../shared/sql_connection";
import assert from "assert";
import { RowDataPacket } from "mysql2";

async function viewPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const [posts] = await connection.query(
    "SELECT * FROM Posts WHERE PostId = ?",
    [req.query.postId]
  );

  const [
    comments
  ] = await connection.query("SELECT * FROM Comments WHERE PostId = ?", [
    req.query.postId
  ]);

  res.status(200).json({ posts, comments });
}

export default viewPostsHandler;
