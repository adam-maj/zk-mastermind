pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";

template ValidColor(numColors) {
  signal input color;
  signal output out;

  component isValid = LessThan(4);
  isValid.in[0] <== color;
  isValid.in[1] <== numColors;

  out <== isValid.out;
}

template Mastermind(codeSize, numColors) {
  // ================== ASSERTIONS =================
  assert(codeSize <= 8); // No more than 8 possible values in code
  assert(numColors <= 16); // No more that 16 possible colors

  // ============= PUBLIC INPUT SIGANLS ============
  signal input guess[codeSize]; // The players guess
  signal input numPartial; // The number of partial matches (correct color but incorrect location)
  signal input numCorrect; // The number of correct matches (correct color and correct location)
  signal input solutionHash; // The hash of the game masters solution

  // ============ PRIVATE INPUT SIGNALS ============
  signal input solution[codeSize]; // The game masters private solution
  signal input solutionSalt; // The game masters private salt for the public solution hash

  // ================ OUTPUT SIGNALS ===============
  signal output solutionHashOut; // The hash of the game masters solution as output

  // Verify that guess and solution have valid colors
  component guessColorsValid[codeSize];
  component solutionColorsValid[codeSize];

  for (var i = 0; i < codeSize; i++) {
    guessColorsValid[i] = ValidColor(numColors);
    guessColorsValid[i].color <== guess[i];
    guessColorsValid[i].out === 1;

    solutionColorsValid[i] = ValidColor(numColors);
    solutionColorsValid[i].color <== solution[i];
    solutionColorsValid[i].out === 1;
  }

  // If no duplicate colors are allowed, then ensure no duplicates in the guess and solution

  // Verify that numPartial and numCorrect are accurate

  // Verify that private solution matches public solutionHash
  component poseidon = Poseidon(numColors);
  poseidon.inputs[0] <== solutionSalt;
  for (var i = 0; i < codeSize; i++) {
    poseidon.inputs[i + 1] <== solution[i];
  }

  solutionHashOut <== poseidon.hash;
  solutionHashOut === solutionHash;
}

component main { public [guess, numPartial, numCorrect, solutionHash] } = Mastermind(4, 8);