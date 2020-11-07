import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../shared/sql_connection";

async function editPostHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await connection.execute("UPDATE Posts SET Body = ? WHERE PostId = ?", [
    req.body.postBody,
    req.body.postId
  ]);

  res.status(200).end();
}

export default editPostHandler;
