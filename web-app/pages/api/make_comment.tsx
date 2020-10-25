import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../shared/authentication_middleware";
import { getConnection } from "../shared/sql_connection";

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

  res.status(200).end();
}

export default makeCommentHandler;
