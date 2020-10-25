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

  await connection.execute("INSERT INTO Posts(Title, Body) VALUES (?, ?)", [
    req.body.postTitle,
    req.body.postBody
  ]);

  res.status(200).end();
}

export default makePostHandler;
