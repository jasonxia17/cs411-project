import { Preferences } from "./types";
import { GenerateNearPopularMatching } from "./near_popular_matching";

function UnstableMatchingExample() {
  const preferences: Preferences = new Map([
    [0, [1, 2, 3]],
    [1, [2, 0, 3]],
    [2, [0, 1, 3]],
    [3, [0, 1, 2]]
  ]);

  // Expected output: must be able to match all users, even though stable matching doesn't exist
  GenerateNearPopularMatching(preferences);
}

function FullExample() {
  const preferences: Preferences = new Map([
    [0, [2, 1, 4, 3, 9, 5, 12, 13]],
    [1, [4, 2, 0, 5, 12, 13]],
    [2, [3, 1, 0, 5, 12, 13]],
    [3, [4, 0, 2, 5, 12, 13]],
    [4, [10, 0, 3, 1, 5, 12, 13]],
    [5, [0, 1, 2, 3, 4, 6, 10]],
    [6, [8, 7, 9, 11, 5, 12, 13]],
    [7, [9, 8, 10, 6]],
    [8, [9, 7, 6]],
    [9, [0, 6, 8, 7]],
    [10, [11, 7, 4, 5, 12, 13]],
    [11, [6, 10]],
    [12, [0, 1, 2, 3, 4, 6, 10]],
    [13, [0, 1, 2, 3, 4, 6, 10]]
  ]);

  GenerateNearPopularMatching(preferences);
}

UnstableMatchingExample();
FullExample();
