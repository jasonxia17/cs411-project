import { PreferenceList } from "./types";
import { RunPhase1 } from "./stable_partition";

function Phase1Example() {
  const preferences: PreferenceList = [
    [2, 3, 1, 5, 4],
    [5, 4, 3, 0, 2],
    [1, 3, 4, 0, 5],
    [4, 1, 2, 5, 0],
    [2, 0, 1, 3, 5],
    [4, 0, 2, 3, 1]
  ];

  RunPhase1(preferences);
}

Phase1Example();
