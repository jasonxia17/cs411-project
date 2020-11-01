import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../shared/authentication_middleware";
import { getConnection } from "../../shared/sql_connection";

export default async function createCourseHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await verifyAuthentication(req, res);
  const connection = await getConnection();

  await connection.execute(
    "INSERT INTO Courses(Title, Semester) VALUES (?, ?)",
    [req.body.title, req.body.semester]
  );

  res.status(200).end();
}
