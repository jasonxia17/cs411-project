import { NextApiRequest, NextApiResponse } from "next";
import { createConnection } from "mysql2/promise";

async function viewPostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await createConnection({
    host: "localhost",
    user: "nodejs",
    password: "password",
    database: "cs411_project"
  });
  // TODO: this should probably be a static global variable, not sure where to put it though.

  if (req.method === "GET") {
    const [rows, fields] = await connection.query("SELECT * FROM Posts");
    res.status(200).json({ posts: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}

export default viewPostsHandler;
