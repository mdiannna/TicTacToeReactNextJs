"use client";

import React, { useMemo, useState } from "react";

type Player = "X" | "O";
type SquareValue = Player | null;

function calculateWinner(squares: SquareValue[]): Player | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function useTicTacToe() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => squares.every((v) => v !== null) && !winner,
    [squares, winner]
  );

  function handlePlay(index: number) {
    if (squares[index] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return { squares, xIsNext, winner, isDraw, handlePlay, resetGame };
}

function SquareButton(props: {
  value: SquareValue;
  onClick: () => void;
  isWinning: boolean;
}) {
  const { value, onClick, isWinning } = props;
  return (
    <button
      aria-label={value ? `Square ${value}` : "Empty square"}
      onClick={onClick}
      className={
        "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 text-3xl sm:text-4xl md:text-5xl font-bold flex items-center justify-center border border-black/20 dark:border-white/20 transition-colors " +
        (isWinning
          ? "bg-emerald-100 dark:bg-emerald-900/40"
          : "hover:bg-black/[.03] dark:hover:bg-white/[.06]")
      }
    >
      {value}
    </button>
  );
}

export default function Home() {
  const { squares, xIsNext, winner, isDraw, handlePlay, resetGame } =
    useTicTacToe();

  const winningLine = useMemo(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c] as const;
      }
    }
    return [] as const;
  }, [squares]);

  const statusLabel = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "Draw!"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">Tic-Tac-Toe</h1>
        <div
          role="status"
          aria-live="polite"
          className="text-base sm:text-lg"
        >
          {statusLabel}
        </div>
        <div
          className="grid grid-cols-3 grid-rows-3 gap-0 bg-black/20 dark:bg-white/20"
          style={{ lineHeight: 0 }}
        >
          {squares.map((value, idx) => (
            <SquareButton
              key={idx}
              value={value}
              onClick={() => handlePlay(idx)}
              isWinning={winningLine.includes(idx as never)}
            />)
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetGame}
            className="rounded-md px-4 py-2 text-sm font-medium border border-black/20 dark:border-white/20 hover:bg-black/[.03] dark:hover:bg-white/[.06]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
