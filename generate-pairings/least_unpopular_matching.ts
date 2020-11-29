/*
Our advanced function finds an approximately optimal allocation of students to project pairs.

This is known as the roommate matching problem, and we implement the algorithm given in the following paper:
Near-Popular matching in the Roommates problem by Chien-Chung Huang and Telikepalli Kavitha (2011)
A free electronic copy is available at https://www.di.ens.fr/~cchuang/work/unpopular_roommates.pdf 
*/

import { GenerateStablePartition } from "./stable_partition";
import { Matching, Preferences, StablePartition } from "./types";

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
  preferences: Preferences
): Matching {
  const stablePartition = GenerateStablePartition(preferences);
  const [leftPreferences, rightPreferences] = MakeBipartition(
    stablePartition,
    preferences
  );

  console.log("Left partition preferences: ", leftPreferences);
  console.log("Right partition preferences: ", rightPreferences);
  return new Map();
}

function MakeBipartition(
  stablePartition: StablePartition,
  preferences: Preferences
): [Preferences, Preferences] {
  const leftPartition: Set<number> = new Set();
  const rightPartition: Set<number> = new Set();

  stablePartition.forEach(party => {
    party.forEach((member, i) => {
      if (i % 2 === 0) {
        leftPartition.add(member);
      } else {
        rightPartition.add(member);
      }
    });
  });

  const leftPreferences: Preferences = new Map();
  const rightPreferences: Preferences = new Map();

  // Filter so that preferences only rank users in the other group
  preferences.forEach((preference, id) => {
    if (leftPartition.has(id)) {
      leftPreferences.set(
        id,
        preference.filter(otherId => rightPartition.has(otherId))
      );
    } else {
      rightPreferences.set(
        id,
        preference.filter(otherId => leftPartition.has(otherId))
      );
    }
  });

  return [leftPreferences, rightPreferences];
}

function RunGaleShapley(leftPreferences: Preferences, rightPreferences: Preferences): Matching {
  const matching: Matching = new Map();

  function ShouldContinue(): boolean {
    for (const [id, preference] of leftPreferences) {
      if (matching.get(id) === undefined && preference.length > 0) {
        return true;
      }
    }
    return false;
  }

  do {
    leftPreferences.forEach((preference, id) => {

    });
  } while (ShouldContinue());

  return matching;
}

function InduceSubgraph(preferences: Preferences, partialMatching: Matching): Preferences {
  return new Map();
}
