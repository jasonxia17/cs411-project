import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../shared/sql_connection";

export default async function viewCoursesHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method === "GET") {
    const [rows] = await connection.query("SELECT * FROM Courses");
    res.status(200).json({ courses: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
