import { Stack, Text, Image } from "@chakra-ui/react";

const Rules: React.FC = () => {
  return (
    <Stack align="center">
      <Text>
        <strong>Mastermind is a game of breaking codes.</strong> It involves two
        parties: the code maker and the code breaker.
        <br />
        <br />
        Every game, the computer (the code maker) comes up with a random code.
        You&apos;re goal as the code breaker is to{" "}
        <strong>correctly guess the code within 10 turns.</strong>
        <br />
        <br />
        Each time you make a guess, you can check it and the code breaker will
        tell you how close your guess was with{" "}
        <strong>two simple pieces of information:</strong>
        <br />
        <br />
        (1) How many of the pegs in your guess are the correct color and in the
        correct position? -{" "}
        <strong>
          This is represented with the number of red pegs in the code breakers
          response
        </strong>
        <br />
        <br />
        (2) How many of the pegs in your guess are the correct color but in the
        wrong position? -{" "}
        <strong>
          This is represented with the number of white pegs in the code breakers
          response
        </strong>
        <br />
        <br />
        For example, we can conclude that the following guess has one peg with
        the correct color and position, and two with the correct color but wrong
        position, from the code breaker’s response on the right.
        <br />
        <br />
        <Image src="/rules.png" alt="Example" />
        <br />
        Note that the pegs in the code breaker&apos;s response aren&apos;t in
        any particular order corresponding with the guess.
        <br />
        <br />
        Using only this information, you have to break the code.
      </Text>
    </Stack>
  );
};

export default Rules;
