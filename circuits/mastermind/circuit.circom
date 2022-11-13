pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/gates.circom";

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
  assert(codeSize <= numColors); // No more possible values than colors

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

  component guessColorsValid[codeSize];
  component solutionColorsValid[codeSize];

  // Arithmetic to get the number of constraints we need to create...
  //   ...in order to verify that there are no duplicate colors
  var numEqualityChecks = 0;
  var numEqualityChecksIndex = codeSize - 1;
  while (numEqualityChecksIndex > 0) {
    numEqualityChecks += numEqualityChecksIndex;
    numEqualityChecksIndex--;
  }

  component guessColorsEqual[numEqualityChecks];
  component solutionColorsEqual[numEqualityChecks];
  var equalCheckIndex = 0;

  // Verify that guess and solution have valid colors
  for (var i = 0; i < codeSize; i++) {
    guessColorsValid[i] = ValidColor(numColors);
    guessColorsValid[i].color <== guess[i];
    guessColorsValid[i].out === 1;

    solutionColorsValid[i] = ValidColor(numColors);
    solutionColorsValid[i].color <== solution[i];
    solutionColorsValid[i].out === 1;
  }

  // Count the number of partial and correct values in the guess
  var countPartial = 0;
  var countCorrect = 0;
  component partialOrCorrect[codeSize * codeSize];
  component doesIMatch[codeSize * codeSize];
  component doesJMatch[codeSize * codeSize];
  component isPartial[codeSize * codeSize];

  var usedForPartialGuess[codeSize * codeSize];
  var usedForPartialSolution[codeSize * codeSize];
  for (var i = 0; i < codeSize * codeSize; i++) {
    usedForPartialGuess[i] = 0;
    usedForPartialSolution[i] = 0;
  }

  for (var i = 0; i < codeSize; i++) {
    for (var j = 0; j < codeSize; j++) {
      // Check if guess[i] == solution[j]
      partialOrCorrect[i * codeSize + j] = IsEqual();
      partialOrCorrect[i * codeSize + j].in[0] <== guess[i];
      partialOrCorrect[i * codeSize + j].in[1] <== solution[j];

      // Check if guess[i] == solution[i]
      doesIMatch[i * codeSize + j] = IsEqual(); 
      doesIMatch[i * codeSize + j].in[0] <== guess[i];
      doesIMatch[i * codeSize + j].in[1] <== solution[i];

      // Check if guess[j] == solution[j]
      doesJMatch[i * codeSize + j] = IsEqual(); 
      doesJMatch[i * codeSize + j].in[0] <== guess[j];
      doesJMatch[i * codeSize + j].in[1] <== solution[j];

      isPartial[i * codeSize + j] = MultiAND(i + j + 3); 
      isPartial[i * codeSize + j].in[0] <== partialOrCorrect[i * codeSize + j].out;
      isPartial[i * codeSize + j].in[1] <== 1 - doesIMatch[i * codeSize + j].out;
      isPartial[i * codeSize + j].in[2] <== 1 - doesJMatch[i * codeSize + j].out;

      // Check that guess[i] hasn't been used for partial yet
      for (var k = 0; k < j; k++) {
        isPartial[i * codeSize + j].in[k + 3] <== 1 - usedForPartialGuess[i * codeSize + k];
      }

      // Check that solution[j] hasn't been used for partial yet
      for (var k = 0; k < i; k++) {
        isPartial[i * codeSize + j].in[j + k + 3] <== 1 - usedForPartialSolution[k * codeSize + j];
      }

      if (i == j) {
        countCorrect += partialOrCorrect[i * codeSize + j].out;
      } else {
        countPartial += isPartial[i * codeSize + j].out;
        usedForPartialGuess[i * codeSize + j] = isPartial[i * codeSize + j].out;
        usedForPartialSolution[i * codeSize + j] = isPartial[i * codeSize + j].out;
      }
    }
  }

  // Verify that numPartial and numCorrect are accurate
  component partialEqual = IsEqual();
  partialEqual.in[0] <== numPartial;
  partialEqual.in[1] <== countPartial;
  partialEqual.out === 1;

  component correctEqual = IsEqual();
  correctEqual.in[0] <== numCorrect;
  correctEqual.in[1] <== countCorrect;
  correctEqual.out === 1;

  // Verify that private solution matches public solutionHash
  component poseidon = Poseidon(codeSize + 1);
  poseidon.inputs[0] <== solutionSalt;
  for (var i = 0; i < codeSize; i++) {
    poseidon.inputs[i + 1] <== solution[i];
  }

  solutionHashOut <== poseidon.out;
  solutionHashOut === solutionHash;
}

component main { public [guess, numPartial, numCorrect, solutionHash] } = Mastermind(4, 8);