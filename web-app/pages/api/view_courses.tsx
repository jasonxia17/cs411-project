import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../shared/authentication_middleware";
import { getConnection } from "../../shared/sql_connection";

export default async function viewCoursesHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  const [
    student_courses
  ] = await connection.query(
    "SELECT * FROM Courses WHERE Courses.CourseId = Students.CourseId and Students.StudentId = ?",
    [session.user["id"]]
  );
  const [
    instructor_courses
  ] = await connection.query(
    "SELECT * FROM Courses WHERE Courses.CourseId = Instructors.CourseId and Instructors.InstructorId = ?",
    [session.user["id"]]
  );
  res.status(200).json({ student_courses, instructor_courses });
}
