import { Stack, Text } from "@chakra-ui/react";

const About: React.FC = () => {
  return (
    <Stack align="center">
      <Text>
        <strong>
          I built this project to learn about applied zero-knowledge
          cryptography.
        </strong>
        <br />
        <br />
        I took the following steps to build this project:
        <br />
        1. Build the zk circuit in circom
        <br />
        2. Completed trusted setup and generate proving and verifying keys
        <br />
        3. Generate and deploy a verifying smart contract
        <br />
        4. Build a backend using the proving keys to generate proofs
        <br />
        5. Build a frontend to interact with the backend and actually play the
        game
      </Text>
    </Stack>
  );
};

export default About;
