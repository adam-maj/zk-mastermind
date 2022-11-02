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
import Game from "../components/Game";

export default function Mastermind() {
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
            <ButtonGroup
              as={TabList}
              variant="outline"
              size="sm"
              isAttached
              bg="white"
              borderRadius="md"
            >
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
        </Stack>
      </Container>
    </Center>
  );
}
