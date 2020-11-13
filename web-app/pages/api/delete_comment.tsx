import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../shared/sql_connection";

export default async function deleteCommentHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await connection.execute("DELETE FROM Comments WHERE CommentId = ?", [
    req.body.commentId
  ]);

  res.status(200).end();
}
