import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../shared/sql_connection";
import verifyAuthentication from "../../../../shared/authentication_middleware";
import neo4j_driver from "../../../../shared/neo4j_connection";

type AdjacentNodes = Map<number, number>; // <head node, weight>
type AdjacencyList = Map<number, AdjacentNodes>; // <tail node, AdjacentNodes>

export default async function findPreferenceLists(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  const course_id = parseInt(req.query.courseId as string);

  const graph = new Graph();
  await graph.buildGraph(course_id);
  res.status(200).json({ });
}

function getEdgeWeight(edge_count: number, edge_type: string): number {
  if (edge_type === "COMMENTED") {
    return edge_count * 3;
  } else if (edge_type === "VIEWED") {
    return edge_count;
  }
  return -1;
}

class Graph {
  adjacency_list: AdjacencyList;

  constructor() {
    this.adjacency_list = new Map();
  }

  async buildGraph(course_id: number): Promise<void> {
    // Note: For some reason, "this" isn't being properly bound
    // within our function in .then, which is why I'm populating
    // a local map first
    const local_adjacencies: AdjacencyList = new Map();

    const neo4j_session = neo4j_driver.session();

    await neo4j_session
      .run(
        `MATCH (viewer:User)-[e:VIEWED {course_id: $course_id}]->(poster:User)
        RETURN viewer, poster, e
        UNION
        MATCH (viewer:User)-[e:COMMENTED {course_id: $course_id}]->(poster:User)
        RETURN viewer, poster, e`,
        { course_id }
      )
      .then(function(result) {
        result.records.forEach(function(record) {
          const viewer_id = record.get("viewer").properties.user_id;
          const poster_id = record.get("poster").properties.user_id;

          const raw_edge_count = record.get("e").properties.weight.low;
          const edge_type = record.get("e").type;
          const edge_weight = getEdgeWeight(raw_edge_count, edge_type);

          if (local_adjacencies.has(viewer_id)) {
            const adjacent_nodes = local_adjacencies.get(viewer_id);
            if (adjacent_nodes.has(poster_id)) {
              adjacent_nodes.set(
                poster_id,
                adjacent_nodes.get(poster_id) + edge_weight
              );
            } else {
              adjacent_nodes.set(poster_id, edge_weight);
            }
          } else {
            const adjacent_nodes: AdjacentNodes = new Map();
            adjacent_nodes.set(poster_id, edge_weight);
            local_adjacencies.set(viewer_id, adjacent_nodes);
          }
        });
      });
    this.adjacency_list = local_adjacencies;
    neo4j_session.close();
  }
}
