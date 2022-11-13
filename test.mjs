const solution = [7, 0, 0, 3];
const guess = [0, 3, 1, 4];
const partialsGuess = [0, 0, 0, 0];
const partialsSolution = [0, 0, 0, 0];

let numPartial = 0;
let numCorrect = 0;

for (let i = 0; i < guess.length; i++) {
  for (let j = 0; j < guess.length; j++) {
    if (guess[i] === solution[j]) {
      if (i === j) {
        numCorrect++;
      } else {
        if (
          guess[j] !== solution[j] &&
          guess[i] !== solution[i] &&
          partialsSolution[j] === 0 &&
          partialsGuess[i] == 0
        ) {
          numPartial++;
          partialsGuess[i] = 1;
          partialsSolution[j] = 1;
        }
      }
    }
  }
}

console.log(`Partial: ${numPartial}, Correct: ${numCorrect}`);
