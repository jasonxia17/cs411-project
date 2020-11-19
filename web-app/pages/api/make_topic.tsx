import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../shared/sql_connection";
import verifyAuthentication from "../../shared/authentication_middleware";

async function makeTopicHandler(
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
    "INSERT INTO Topics(CourseId, Title) VALUES (?, ?)",
    [req.body.courseId, req.body.topicTitle]
  );

  res.status(200).end();
}

export default makeTopicHandler;
