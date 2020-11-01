import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../shared/authentication_middleware";
import { getConnection } from "../../../shared/sql_connection";

async function viewTopicPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await verifyAuthentication(req, res);
  const connection = await getConnection();

  const [
    posts
  ] = await connection.query("SELECT * FROM Posts WHERE TopicId = ?", [
    req.query.topicId
  ]);

  res.status(200).json({ posts });
}

export default viewTopicPostsHandler;
