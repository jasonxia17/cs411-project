/*
Our advanced function finds an approximately optimal allocation of students to project pairs.

This is known as the roommate matching problem, and we implement the algorithm given in the following paper:
Near-Popular matching in the Roommates problem by Chien-Chung Huang and Telikepalli Kavitha (2011)
A free electronic copy is available at https://www.di.ens.fr/~cchuang/work/unpopular_roommates.pdf 
*/

import {
  Matching,
  PreferenceList,
  StablePartition,
  StablePartitionParty
} from "./types";

/*
Input [Preferences]: A list of each student's preference list for partners, ranked from most to least preferred.
Example:
[[2, 3], // Student 1 prefers working with student 2 over student 3
 [1, 3], // Student 2 prefers working with student 1 over student 3
 [2, 1]] // Student 3 prefers working with student 2 over student 1

Return [M]: A matching, where the entry M[i] holds the i-th student's partner. Note that there may be a student
with no partner, if the total number of students is odd.
*/
export function GenerateNearPopularMatching(
  preferences: PreferenceList
): Matching {
  return [null];
}

function MakeBipartition(stablePartition: StablePartition): [StablePartitionParty, StablePartitionParty] {
  return [[], []];
}

function RunGaleShapley(leftPreferences: PreferenceList, rightPreferences: PreferenceList): Matching {
  return [];
}

function InduceSubgraph(preferences: PreferenceList, partialMatching: Matching): PreferenceList {
  return [[]];
}
