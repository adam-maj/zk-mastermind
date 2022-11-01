import {
  Button,
  Center,
  Container,
  Stack,
  Heading,
  ButtonGroup,
  Tabs,
  TabList,
  TabPanel,
  Tab,
  TabPanels,
} from "@chakra-ui/react";
import { useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import Game from "../components/Game";

export default function Mastermind() {
  const [guess, setGuess] = useState([0, 1, 2, 3]);
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS
  );

  async function verifyProof(_guess: number[]) {
    const res = await fetch("/api/proof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guess: _guess }),
    });

    const data = await res.json();
    console.log(
      `Generated proof that guess ${JSON.stringify(_guess)} has ${
        data.publicSignals[5]
      } partial and ${data.publicSignals[6]} correct:`
    );
    console.log(JSON.stringify(data.proof, undefined, 2));

    console.log(
      `Verifying proof on-chain with verifying contract '${process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS}'`
    );
    console.log(
      `Calling function 'verifyProof' on contract '${process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS}' with arguments:`
    );
    console.log(JSON.stringify(data.calldata, undefined, 2));

    const isValid = await contract?.call("verifyProof", ...data.calldata);
    console.log(
      isValid
        ? `Proof succesfully verified by contract!`
        : `Contract rejected, proof is invalid!`
    );
  }

  return (
    <Center py="40px" height="100vh">
      <Container height="100%" width="md">
        <Stack align="center" spacing={5}>
          <Heading size="xl">ZK Mastermind</Heading>

          <Tabs
            variant="unstyled"
            colorScheme="green"
            width="100%"
            align="center"
          >
            <ButtonGroup as={TabList} variant="outline" size="sm" isAttached>
              <Tab as={Button} _selected={{ bg: "gray.100" }}>
                Play
              </Tab>
              <Tab as={Button} _selected={{ bg: "gray.100" }}>
                Rules
              </Tab>
              <Tab as={Button} _selected={{ bg: "gray.100" }}>
                About
              </Tab>
            </ButtonGroup>
            <TabPanels>
              <TabPanel>
                <Game />
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
              <TabPanel>
                <p>three!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Button onClick={() => verifyProof(guess)}>Get Proof</Button>
        </Stack>
      </Container>
    </Center>
  );
}
