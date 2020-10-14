import { NextApiRequest, NextApiResponse } from "next";
import { createConnection } from "mysql2/promise";

export default async function searchPostKeywordsHandler(
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
    const [
      rows,
      _
    ] = await connection.execute(
      "SELECT * FROM Posts WHERE Body LIKE ? OR Title LIKE ?",
      [`%${req.headers.keywords}%`, `%${req.headers.keywords}%`]
    );

    res.status(200).json({ posts: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
