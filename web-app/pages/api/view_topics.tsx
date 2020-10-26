import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../shared/sql_connection";

async function viewTopicsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method === "GET") {
    const courseId = parseInt(req.headers.courseid as string);

    const [
      rows
    ] = await connection.query("SELECT * FROM Topics WHERE CourseId = ?", [
      courseId
    ]);
    res.status(200).json({ topics: rows });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}

export default viewTopicsHandler;
