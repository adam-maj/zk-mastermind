import { execSync } from "child_process";

const commands = [
  `rm -rf contracts && mkdir contracts`,
  `snarkjs zkey export solidityverifier public/keys/circuit_final.zkey contracts/Verifier.sol -v`,
];

for (const command of commands) {
  execSync(command, { stdio: "inherit" });
}
