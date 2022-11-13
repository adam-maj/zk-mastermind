import { Stack, Text } from "@chakra-ui/react";

const About: React.FC = () => {
  return (
    <Stack align="center">
      <Text>
        You may be wondering how zero-knowledge proofs fit into all this.
        <br />
        <br />
        Consider the following question: how do you know that the code breaker
        is telling the truth when it gives you its response?
        <br />
        <br />
        Since you don&apos;t have the code, the code breaker could be completely
        lying about how much of your guess is correct, and you wouldn&apos;t
        know. So how do we solve this issue?
        <br />
        <br />
        What if the code breaker could prove to us that they have some specific
        code - and for that code, our guess has a specific number correct and
        partially correct - all without revealing the code itself.
        <br />
        <br />
        This is exactly what zero-knowledge proofs let us do!
        <br />
        <br />
        In fact, this is exactly what&apos;s happening with this game:
        <br />
        <br />
        (1) You submit your guess and the code breaker responds with the number
        correct and partial, along with a zkSNARK proof that they are telling
        the truth.
        <br />
        <br />
        (2) You can verify this proof by sending it to a smart contract deployed
        on-chain, which will confirm that the zkSNARK is valid.
      </Text>
    </Stack>
  );
};

export default About;
