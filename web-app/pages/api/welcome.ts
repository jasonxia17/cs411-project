import { NextApiRequest, NextApiResponse } from "next";

function welcomeHandler(req: NextApiRequest, res: NextApiResponse): void {
  if (req.method === "GET") {
    res.status(200).json({ message: "Time to struggle together." });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}

export default welcomeHandler;
