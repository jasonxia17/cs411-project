import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../shared/sql_connection";

export default async function searchPostKeywordsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method === "GET") {
    const [
      rows
    ] = await connection.execute(
      "SELECT * FROM Posts WHERE Body LIKE ? OR Title LIKE ?",
      [`%${req.headers.keywords}%`, `%${req.headers.keywords}%`]
    );

    res.status(200).json({ posts: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
