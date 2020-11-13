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
    "INSERT INTO Courses(Title, Semester, JoinCode) VALUES (?, ?, ?)",
    [req.body.title, req.body.semester, req.body.joinCode]
  );

  // TODO This is a hacky approach that only works when we auto-incr the course id
  const [newCourse] = await connection.query(
    "SELECT MAX(CourseId) as NewCourseId FROM Courses"
  );
  const newCourseId = newCourse[0].NewCourseId;
  await connection.execute(
    "INSERT INTO Instructors(InstructorId, CourseId) VALUES (?, ?)",
    [session.user["id"], newCourseId as number]
  );

  res.status(200).end();
}
