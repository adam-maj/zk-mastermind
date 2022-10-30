import { execSync } from "child_process";
import fs from "fs";

const basePath = process.cwd();
const paths = fs.readdirSync("./circuits");

for (const path of paths) {
  const fullPath = `${basePath}/circuits/${path}`;
  if (!fs.lstatSync(fullPath).isDirectory()) {
    continue;
  }

  process.chdir(fullPath);

  const commands = [
    `circom --r1cs --wasm circuit.circom`,
    `snarkjs powersoftau new bn128 12 pot12_0000.ptau -v`,
    `snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name=\"Contribution\" -v`,
    `snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v`,
    `snarkjs groth16 setup circuit.r1cs pot12_final.ptau circuit_0000.zkey -v`,
    `snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey --name=\"Contribution\" -v`,
    `snarkjs zkey export verificationkey circuit_final.zkey verification_key.json -v`,
    `cp circuit_js/circuit.wasm circuit.wasm`,
    `rm circuit_0000.zkey circuit.r1cs pot12_0000.ptau pot12_0001.ptau pot12_final.ptau`,
    `rm -rf circuit_js`,
    `rm -rf ../../public/keys && mkdir ../../public/keys`,
    `mv circuit_final.zkey ../../public/keys/circuit_final.zkey`,
    `mv verification_key.json ../../public/keys/verification_key.json`,
    `mv circuit.wasm ../../public/keys/circuit.wasm`,
  ];

  for (const command of commands) {
    execSync(command, { stdio: "inherit" });
  }
}
