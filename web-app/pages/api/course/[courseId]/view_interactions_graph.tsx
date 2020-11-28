import { NextApiRequest, NextApiResponse } from "next";
import verifyAuthentication from "../../../../shared/authentication_middleware";
import { getConnection } from "../../../../shared/sql_connection";
import neo4j_driver from "../../../../shared/neo4j_connection";

export default async function searchPostKeywordsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  await verifyAuthentication(req, res);
  const connection = await getConnection();

  const course_id = parseInt(req.query.courseId as string);

  const graph = {
    nodes: [],
    edges: []
  };

  const node_ids = new Set();

  const neo4j_session = neo4j_driver.session();

  await neo4j_session
    .run(
      `MATCH (viewer:User)-[e:VIEWED {course_id: $course_id}]->(poster:User)
      RETURN viewer, poster, e`,
      { course_id }
    )
    .then(function(result) {
      result.records.forEach(function(record) {
        const viewer_id = record.get("viewer").properties.user_id;
        const poster_id = record.get("poster").properties.user_id;

        node_ids.add(viewer_id);
        node_ids.add(poster_id);

        const edge_weight = record.get("e").properties.weight.low;
        graph.edges.push({
          from: viewer_id,
          to: poster_id,
          label: edge_weight
        });
      });
    });
  neo4j_session.close();

  async function getUserName(node_id: number) {
    const [
      user_name_row
    ] = await connection.execute("SELECT name FROM users WHERE id = ?", [
      node_id
    ]);
    return user_name_row[0].name;
  }
  async function getUserNames() {
    for (const node_id of Array.from(node_ids)) {
      const user_name = await getUserName((node_id as unknown) as number);
      graph.nodes.push({
        id: node_id,
        label: user_name
      });
    }
  }
  await getUserNames();
  console.log(graph);

  res.status(200).json({ graph });
}
