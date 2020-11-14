import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../shared/sql_connection";
import verifyAuthentication from "../../shared/authentication_middleware";

export default async function deleteCommentHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await verifyAuthentication(req, res);
  const connection = await getConnection();

  await connection.execute("DELETE FROM Comments WHERE CommentId = ?", [
    req.body.commentId
  ]);

  res.status(200).end();
}
