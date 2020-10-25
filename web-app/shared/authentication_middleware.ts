import { NextApiRequest, NextApiResponse } from "next";
import { getSession, Session } from "next-auth/client";

async function verifyAuthentication(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session> {
  const session = await getSession({ req });
  if (!session || session.user["id"] === undefined) {
    res.status(401).end();
    return Promise.reject(session);
  }

  return Promise.resolve(session);
}

export default verifyAuthentication;
