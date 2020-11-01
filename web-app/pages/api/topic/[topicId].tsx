import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../shared/sql_connection";
import assert from "assert";
import { RowDataPacket } from "mysql2";

async function viewTopicPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const [
    posts
  ] = await connection.query("SELECT * FROM Posts WHERE TopicId = ?", [
    req.query.topicId
  ]);

  res.status(200).json({ posts });
}

export default viewTopicPostsHandler;
