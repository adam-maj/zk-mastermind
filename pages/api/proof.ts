import type { NextApiRequest, NextApiResponse } from "next";
const { buildPoseidon } = require("circomlibjs");
const snarkjs = require("snarkjs");
const ff = require("ffjavascript");

const CODES = [
  [0, 1, 0, 2],
  [7, 6, 1, 2],
  [1, 1, 2, 2],
  [1, 0, 3, 5],
  [7, 6, 2, 2],
  [1, 3, 3, 1],
  [4, 2, 4, 5],
  [0, 2, 1, 5],
  [7, 0, 0, 3],
  [4, 5, 6, 0],
];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { guess, id } = req.body;

  const poseidon = await buildPoseidon();
  const F = poseidon.F;

  const salt = 50;
  const solution = CODES[id];
  const solutionHash = F.toObject(poseidon([salt, ...solution])).toString();

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

  const inputs = {
    guess: guess,
    numPartial,
    numCorrect,
    solutionHash: solutionHash,
    solution: solution,
    solutionSalt: salt,
  };

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    inputs,
    "./public/keys/circuit.wasm",
    "./public/keys/circuit_final.zkey"
  );

  // required to generate solidity call params
  const editedPublicSignals = ff.utils.unstringifyBigInts(publicSignals);
  const editedProof = ff.utils.unstringifyBigInts(proof);

  // Generate solidity compatible params for Verifier.sol
  const calldata = await snarkjs.groth16.exportSolidityCallData(
    editedProof,
    editedPublicSignals
  );

  return res.status(200).json({
    proof,
    publicSignals,
    calldata: JSON.parse(`[${calldata}]`),
  });
};

export default handler;
