import { NextApiRequest, NextApiResponse } from "next";
import { createConnection } from "mysql2/promise";

async function viewTopicsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await createConnection({
    host: "localhost",
    user: "nodejs",
    password: "password",
    database: "cs411_project"
  });
  if (req.method === "GET") {
    const [rows] = await connection.query("SELECT * FROM Topics");
    res.status(200).json({ topics: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}

export default viewTopicsHandler;
