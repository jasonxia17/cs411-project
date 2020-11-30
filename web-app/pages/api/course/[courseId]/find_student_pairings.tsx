import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../shared/sql_connection";
import verifyAuthentication from "../../../../shared/authentication_middleware";
import findPreferenceLists from "../[courseId]/find_preference_lists";
import neo4j_driver from "../../../../shared/neo4j_connection";
import { GenerateNearPopularMatching } from "../../../../generate-pairings/near_popular_matching";
import { Matching } from "../../../../generate-pairings/types";

export default async function findStudentPairingsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  const preferences = await findPreferenceLists(req, res);
  const matching: Matching = GenerateNearPopularMatching(preferences);
  const courseId = parseInt(req.query.courseId as string);
  // Map { 7 => 5, 5 => 7 }
  // Delete all rows for ths course
  await connection.execute("DELETE FROM Partners WHERE CourseId = ?", [
    courseId
  ]);
  async function cachePartnerPairings() {
    for (const node_id of Array.from(matching.keys())) {
      await connection.execute(
        "INSERT INTO Partners(UserIdA, UserIdB, CourseId) VALUES(?, ?, ?)",
        [node_id, matching.get(node_id), courseId]
      );
    }
  }
  await cachePartnerPairings();

  res.status(200).end();
}
