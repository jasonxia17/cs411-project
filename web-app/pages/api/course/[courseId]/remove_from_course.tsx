import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../shared/sql_connection";
import verifyAuthentication from "../../../../shared/authentication_middleware";

export default async function dropClassHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();
  const userId = session.user["id"];

  if (userId !== req.body.studentId) {
    const [
      instructorRow
    ] = await connection.execute(
      "SELECT * FROM Instructors WHERE InstructorId = ?",
      [userId]
    );
    if (JSON.parse(JSON.stringify(instructorRow)).length == 0) {
      res.status(401).end("User is unauthorized to remove from course");
      return;
    }
  }
  const courseId = parseInt(req.query.courseId as string);
  await connection.execute(
    "DELETE FROM Students WHERE StudentId = ? and CourseId = ?",
    [req.body.studentId, courseId]
  );
  res.status(200).end();
}
