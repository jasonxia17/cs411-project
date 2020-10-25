import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../shared/sql_connection";
import { getSession } from "next-auth/client";
import verifyAuthentication from "../../shared/authentication_middleware";

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

  // TODO: Add topic ID for insertion (important bc we figure out which post belongs)
  // to which class by going thru topic IDs. Added dummy value for now to demonstrate
  // course separation
  const topicId = 1; // // TODO Replace me: dummy value!!!
  await connection.execute(
    "INSERT INTO Posts(UserId, Title, Body, TopicId) VALUES (?, ?, ?, ?)",
    [
      session.user["id"],
      req.body.postTitle,
      req.body.postBody,
      topicId // TODO Replace me: dummy value!!!
    ]
  );

  res.status(200).end();
}

export default makePostHandler;
