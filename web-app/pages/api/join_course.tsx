import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../shared/authentication_middleware";
import { getConnection } from "../../shared/sql_connection";

export default async function joinCourseHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  const [
    course_to_join
  ] = await connection.execute(
    "SELECT CourseId from Courses WHERE JoinCode = ?",
    [req.body.joinCode]
  );
  console.log(course_to_join);
  if (course_to_join[0] == undefined) {
    res.status(404).end("Course ID not found");
    return;
  }
  const new_course_id = course_to_join[0].CourseId;

  const shouldJoinAsStudent = true; // req.body.shouldJoinAsStudent as boolean;
  if (shouldJoinAsStudent) {
    await connection.execute(
      "INSERT IGNORE INTO Students(StudentId, CourseId) VALUES (?, ?)",
      [session.user["id"], new_course_id as number]
    );
  }

  res.status(200).end();
}
