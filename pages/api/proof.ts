import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
const { buildPoseidon } = require("circomlibjs");
const snarkjs = require("snarkjs");

type Proof = {
  proof: string;
  publicSignals: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Proof>) => {
  const poseidon = await buildPoseidon();
  const F = poseidon.F;

  const salt = 50;
  const solution = [4, 5, 6, 7];
  const solutionHash = F.toObject(poseidon([salt, ...solution])).toString();

  const inputs = {
    guess: [0, 1, 2, 3],
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

  const verificationKey = JSON.parse(
    fs.readFileSync("./public/keys/verification_key.json").toString()
  );

  const isValid = await snarkjs.groth16.verify(
    verificationKey,
    publicSignals,
    proof
  );

  console.log(isValid);

  return res.status(200).json({
    proof: JSON.stringify(proof),
    publicSignals: JSON.stringify(publicSignals),
  });
};

export default handler;
