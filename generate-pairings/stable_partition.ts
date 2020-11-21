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
function RunPhase1(preferences: PreferenceList): PreferenceList {
  return [[]];
}

// Phase 2: repeated rounds of rotation elimination
function RunPhase2(preferences: PreferenceList): StablePartition {
  return [[]];
}

function RunProposalRound(preferences: PreferenceList, partialMatching: Matching) {}

type Rotation = Array<number>;

function FindRotation(activePreferences: PreferenceList): Rotation {
  return [];
}

function EliminateRotation(activePreferences: PreferenceList, rotation: Rotation): PreferenceList {
  return [[]];
}
