import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../shared/sql_connection";
import verifyAuthentication from "../../../shared/authentication_middleware";

async function editPostHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await verifyAuthentication(req, res);
  const connection = await getConnection();

  await connection.execute("UPDATE Posts SET Body = ? WHERE PostId = ?", [
    req.body.postBody,
    req.body.postId
  ]);

  res.status(200).end();
}

export default editPostHandler;
