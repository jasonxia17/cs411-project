import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../../shared/authentication_middleware";
import { getConnection } from "../../../../shared/sql_connection";

export default async function viewRosterHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await verifyAuthentication(req, res);
  const connection = await getConnection();
  const courseId = parseInt(req.query.courseId as string);

  const [
    students
  ] = await connection.query(
    "SELECT * FROM users JOIN Students on users.id = Students.StudentId WHERE CourseId = ?",
    [courseId]
  );
  res.status(200).json({ students });
}
