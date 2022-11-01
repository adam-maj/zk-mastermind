import React from "react";

type GameAction =
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
      };
    }
  | {
      type: "RESET_GAME";
    };

type GameBoard = {
  guess: number[];
  partial: number;
  correct: number;
}[];

type GameContextValue = {
  game: GameBoard;
  dispatch: React.Dispatch<GameAction>;
};

const DEFAULT_ROW = {
  guess: [9, 9, 9, 9],
  partial: 0,
  correct: 0,
};
const DEFAULT_GAME = Array.from(Array(10).keys()).map(() => DEFAULT_ROW);
const GameContext = React.createContext<GameContextValue>(
  {} as GameContextValue
);

export function useGame() {
  return React.useContext(GameContext);
}

const gameReducer = (state: GameBoard, action: GameAction) => {
  const updatedState = [...state];
  switch (action.type) {
    case "EDIT_ROW":
      updatedState[action.payload.row].guess[action.payload.index] =
        action.payload.value;
      return updatedState;
    case "SUBMIT_ROW":
      return updatedState;
    case "RESET_GAME":
      return updatedState;
  }
};

const GameProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [game, dispatch] = React.useReducer(gameReducer, DEFAULT_GAME);

  return (
    <GameContext.Provider value={{ game, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
