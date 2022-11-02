import { Stack, HStack, Box, Grid, GridItem, Button } from "@chakra-ui/react";
import { useGame } from "../context/GameContext";

const COLORS: Record<number, Record<string, string>> = {
  0: {
    body: "red.400",
    border: "red.500",
  },
  1: {
    body: "orange.400",
    border: "orange.500",
  },
  2: {
    body: "yellow.400",
    border: "yellow.500",
  },
  3: {
    body: "green.400",
    border: "green.500",
  },
  4: {
    body: "teal.400",
    border: "teal.500",
  },
  5: {
    body: "blue.400",
    border: "blue.500",
  },
  6: {
    body: "cyan.400",
    border: "cyan.500",
  },
  7: {
    body: "purple.400",
    border: "purple.500",
  },
  8: {
    body: "#523A28",
    border: "#523A28",
  },
};

const Game: React.FC = () => {
  const { game, dispatch, submit, verify } = useGame();

  const currentRow = game.board.map((row) => row.isSubmitted).indexOf(false);

  return (
    <Stack align="center" position="relative" padding="0px">
      <Stack
        position="absolute"
        left="-30px"
        mt="8px"
        bg="#A47551"
        width="60px"
        borderRadius="md"
        align="center"
        spacing={4}
        padding="16px"
      >
        {Array.from(Array(8).keys()).map((color) => (
          <GridItem
            key={color}
            borderRadius="full"
            h="40px"
            w="40px"
            bg={COLORS[color].body}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
            border={game.color === color ? "2px solid white" : "none"}
            onClick={() =>
              dispatch({ type: "CHOOSE_COLOR", payload: { color } })
            }
          />
        ))}
      </Stack>
      {game.board.map((row, rowIndex) => (
        <HStack key={rowIndex} spacing={2} position="relative">
          <HStack
            bg="#A47551"
            height="60px"
            borderRadius="md"
            justify="center"
            key={rowIndex}
            spacing={4}
            padding="16px"
          >
            {row.guess.map((color, valIndex) => (
              <Box
                key={valIndex}
                borderRadius="full"
                h="40px"
                w="40px"
                border="2px solid"
                borderColor={COLORS[color].border}
                bg={COLORS[color].body}
                cursor={rowIndex === currentRow ? "pointer" : undefined}
                _hover={rowIndex === currentRow ? { opacity: 0.8 } : undefined}
                onClick={
                  rowIndex === currentRow
                    ? () =>
                        dispatch({
                          type: "EDIT_ROW",
                          payload: {
                            row: rowIndex,
                            index: valIndex,
                            value: game.color,
                          },
                        })
                    : undefined
                }
              />
            ))}
          </HStack>
          <Grid
            bg="#A47551"
            padding="10px"
            gridTemplateColumns="1fr 1fr"
            gridTemplateRows="1fr 1fr"
            gap="8px"
            borderRadius="md"
          >
            {Array.from(Array(4).keys()).map((index) => (
              <GridItem
                key={index}
                bg={
                  row.correct > index
                    ? "black"
                    : row.correct + row.partial > index
                    ? "white"
                    : "#523A28"
                }
                w="16px"
                h="16px"
                borderRadius="full"
              />
            ))}
          </Grid>
          {currentRow === rowIndex && (
            <Button
              position="absolute"
              size="sm"
              colorScheme="purple"
              right="-80px"
              width="73px"
              isDisabled={row.guess.includes(8)}
              onClick={() => submit(rowIndex)}
            >
              Submit
            </Button>
          )}
          {row.isSubmitted && (
            <Button
              position="absolute"
              size="sm"
              colorScheme="blue"
              width="73px"
              right="-80px"
              onClick={() => verify(rowIndex)}
            >
              Verify
            </Button>
          )}
        </HStack>
      ))}
    </Stack>
  );
};

export default Game;
