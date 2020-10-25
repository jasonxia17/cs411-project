import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import verifyAuthentication from "../shared/authentication_middleware";
import { getConnection } from "../shared/sql_connection";

async function makePostHandler(
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
    "INSERT INTO Posts(UserId, Title, Body) VALUES (?, ?, ?)",
    [session.user["id"], req.body.postTitle, req.body.postBody]
  );

  res.status(200).end();
}

export default makePostHandler;
