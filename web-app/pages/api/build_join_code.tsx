import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../shared/authentication_middleware";
import { getConnection } from "../../shared/sql_connection";

export default async function buildJoinCode(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await verifyAuthentication(req, res);
  const connection = await getConnection();

  const JOIN_CODE_LENGTH = 5;
  const [existingJoinCodeRows] = await connection.query(
    "SELECT JoinCode FROM Courses"
  );
  const existingJoinCodes = new Set();
  JSON.parse(JSON.stringify(existingJoinCodeRows)).map(joinCodeObj =>
    existingJoinCodes.add(joinCodeObj.JoinCode)
  );

  function getJoinCode(): string {
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    // Note: First 2 chars will always be 0. -- we want to avoid them
    const asciiBase = 36;
    return Math.random()
      .toString(asciiBase)
      .substring(2, JOIN_CODE_LENGTH + 2);
  }

  console.log(existingJoinCodes);
  let joinCode = getJoinCode();
  while (joinCode in existingJoinCodes) {
    joinCode = getJoinCode();
  }
  res.status(200).json({ joinCode });
}
