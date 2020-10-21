import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../shared/sql_connection";

async function viewTopicsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();
  if (req.method === "GET") {
    const [rows] = await connection.query("SELECT * FROM Topics");
    res.status(200).json({ topics: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}

export default viewTopicsHandler;