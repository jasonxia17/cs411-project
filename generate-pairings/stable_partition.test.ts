import { PreferenceMatrix } from "./types";
import { RunPhase1, RunPhase2 } from "./stable_partition";

function Phase1Example() {
  const preferences: PreferenceMatrix = [
    [2, 3, 1, 5, 4],
    [5, 4, 3, 0, 2],
    [1, 3, 4, 0, 5],
    [4, 1, 2, 5, 0],
    [2, 0, 1, 3, 5],
    [4, 0, 2, 3, 1]
  ];

  RunPhase1(preferences);

  /* Expected output:
  [
    [ 3, 1, 5 ],
    [ 5, 4, 3, 0, 2 ],
    [ 1, 3, 4 ],
    [ 4, 1, 2, 5, 0 ],
    [ 2, 1, 3 ],
    [ 0, 3, 1 ]
  ]
  */
}

Phase1Example();

function Phase2Example() {
  const reducedPreferences: PreferenceMatrix = [
    [ 3, 1, 5 ],
    [ 5, 4, 3, 0, 2 ],
    [ 1, 3, 4 ],
    [ 4, 1, 2, 5, 0 ],
    [ 2, 1, 3 ],
    [ 0, 3, 1 ]
  ];

  RunPhase2(reducedPreferences);
}

Phase2Example();