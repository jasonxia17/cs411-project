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

  async function buildJoinCode() {
    const JOIN_CODE_LENGTH = 5;
    const [existingJoinCodeRows] = await connection.query(
      "SELECT JoinCode FROM Courses"
    );
    const existingJoinCodes = new Set();
    JSON.parse(JSON.stringify(existingJoinCodeRows)).map(joinCodeObj =>
      existingJoinCodes.add(joinCodeObj.JoinCode)
    );

    function buildRandomString(): string {
      // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
      // Note: First 2 chars will always be 0. -- we want to avoid them
      const asciiBase = 36;
      return Math.random()
        .toString(asciiBase)
        .substring(2, JOIN_CODE_LENGTH + 2);
    }
    let joinCode = buildRandomString();
    while (joinCode in existingJoinCodes) {
      joinCode = buildRandomString();
    }
    return joinCode;
  }

  const joinCode = await buildJoinCode();

  await connection.execute(
    "INSERT INTO Courses(Title, Semester, JoinCode) VALUES (?, ?, ?)",
    [req.body.title, req.body.semester, joinCode]
  );

  const [newCourse] = await connection.query(
    "SELECT LAST_INSERT_ID() as newCourseId"
  );
  const newCourseId = JSON.parse(JSON.stringify(newCourse))[0].newCourseId;
  await connection.execute(
    "INSERT INTO Instructors(InstructorId, CourseId) VALUES (?, ?)",
    [session.user["id"], newCourseId as number]
  );

  res.status(200).end();
}
