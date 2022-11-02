import type { NextApiRequest, NextApiResponse } from "next";
const { buildPoseidon } = require("circomlibjs");
const snarkjs = require("snarkjs");
const ff = require("ffjavascript");

type Proof = {
  proof: Record<string, any>;
  publicSignals: string[];
  calldata: string[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { guess } = req.body;

  console.log(guess);

  const poseidon = await buildPoseidon();
  const F = poseidon.F;

  const salt = 50;
  const solution = [1, 2, 3, 4];
  const solutionHash = F.toObject(poseidon([salt, ...solution])).toString();

  const inputs = {
    guess: guess,
    numPartial: 0,
    numCorrect: 0,
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
