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

  await verifyAuthentication(req, res);
  const connection = await getConnection();

  const [
    courseData
  ] = await connection.query(
    "SELECT * FROM Courses WHERE Courses.CourseId = ?",
    [req.query.courseId]
  );
  res.status(200).json({ courseData: courseData[0] });
}

export default courseInformationHandler;
