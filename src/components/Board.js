import React, { useState, useEffect, useCallback } from "react";
import Square from "./Square";
import GameInfo from "./GameInfo";
import { checkWinner } from "./CheckWinner";

const Board = ({ gameType }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null);

  const handleSquareClick = useCallback(
    (index) => {
      if (board[index] || winner) {
        return;
      }

      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);

      const newPlayer = player === "X" ? "O" : "X";
      setPlayer(newPlayer);
    },
    [board, player, winner]
  );

  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setWinner(winner);
    }
  }, [board]);

  useEffect(() => {
    if (gameType === "AI" && player === "O" && !winner) {
      const emptySquares = board.reduce(
        (acc, val, index) => (val === null ? acc.concat(index) : acc),
        []
      );

      const bestMove = minimax(board, emptySquares, "O");

      handleSquareClick(bestMove.index);
    }
  }, [player, board, winner, gameType, handleSquareClick]);

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setPlayer("X");
    setWinner(null);
  };

  return (
    <>
      <div className="board-row">
        <Square value={board[0]} onClick={() => handleSquareClick(0)} />
        <Square value={board[1]} onClick={() => handleSquareClick(1)} />
        <Square value={board[2]} onClick={() => handleSquareClick(2)} />
      </div>
      <div className="board-row">
        <Square value={board[3]} onClick={() => handleSquareClick(3)} />
        <Square value={board[4]} onClick={() => handleSquareClick(4)} />
        <Square value={board[5]} onClick={() => handleSquareClick(5)} />
      </div>
      <div className="board-row">
        <Square value={board[6]} onClick={() => handleSquareClick(6)} />
        <Square value={board[7]} onClick={() => handleSquareClick(7)} />
        <Square value={board[8]} onClick={() => handleSquareClick(8)} />
      </div>
      <GameInfo player={player} winner={winner} handleReset={handleReset} />
    </>
  );
};

const minimax = (board, emptySquares, player) => {
  const opponent = player === "X" ? "O" : "X";

  if (checkWinner(board) === "O") {
    return { score: 10 };
  } else if (checkWinner(board) === "X") {
    return { score: -10 };
  } else if (emptySquares.length === 0) {
    return { score: 0 };
  }

  const moves = emptySquares.map((index) => {
    const newBoard = [...board];
    newBoard[index] = player;
    const result = minimax(
      newBoard,
      emptySquares.filter((i) => i !== index),
      opponent
    );
    return { index, score: result.score };
  });

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (const move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  } else {
    let bestScore = Infinity;
    for (const move of moves) {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }
  }

  return bestMove;
};

export default Board;
