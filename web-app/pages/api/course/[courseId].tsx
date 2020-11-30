import { connect } from "http2";
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
  const isStudent = JSON.parse(JSON.stringify(joinedAsStudent)).length !== 0;

  const [
    studentPairingRow
  ] = await connection.execute(
    "SELECT name from Partners, users WHERE CourseId = ? AND UserIdA = ? AND UserIdB = users.id",
    [req.query.courseId, userId]
  );
  const studentPairingArr = JSON.parse(JSON.stringify(studentPairingRow));
  let studentPairing;
  if (studentPairingArr.length !== 0) {
    studentPairing = studentPairingArr[0].name;
  }
  console.log(userId, studentPairing);
  res.status(200).json({
    courseData: courseData[0],
    isStudent,
    isInstructor,
    studentPairing
  });
}

export default courseInformationHandler;
