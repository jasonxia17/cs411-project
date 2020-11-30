/*
Our advanced function finds an approximately optimal allocation of students to project pairs.

This is known as the roommate matching problem, and we implement the algorithm given in the following paper:
Near-Popular matching in the Roommates problem by Chien-Chung Huang and Telikepalli Kavitha (2011)
A free electronic copy is available at https://www.di.ens.fr/~cchuang/work/unpopular_roommates.pdf 
*/

import { GenerateStablePartition, MakeRankLookup } from "./stable_partition";
import { Matching, Preferences, StablePartition } from "./types";

/*
Input [Preferences]: A Map of student ids to preference list for partners, ranked from most to least preferred.
Example:
1 => [2, 3], // Student 1 prefers working with student 2 over student 3
2 => [1, 3], // Student 2 prefers working with student 1 over student 3
3 => [2, 1] // Student 3 prefers working with student 2 over student 1

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

  const matching = RunGaleShapley(leftPreferences, rightPreferences);
  const subgraphPreferences = InduceSubgraph(preferences, matching);
  if (subgraphPreferences.size > 0) {
    // Recursively compute matching
    const subgraphMatching = GenerateNearPopularMatching(subgraphPreferences);
    subgraphMatching.forEach((v, k) => matching.set(k, v)); // Merge matching
  }

  console.log(matching);
  return matching;
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

function RunGaleShapley(
  leftPreferences: Preferences,
  rightPreferences: Preferences
): Matching {
  const matching: Matching = new Map();
  const rankLookup = MakeRankLookup(rightPreferences);

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
      if (preference.length === 0 || typeof matching.get(id) === "number") {
        return;
      }

      const preferredPartnerId = preference[0];
      const partnerRankings: Map<number, number> =
        rankLookup.get(preferredPartnerId) || new Map();
      const previousMatch = matching.get(preferredPartnerId);
      let isProposalAccepted = false;

      // Person being proposed will accept if they don't already have a better proposal
      if (previousMatch === null || previousMatch === undefined) {
        isProposalAccepted = true;
      } else {
        const thisRank = partnerRankings.get(id);
        const previousRank = partnerRankings.get(previousMatch);
        isProposalAccepted =
          thisRank !== undefined &&
          previousRank !== undefined &&
          thisRank < previousRank; // Lower rank is better
      }

      if (!isProposalAccepted) {
        preference.shift(); // Move on to next person
        return;
      }

      // Reset previous partners
      if (previousMatch !== null && previousMatch !== undefined) {
        matching.delete(previousMatch);
      }

      // Set new partners
      matching.set(id, preferredPartnerId);
      matching.set(preferredPartnerId, id);
    });
  } while (ShouldContinue());

  return matching;
}

function InduceSubgraph(
  preferences: Preferences,
  partialMatching: Matching
): Preferences {
  const finishedMatches = new Set(partialMatching.keys());

  preferences.forEach((preference, id) => {
    if (finishedMatches.has(id)) {
      preferences.delete(id);
    } else {
      const newPreference = preference.filter(v => !finishedMatches.has(v));
      if (newPreference.length > 0) {
        preferences.set(id, newPreference);
      } else {
        preferences.delete(id);
      }
    }
  });

  return preferences;
}
