import type { NextApiRequest, NextApiResponse } from "next";
const { buildPoseidon } = require("circomlibjs");
const snarkjs = require("snarkjs");
const ff = require("ffjavascript");
import random from "seedrandom";

const getSolution = (seed: number) => {
  const generator = random(seed.toString());
  const solution = [];

  for (let i = 0; i < 4; i++) {
    solution.push(Math.floor(generator.quick() * 8));
  }

  return solution;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { guess, id } = req.body;

  const poseidon = await buildPoseidon();
  const F = poseidon.F;

  const salt = 50;
  const solution = getSolution(id);
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
