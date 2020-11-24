/*
We implement a stable partition algorithm that is needed as a subroutine to near-popular matching, from the paper:
A Necessary and Sufficient Condition for the Existence of Complete Stable Matching by Jimmy J.M. Tan (1991)
A free electronic copy is available at https://www.ime.usp.br/~cris/aulas/17_2_6906/projetos/Tan-JAlg91.pdf 
*/

import {
  Matching,
  PreferenceList,
  PreferenceMatrix,
  StablePartition
} from "./types";

export function GenerateStablePartition(
  preferences: PreferenceMatrix
): StablePartition {
  preferences = RunPhase1(preferences);
  const partition = RunPhase2(preferences);
  return partition;
}

// Phase 1: repeated rounds of proposals, which will reduce the preference list by removing 'impossible' pairs
export function RunPhase1(preferences: PreferenceMatrix): PreferenceMatrix {
  // Make deep copies
  const proposalOrders: PreferenceMatrix = [];
  preferences.forEach(preference => proposalOrders.push([...preference]));
  const reducedPreferences: PreferenceMatrix = [];
  preferences.forEach(preference => reducedPreferences.push([...preference]));

  // Build a lookup table in which lookup[i][j] gives rank of user j on user i's preference list
  const preferencesLookup: Array<Map<number, number>> = [];
  preferences.forEach(ranking => {
    const rankLookup: Map<number, number> = new Map();
    ranking.forEach((j, rank) => {
      rankLookup.set(j, rank);
    });
    preferencesLookup.push(rankLookup);
  });

  // Run proposal rounds until no one can improve their match
  const proposedTo: Matching = new Array(preferences.length).fill(null);
  const proposedBy: Matching = new Array(preferences.length).fill(null);
  do {
    RunProposalRound(proposalOrders, preferencesLookup, proposedTo, proposedBy);
  } while (ShouldContinueProposal(proposalOrders, proposedTo));

  // Reduce preference lists
  proposedBy.forEach((match, i) => {
    if (match === null) {
      return;
    }

    let impossibleMatch = reducedPreferences[i].pop();
    while (impossibleMatch != match && impossibleMatch !== undefined) {
      const position = reducedPreferences[impossibleMatch].indexOf(i);
      reducedPreferences[impossibleMatch].splice(position, 1);
      impossibleMatch = reducedPreferences[i].pop();
    }
    reducedPreferences[i].push(match);
  });

  console.log("Reduced preference matrix after phase 1: ", reducedPreferences);
  return reducedPreferences;
}

// Phase 2: repeated rounds of rotation elimination
export function RunPhase2(
  reducedPreferences: PreferenceMatrix
): StablePartition {
  // Construct "active" part of table
  const activePreferences: Map<number, PreferenceList> = new Map();
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
      for (const user of rotation.flat()) {
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
  proposalOrders: PreferenceMatrix,
  preferenceLookup: Array<Map<number, number>>,
  proposedTo: Matching,
  proposedBy: Matching
) {
  proposalOrders.forEach((order, id) => {
    const preferredPartnerId = order[0];
    if (
      preferredPartnerId === undefined || // No more possible matches
      proposedTo[id] === preferredPartnerId // Already matched
    ) {
      return;
    }

    const partnerRankings = preferenceLookup[preferredPartnerId];
    const previousMatch = proposedBy[preferredPartnerId];
    let isProposalAccepted = false;

    // Person being proposed will accept if they don't already have a better proposal
    if (previousMatch === null) {
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
    if (previousMatch != null) {
      proposalOrders[previousMatch].shift();
      proposedTo[previousMatch] = null;
    }

    // Set new partners
    proposedTo[id] = preferredPartnerId;
    proposedBy[preferredPartnerId] = id;
  });
}

function ShouldContinueProposal(
  proposalOrders: PreferenceMatrix,
  proposedTo: Matching
): boolean {
  return proposedTo.some(
    (match, i) => proposalOrders[i].length > 0 && match === null
  );
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
  reducedPreferences: PreferenceMatrix,
  rotation: Rotation
): boolean {
  const [proposers, receivers] = rotation;
  // Odd cardinality, every list has 2 persons, and proposers === receivers
  return (
    proposers.length % 2 === 1 &&
    proposers.every(proposer => reducedPreferences[proposer].length === 2) &&
    proposers.slice().sort() === receivers.slice().sort() // Slice to avoid modifying (since sort is in-place)
  );
}

function EliminateRotation(
  reducedPreferences: PreferenceMatrix,
  rotation: Rotation
): PreferenceMatrix {
  const [proposers, receivers] = rotation;
  proposers.forEach(proposer => {
    reducedPreferences[proposer].shift();
  });

  receivers.forEach((receiver, i) => {
    const deleteIndex = reducedPreferences[receiver].indexOf(
      proposers[(i + proposers.length - 1) % proposers.length]
    );
    reducedPreferences[receiver].length = deleteIndex + 1; // Deletes all elements of the array after that index
  });

  return reducedPreferences;
}
