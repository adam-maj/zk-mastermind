import { Stack, HStack, Box, Grid, GridItem } from "@chakra-ui/react";
import { useGame } from "../context/GameContext";

const Game: React.FC = () => {
  const { game } = useGame();

  return (
    <Stack align="center">
      {game?.map((row, rowIndex) => (
        <HStack key={rowIndex} spacing={4}>
          <HStack
            bg="#A47551"
            height="60px"
            borderRadius="md"
            justify="center"
            key={rowIndex}
            spacing={4}
            padding="16px"
          >
            {row.guess.map((value, valIndex) => (
              <Box
                key={valIndex}
                borderRadius="full"
                h="40px"
                w="40px"
                bg="#523A28"
              />
            ))}
          </HStack>
          <Grid
            gridTemplateColumns="1fr 1fr"
            gridTemplateRows="1fr 1fr"
            gap="8px"
          >
            {Array.from(Array(4).keys()).map((index) => (
              <GridItem
                key={index}
                border={
                  index >= row.correct + row.partial ? "1px solid" : "none"
                }
                borderColor={
                  index >= row.correct + row.partial ? "gray.400" : "none"
                }
                bg={
                  row.correct > index
                    ? "black"
                    : row.correct + row.partial > index
                    ? "white"
                    : "gray.100"
                }
                w="16px"
                h="16px"
                borderRadius="full"
              />
            ))}
          </Grid>
        </HStack>
      ))}
    </Stack>
  );
};

export default Game;
