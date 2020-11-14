import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../shared/authentication_middleware";
import { getConnection } from "../../../shared/sql_connection";

async function courseInformationHandler(
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
    courseData
  ] = await connection.query(
    "SELECT * FROM Courses WHERE Courses.CourseId = ?",
    [req.query.courseId]
  );

  const userId = session.user["id"];
  const [
    joinedAsInstructor
  ] = await connection.execute(
    "SELECT * from Instructors WHERE InstructorId = ? and CourseId = ?",
    [userId, req.query.courseId]
  );
  const isInstructor = JSON.parse(JSON.stringify(joinedAsInstructor)).length;

  const [
    joinedAsStudent
  ] = await connection.execute(
    "SELECT * from Students WHERE StudentId = ? and CourseId = ?",
    [userId, req.query.courseId]
  );
  const isStudent = JSON.parse(JSON.stringify(joinedAsStudent)).length;

  res
    .status(200)
    .json({ userId, courseData: courseData[0], isStudent, isInstructor });
}

export default courseInformationHandler;
