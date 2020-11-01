import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../shared/sql_connection";

async function makeCommentHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await connection.execute("INSERT INTO Comments(PostId, Body) VALUES (?, ?)", [
    req.body.postId,
    req.body.newComment
  ]);

  res.status(200).end();
}

export default makeCommentHandler;
