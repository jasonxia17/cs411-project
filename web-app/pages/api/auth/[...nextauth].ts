import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { InitOptions, User } from "next-auth";
import { Session } from "next-auth/client";
import Providers from "next-auth/providers";

const options: InitOptions = {
  providers: [
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(<string>process.env.EMAIL_SERVER_PORT, 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
  ],
  database: {
    type: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  callbacks: {
    session: async (session: Session, user: User) => {
      session.user = user;
      return Promise.resolve(session);
    }
  }
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
  NextAuth(req, res, options);
