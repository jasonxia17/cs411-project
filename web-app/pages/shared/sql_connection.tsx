import { createConnection, Connection } from "mysql2/promise";

let connection: Connection | null = null;

export async function getConnection(): Promise<Connection> {
  if (connection === null) {
    connection = await createConnection({
      host: "localhost",
      user: "nodejs",
      password: "password",
      database: "cs411_project"
    });
  }
  return connection;
}
