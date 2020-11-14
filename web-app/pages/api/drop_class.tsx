import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../shared/sql_connection";
import verifyAuthentication from "../../shared/authentication_middleware";

export default async function dropClassHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  await connection.execute("DELETE FROM Students WHERE StudentId = ?", [
    session.user["id"]
  ]);
  res.status(200).end();
}