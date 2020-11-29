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

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  const [
    commenter_id_row
  ] = await connection.execute(
    "SELECT UserId FROM Comments WHERE CommentId = ?",
    [req.body.commentId]
  );
  if (commenter_id_row[0].UserId !== session.user["id"]) {
    res.status(401).end("User cannot delete comments they didn't make");
    return;
  }

  await connection.execute("DELETE FROM Comments WHERE CommentId = ?", [
    req.body.commentId
  ]);

  res.status(200).end();
}
