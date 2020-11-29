/*
We implement a stable partition algorithm that is needed as a subroutine to near-popular matching, from the paper:
A Necessary and Sufficient Condition for the Existence of Complete Stable Matching by Jimmy J.M. Tan (1991)
A free electronic copy is available at https://www.ime.usp.br/~cris/aulas/17_2_6906/projetos/Tan-JAlg91.pdf 
*/

import {
  Matching,
  PreferenceList,
  Preferences,
  RankLookup,
  StablePartition
} from "./types";

export function GenerateStablePartition(
  preferences: Preferences
): StablePartition {
  preferences = RunPhase1(preferences);
  preferences = RunPhase2(preferences);

  // TODO Convert preferences to partition
  return [];
}

// Phase 1: repeated rounds of proposals, which will reduce the preference list by removing 'impossible' pairs
export function RunPhase1(preferences: Preferences): Preferences {
  // Make deep copies
  const proposalOrders: Preferences = new Map();
  const reducedPreferences: Preferences = new Map();
  preferences.forEach((preference, id) => {
    proposalOrders.set(id, [...preference]);
    reducedPreferences.set(id, [...preference]);
  });

  // Build a lookup table in which lookup[i][j] gives rank of user j on user i's preference list
  const rankLookup: RankLookup = new Map();
  preferences.forEach((preference, id) => {
    const singleRankLookup: Map<number, number> = new Map();
    preference.forEach((j, rank) => {
      singleRankLookup.set(j, rank);
    });
    rankLookup.set(id, singleRankLookup);
  });

  // Run proposal rounds until no one can improve their match
  const proposedTo: Matching = new Map();
  const proposedBy: Matching = new Map();
  for (const key of preferences.keys()) {
    proposedTo.set(key, null);
    proposedBy.set(key, null);
  }

  do {
    RunProposalRound(proposalOrders, rankLookup, proposedTo, proposedBy);
  } while (ShouldContinueProposal(proposalOrders, proposedTo));

  // Reduce preference lists
  proposedBy.forEach((match, id) => {
    if (match === null) {
      return;
    }

    let impossibleMatch = reducedPreferences.get(id)?.pop();
    while (impossibleMatch != match && impossibleMatch !== undefined) {
      const position = reducedPreferences.get(impossibleMatch)?.indexOf(id);
      if (position !== undefined) {
        reducedPreferences.get(impossibleMatch)?.splice(position, 1);
      }
      impossibleMatch = reducedPreferences.get(id)?.pop();
    }
    reducedPreferences.get(id)?.push(match);
  });

  console.log("Reduced preference matrix after phase 1: ", reducedPreferences);
  return reducedPreferences;
}

// Phase 2: repeated rounds of rotation elimination
export function RunPhase2(reducedPreferences: Preferences): Preferences {
  // Construct "active" part of table
  const activePreferences: Preferences = new Map();
  reducedPreferences.forEach((preference, i) => {
    if (preference.length >= 2) {
      activePreferences.set(i, preference);
    }
  });

  while (activePreferences.size > 0) {
    const rotation = FindRotation(activePreferences);
    console.log("Rotation: ", rotation);

    if (IsOddPartyRotation(reducedPreferences, rotation)) {
      console.log("Rotation is odd party, no elimination");
      for (const user of rotation[0]) {
        activePreferences.delete(user);
      }
    } else {
      reducedPreferences = EliminateRotation(reducedPreferences, rotation);
      console.log("After elimination: ", reducedPreferences);

      // Remove lists that were made inactive
      for (const user of rotation[0].concat(rotation[1])) {
        const preference = activePreferences.get(user);
        if (preference !== undefined && preference.length < 2) {
          activePreferences.delete(user);
        }
      }
    }
  }

  return reducedPreferences;
}

function RunProposalRound(
  proposalOrders: Preferences,
  rankLookup: RankLookup,
  proposedTo: Matching,
  proposedBy: Matching
) {
  proposalOrders.forEach((order, id) => {
    const preferredPartnerId = order[0];
    if (
      preferredPartnerId === undefined || // No more possible matches
      proposedTo.get(id) === preferredPartnerId // Already matched
    ) {
      return;
    }

    const partnerRankings: Map<number, number> =
      rankLookup.get(preferredPartnerId) || new Map();
    const previousMatch = proposedBy.get(preferredPartnerId);
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
      order.shift(); // Move on to next person
      return;
    }

    // Reset previous partners
    if (previousMatch !== null && previousMatch !== undefined) {
      proposalOrders.get(previousMatch)?.shift();
      proposedTo.set(previousMatch, null);
    }

    // Set new partners
    proposedTo.set(id, preferredPartnerId);
    proposedBy.set(preferredPartnerId, id);
  });
}

function ShouldContinueProposal(
  proposalOrders: Preferences,
  proposedTo: Matching
): boolean {
  for (const [id, match] of proposedTo) {
    if ((proposalOrders.get(id)?.length || 0) > 0 && match === null) {
      return true;
    }
  }
  return false;
}

type Rotation = [Array<number>, Array<number>];

// Assumes that activePreferences is already filtered so that it only contains preference lists with >= 2 elements left
function FindRotation(
  activePreferences: Map<number, PreferenceList>
): Rotation {
  const visited: Set<number> = new Set();
  let proposer: number = activePreferences.keys().next().value;

  // Follow preference edges until a cycle is found
  while (visited.has(proposer) === false) {
    visited.add(proposer);
    const preference = activePreferences.get(proposer);
    if (preference === undefined) {
      console.error(`Proposer ${proposer} is not in active preferences`);
      return [[], []];
    }

    const receiverPreference = activePreferences.get(preference[1]);
    if (receiverPreference === undefined) {
      console.error(`receiver ${preference[1]} is not in active preferences`);
      return [[], []];
    }

    proposer = receiverPreference[receiverPreference.length - 1];
  }

  // Delete vertices outside cycle
  for (const vertex of visited.values()) {
    if (vertex === proposer) {
      break;
    }
    visited.delete(vertex);
  }

  // Construct rotation
  const proposers = [];
  const receivers = [];
  for (const vertex of visited.values()) {
    proposers.push(vertex);
    const preference: PreferenceList = activePreferences.get(vertex) || [];
    receivers.push(preference[1]);
  }

  receivers.unshift(receivers[receivers.length - 1]);
  receivers.pop();
  return [proposers, receivers];
}

function IsOddPartyRotation(
  reducedPreferences: Preferences,
  rotation: Rotation
): boolean {
  const [proposers, receivers] = rotation;
  const sortedReceivers = receivers.slice().sort();

  // Odd cardinality, every list has 2 persons, and proposers and receivers are the same set of people
  return (
    proposers.length % 2 === 1 &&
    proposers
      .slice()
      .sort()
      .every(
        (proposer, i) =>
          reducedPreferences.get(proposer)?.length === 2 &&
          proposer === sortedReceivers[i]
      )
  );
}

function EliminateRotation(
  reducedPreferences: Preferences,
  rotation: Rotation
): Preferences {
  const [proposers, receivers] = rotation;
  receivers.forEach((receiver, i) => {
    const newProposer =
      proposers[(i + proposers.length - 1) % proposers.length];

    let deletedProposer = reducedPreferences.get(receiver)?.pop();
    while (deletedProposer !== undefined && deletedProposer !== newProposer) {
      const otherRank = reducedPreferences
        .get(deletedProposer)
        ?.indexOf(receiver);
      if (otherRank !== undefined) {
        reducedPreferences.get(deletedProposer)?.splice(otherRank, 1);
      }
      deletedProposer = reducedPreferences.get(receiver)?.pop();
    }
    reducedPreferences.get(receiver)?.push(newProposer);
  });

  return reducedPreferences;
}
