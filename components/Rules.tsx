import { Stack, Text } from "@chakra-ui/react";

const Rules: React.FC = () => {
  return (
    <Stack align="center">
      <Text>
        <strong>Mastermind is a game of breaking codes.</strong>
        <br />
        <br />
        It involves two parties: the code maker and the code breaker.
        <br />
        <br />
        Every game, the computer (the code maker) comes up with a random code.
        You&apos;re goal as the code breaker is to correctly guess the code
        within the set number of turns you have.
        <br />
        <br />
        Each time you make a guess, the computer will tell you how many pegs in
        your guess are in the correct color and position (with the black pegs)
        and how many pegs in your guess are in the correct color but in the
        wrong position (with the white pegs).
        <br />
        <br />
        Using only this information, you have to break the code in time.
      </Text>
    </Stack>
  );
};

export default Rules;
