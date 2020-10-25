import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../shared/sql_connection";

async function makePostHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  // TODO: Add topic ID for insertion (important bc we figure out which post belongs)
  // to which class by going thru topic IDs. Added dummy value for now to demonstrate
  // course separation
  const topicId = 1; // // TODO Replace me: dummy value!!!
  await connection.execute(
    "INSERT INTO Posts(Title, Body, TopicId) VALUES (?, ?, ?)",
    [
      req.body.postTitle,
      req.body.postBody,
      topicId // TODO Replace me: dummy value!!!
    ]
  );

  res.status(200).end();
}

export default makePostHandler;
