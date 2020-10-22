import { NextApiRequest, NextApiResponse } from "next";
import { getCzzdonnection } from "../shared/sql_connection";

export default async function createCourseHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await getConnection();

  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await connection.execute(
    "INSERT INTO Courses(Title, Semester) VALUES (?, ?)",
    [req.body.title, req.body.semester]
  );

  res.status(200).end();
}
