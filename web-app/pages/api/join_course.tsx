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
  const courseArr = JSON.parse(JSON.stringify(courseToJoin));
  if (courseArr.length == 0) {
    res.status(404).end("Course ID not found");
    return;
  }
  const courseToJoinId = courseArr[0].CourseId;

  const shouldJoinAsStudent = req.body.shouldJoinAsStudent as boolean;
  const userId = session.user["id"];

  async function hasJoinedAsInstructor() {
    const [
      joinedAsInstructor
    ] = await connection.execute(
      "SELECT * from Instructors WHERE InstructorId = ? and CourseId = ?",
      [userId, courseToJoinId]
    );
    return JSON.parse(JSON.stringify(joinedAsInstructor)).length > 0;
  }

  async function hasJoinedAsStudent() {
    const [
      joinedAsStudent
    ] = await connection.execute(
      "SELECT * from Students WHERE StudentId = ? and CourseId = ?",
      [userId, courseToJoinId]
    );
    return JSON.parse(JSON.stringify(joinedAsStudent)).length > 0;
  }

  if (shouldJoinAsStudent) {
    if (await hasJoinedAsInstructor()) {
      res
        .status(401)
        .end("User has already joined this course as an instructor");
      return;
    }
    await connection.execute(
      "INSERT IGNORE INTO Students(StudentId, CourseId) VALUES (?, ?)",
      [userId, courseToJoinId as number]
    );
  } else {
    if (await hasJoinedAsStudent()) {
      res
        .status(401)
        .end("User has already joined this course as an instructor");
      return;
    }
    await connection.execute(
      "INSERT IGNORE INTO Instructors(InstructorId, CourseId) VALUES (?, ?)",
      [userId, courseToJoinId as number]
    );
  }

  res.status(200).end();
}
