import { useContract } from "@thirdweb-dev/react";
import React from "react";

type GameAction =
  | {
      type: "CHOOSE_COLOR";
      payload: {
        color: number;
      };
    }
  | {
      type: "EDIT_ROW";
      payload: {
        row: number;
        index: number;
        value: number;
      };
    }
  | {
      type: "SUBMIT_ROW";
      payload: {
        row: number;
        proof: ZKProof;
      };
    }
  | {
      type: "RESET_GAME";
    };

type ZKProof = {
  proof: {
    pi_a: string[3];
    pi_b: string[3][2];
    pi_c: string[3];
    protocol: string;
    curve: string;
  };
  publicSignals: string[];
  calldata: [string[2], string[2][2], string[2], string[8]];
};

type Row = {
  guess: number[];
  partial: number;
  correct: number;
  isSubmitted: boolean;
  proof?: ZKProof;
};

type Game = {
  board: Row[];
  color: number;
};

type GameContextValue = {
  game: Game;
  dispatch: React.Dispatch<GameAction>;
  submit: (row: number) => void;
  verify: (row: number) => void;
};

const DEFAULT_GAME = {
  board: Array.from(Array(10).keys()).map(() => ({
    guess: [8, 8, 8, 8],
    partial: 0,
    correct: 0,
    isSubmitted: false,
    proof: undefined,
  })),
  color: 0,
};
const GameContext = React.createContext<GameContextValue>(
  {} as GameContextValue
);

export function useGame() {
  return React.useContext(GameContext);
}

const gameReducer = (state: Game, action: GameAction) => {
  const updatedState = { ...state };
  switch (action.type) {
    case "CHOOSE_COLOR":
      updatedState.color = action.payload.color;
      return updatedState;
    case "EDIT_ROW":
      updatedState.board[action.payload.row].guess[action.payload.index] =
        state.color;
      return updatedState;
    case "SUBMIT_ROW":
      updatedState.board[action.payload.row].partial = parseInt(
        action.payload.proof.publicSignals[5]
      );
      updatedState.board[action.payload.row].correct = parseInt(
        action.payload.proof.publicSignals[6]
      );
      updatedState.board[action.payload.row].proof = action.payload.proof;
      updatedState.board[action.payload.row].isSubmitted = true;
      return updatedState;
    case "RESET_GAME":
      return DEFAULT_GAME;
  }
};

const GameProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS
  );
  const [game, dispatch] = React.useReducer(gameReducer, DEFAULT_GAME);

  async function submit(row: number) {
    const guess = game.board[row].guess;
    const res = await fetch("/api/proof", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guess }),
    });

    const data = await res.json();
    dispatch({
      type: "SUBMIT_ROW",
      payload: {
        row,
        proof: data,
      },
    });

    console.log(
      `Received proof that guess ${JSON.stringify(guess)} has ${
        data.publicSignals[5]
      } partial and ${data.publicSignals[6]} correct:`
    );
    console.log(JSON.stringify(data.proof, undefined, 2));
  }

  async function verify(row: number) {
    const proof = game.board[row].proof;

    console.log(
      `Verifying proof on-chain with verifying contract '${process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS}'`
    );
    console.log(
      `Calling function 'verifyProof' on contract '${process.env.NEXT_PUBLIC_VERIFYING_CONTRACT_ADDRESS}' with arguments:`
    );
    console.log(JSON.stringify(proof?.calldata, undefined, 2));

    const isValid = await contract?.call("verifyProof", ...proof?.calldata);
    console.log(
      isValid
        ? `Proof succesfully verified by contract!`
        : `Contract rejected, proof is invalid!`
    );
  }

  return (
    <GameContext.Provider value={{ game, dispatch, submit, verify }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
