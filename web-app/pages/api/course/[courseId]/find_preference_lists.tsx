import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../shared/sql_connection";
import verifyAuthentication from "../../../../shared/authentication_middleware";
import neo4j_driver from "../../../../shared/neo4j_connection";
import assert from "assert";
import { start } from "repl";
import {
  Preferences,
  PreferenceList
} from "../../../../../generate-pairings/types";

type AdjacentNodes = Map<number, number>; // <head node, weight>
type AdjacencyList = Map<number, AdjacentNodes>; // <tail node, AdjacentNodes>
type Nodes = Set<number>;

export default async function findPreferenceLists(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Preferences> {
  await verifyAuthentication(req, res);
  await getConnection();

  const course_id = parseInt(req.query.courseId as string);

  const graph = new Graph();
  await graph.buildGraph(course_id);
  return await graph.findAllShortestPaths();
}

class Graph {
  _adjacency_list: AdjacencyList;
  _nodes: Nodes;

  constructor() {
    this._adjacency_list = new Map();
    this._nodes = new Set();
  }

  findAllShortestPaths(): Preferences {
    const preference_lists: Preferences = new Map();
    this._nodes.forEach(node =>
      preference_lists.set(node, this.findShortestPaths(node))
    );
    return preference_lists;
  }

  findShortestPaths(start_node: number): PreferenceList {
    const distances = new Map();
    const unvisited_nodes = new Set();

    this._nodes.forEach(node => {
      unvisited_nodes.add(node);
      distances.set(node, Infinity);
    });
    distances.set(start_node, 0);

    function findClosestUnprocessedNode() {
      let min_node_dist = Infinity;
      let min_node;
      unvisited_nodes.forEach(unvisited_node => {
        const currDist = distances.get(unvisited_node);
        if (currDist < min_node_dist) {
          min_node_dist = currDist;
          min_node = unvisited_node;
        }
      });
      return { min_node, min_node_dist };
    }

    for (let _ = 0; _ < this._nodes.size; ++_) {
      const { min_node, min_node_dist } = findClosestUnprocessedNode();
      unvisited_nodes.delete(min_node);

      const adjacencies = this._adjacency_list.get(min_node);
      if (adjacencies == undefined) {
        continue;
      }

      Array.from(adjacencies.keys()).forEach(head_node => {
        const possible_new_dist = min_node_dist + adjacencies.get(head_node);
        if (
          unvisited_nodes.has(head_node) &&
          distances.get(head_node) > possible_new_dist
        ) {
          distances.set(head_node, possible_new_dist);
        }
      });
    }

    // Order nodes by distances
    const nodes_by_distances: PreferenceList = Array.from(this._nodes);
    nodes_by_distances.sort(function(node_1, node_2) {
      const node_1_dist = distances.get(node_1);
      const node_2_dist = distances.get(node_2);
      return node_1_dist - node_2_dist;
    });
    assert(nodes_by_distances[0] === start_node);
    nodes_by_distances.shift();
    return nodes_by_distances;
  }

  async buildGraph(course_id: number): Promise<void> {
    // Note: For some reason, "this" isn't being properly bound
    // within our function in .then, which is why I'm populating
    // a local map first
    const adjacencies: AdjacencyList = new Map();
    const nodes: Nodes = new Set();

    function getEdgeWeight(edge_count: number, edge_type: string): number {
      if (edge_type === "COMMENTED") {
        return edge_count * 3;
      } else if (edge_type === "VIEWED") {
        return edge_count;
      }
      assert(false);
    }

    function addEdge(
      tail_id: number,
      head_id: number,
      edge_weight: number
    ): void {
      if (adjacencies.has(tail_id)) {
        const adjacent_nodes = adjacencies.get(tail_id);
        if (adjacent_nodes.has(head_id)) {
          adjacent_nodes.set(
            head_id,
            adjacent_nodes.get(head_id) + edge_weight
          );
        } else {
          adjacent_nodes.set(head_id, edge_weight);
        }
      } else {
        const adjacent_nodes: AdjacentNodes = new Map();
        adjacent_nodes.set(head_id, edge_weight);
        adjacencies.set(tail_id, adjacent_nodes);
      }
    }

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

          nodes.add(viewer_id);
          nodes.add(poster_id);

          const raw_edge_count = record.get("e").properties.weight.low;
          const edge_type = record.get("e").type;
          const edge_weight = getEdgeWeight(raw_edge_count, edge_type);

          addEdge(viewer_id, poster_id, edge_weight);
          addEdge(poster_id, viewer_id, edge_weight);
        });
      });
    neo4j_session.close();

    this._adjacency_list = adjacencies;
    this._nodes = nodes;

    this._invertEdgeWeights();
  }

  _invertEdgeWeights(): void {
    Array.from(this._adjacency_list.keys()).forEach(tail_node => {
      const adjacency = this._adjacency_list.get(tail_node);

      Array.from(adjacency.keys()).forEach(head_node =>
        adjacency.set(head_node, 1 / adjacency.get(head_node))
      );
    });
  }
}
