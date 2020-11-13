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
    courseToJoin
  ] = await connection.execute(
    "SELECT CourseId from Courses WHERE JoinCode = ?",
    [req.body.joinCode]
  );
  if (courseToJoin[0] == undefined) {
    res.status(404).end("Course ID not found");
    return;
  }
  const newCourseId = courseToJoin[0].CourseId;

  const shouldJoinAsStudent = req.body.shouldJoinAsStudent as boolean;
  const userId = session.user["id"];

  async function hasJoinedAsRole(role: string) {
    const [
      joinedAsInstructor
    ] = await connection.execute("SELECT * from ?s WHERE ?Id = ?", [
      role,
      role,
      userId
    ]);
    return joinedAsInstructor[0] != undefined;
  }

  if (shouldJoinAsStudent) {
    if (hasJoinedAsRole("Instructor")) {
      res
        .status(401)
        .end("User has already joined this course as an instructor");
      return;
    }
    await connection.execute(
      "INSERT IGNORE INTO Students(StudentId, CourseId) VALUES (?, ?)",
      [userId, newCourseId as number]
    );
  } else {
    if (hasJoinedAsRole("Student")) {
      res
        .status(401)
        .end("User has already joined this course as an instructor");
      return;
    }

    await connection.execute(
      "INSERT IGNORE INTO Instructors(InstructorId, CourseId) VALUES (?, ?)",
      [userId, newCourseId as number]
    );
  }

  res.status(200).end();
}
