import { NextApiRequest, NextApiResponse } from "next";
import { createConnection } from "mysql";

const connection = createConnection({
  host: "localhost",
  user: "nodejs",
  password: "password",
  database: "cs411_project"
});

connection.connect(err => {
  if (err) {
    throw err;
  }
});

async function examplePostsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "GET") {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM Posts", (err, rows) => {
        if (err) {
          throw err;
        }

        res.status(200).json({ posts: rows });
        return resolve();
      });
    });
  } else {
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}

export default examplePostsHandler;
