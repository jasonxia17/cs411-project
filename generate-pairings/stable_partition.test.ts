import { Preferences } from "./types";
import { RunPhase1, RunPhase2 } from "./stable_partition";

function Phase1Example() {
  const preferences: Preferences = new Map([
    [0, [2, 3, 1, 5, 4]],
    [1, [5, 4, 3, 0, 2]],
    [2, [1, 3, 4, 0, 5]],
    [3, [4, 1, 2, 5, 0]],
    [4, [2, 0, 1, 3, 5]],
    [5, [4, 0, 2, 3, 1]]
  ]);

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

function Phase2Example() {
  const reducedPreferences: Preferences = new Map([
    [0, [3, 1, 5]],
    [1, [5, 4, 3, 0, 2]],
    [2, [1, 3, 4]],
    [3, [4, 1, 2, 5, 0]],
    [4, [2, 1, 3]],
    [5, [0, 3, 1]]
  ]);

  RunPhase2(reducedPreferences);

  /* Expected output: (3 rounds)
  Rotation 1: [ [ 0, 2 ], [ 3, 1 ] ]
  After elimination: [
    [ 1, 5 ],
    [ 5, 4, 3, 0 ],
    [ 3, 4 ],
    [ 4, 1, 2 ],
    [ 2, 1, 3 ],
    [ 0, 3, 1 ]
  ]
  Rotation 2: [ [ 0, 1, 3 ], [ 1, 5, 4 ] ]
  After elimination: [ [ 5 ], [ 4, 3 ], [ 3, 4 ], [ 1, 2 ], [ 2, 1 ], [ 0 ] ]
  Rotation 3: [ [ 1, 2 ], [ 4, 3 ] ]
  After elimination: [ [ 5 ], [ 3 ], [ 4 ], [ 1 ], [ 2 ], [ 0 ] ]
  */
}

// Taken from the paper (Figure 3, page 23)
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

  const reducedPreferences = RunPhase1(preferences);
  RunPhase2(reducedPreferences);
}

// Phase1Example();
// Phase2Example();
FullExample();
