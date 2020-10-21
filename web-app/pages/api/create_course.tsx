import { NextApiRequest, NextApiResponse } from "next";
import { createConnection } from "mysql2/promise";

async function createCourseHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const connection = await createConnection({
    host: "localhost",
    user: "nodejs",
    password: "password",
    database: "cs411_project"
  });
  // TODO: this should probably be a static global variable, not sure where to put it though.

  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await connection.execute(
    "INSERT INTO Courses(Title, Semester) VALUES (?, ?)",
    [req.body.title, req.body.semester]
  );

  res.status(200).end();
}

export default makePostHandler;
