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

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  await connection.execute(
    "INSERT INTO Courses(Title, Semester) VALUES (?, ?)",
    [req.body.title, req.body.semester]
  );

  const [
    new_course
  ] = await connection.query(
    "SELECT CourseId FROM Courses WHERE Courses.Title = ? and Courses.Semester = ?",
    [req.body.title, req.body.semester]
  );
  const new_course_id = new_course[0].CourseId;

  await connection.execute(
    "INSERT INTO Instructors(InstructorId, CourseId) VALUES (?, ?)",
    [session.user["id"], new_course_id as number]
  );

  res.status(200).end();
}
