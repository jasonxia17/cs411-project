/*
We implement a stable partition algorithm that is needed as a subroutine to near-popular matching, from the paper:
A Necessary and Sufficient Condition for the Existence of Complete Stable Matching by Jimmy J.M. Tan (1991)
A free electronic copy is available at https://www.ime.usp.br/~cris/aulas/17_2_6906/projetos/Tan-JAlg91.pdf 
*/

import { Matching, PreferenceList, StablePartition } from "./types";

export function GenerateStablePartition(
  preferences: PreferenceList
): StablePartition {
  preferences = RunPhase1(preferences);
  const partition = RunPhase2(preferences);
  return partition;
}

// Phase 1: repeated rounds of proposals, which will reduce the preference list by removing 'impossible' pairs
export function RunPhase1(preferences: PreferenceList): PreferenceList {
  // Make deep copies
  const proposalOrders: PreferenceList = [];
  preferences.forEach(preference => proposalOrders.push([...preference]));
  const reducedPreferences: PreferenceList = [];
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

  console.log(reducedPreferences);
  return reducedPreferences;
}

// Phase 2: repeated rounds of rotation elimination
function RunPhase2(preferences: PreferenceList): StablePartition {
  return [[]];
}

function RunProposalRound(
  proposalOrders: PreferenceList,
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
  proposalOrders: PreferenceList,
  proposedTo: Matching
): boolean {
  return proposedTo.some(
    (match, i) => proposalOrders[i].length > 0 && match === null
  );
}

type Rotation = Array<number>;

function FindRotation(activePreferences: PreferenceList): Rotation {
  return [];
}

function EliminateRotation(activePreferences: PreferenceList, rotation: Rotation): PreferenceList {
  return [[]];
}
