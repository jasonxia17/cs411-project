import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../../shared/sql_connection";
import verifyAuthentication from "../../../../shared/authentication_middleware";
import findPreferenceLists from "../[courseId]/find_preference_lists";
import { GenerateNearPopularMatching } from "../../../../generate-pairings/near_popular_matching";
import { Matching } from "../../../../generate-pairings/types";
import Student from "../../../../components/Student";

export default async function findStudentPairingsHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end(`Method ${req.method} not allowed.`);
    return;
  }

  const session = await verifyAuthentication(req, res);
  const connection = await getConnection();

  const preferences = await findPreferenceLists(req, res);
  const matching: Matching = GenerateNearPopularMatching(new Map(preferences));
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

  async function getIdUserNameMapping() {
    // Get <id> <name> mapping for all students and instructors in this course
    // to get names rather than ids
    const [
      students_row
    ] = await connection.execute(
      "SELECT id, name FROM Students JOIN users WHERE CourseId = ? and StudentId = id",
      [courseId]
    );
    const [
      instructors_row
    ] = await connection.execute(
      "SELECT id, name FROM Instructors JOIN users WHERE CourseId = ? and InstructorId = id",
      [courseId]
    );
    const mapping = new Map();
    JSON.parse(JSON.stringify(students_row)).forEach(student => {
      mapping.set(student.id as number, student.name);
    });
    JSON.parse(JSON.stringify(instructors_row)).forEach(instructor => {
      mapping.set(instructor.id as number, instructor.name);
    });
    return mapping;
  }

  const idNameMapping = await getIdUserNameMapping();
  console.log(idNameMapping);
  const student_info = [];
  for (const node_id of Array.from(preferences.keys())) {
    const preference_names = [];
    preferences
      .get(node_id)
      .forEach(id => preference_names.push(idNameMapping.get(id)));

    student_info.push({
      student_id: node_id,
      preference_list: preference_names,
      matching: idNameMapping.get(matching.get(node_id))
    });
  }
  console.log(student_info);
  res.status(200).json({ student_info });
}
