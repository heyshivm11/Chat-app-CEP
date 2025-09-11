
"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

function Square({ value, onSquareClick }: { value: string | null, onSquareClick: () => void }) {
    return (
        <button 
            className={cn(
                "tic-tac-toe-square",
                value === 'X' ? 'text-primary' : 'text-destructive'
            )}
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function calculateWinner(squares: (string | null)[]) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every(square => square !== null)) {
      return 'Draw';
  }
  return null;
}

export function TicTacToeGame() {
    const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = winner === 'Draw' ? 'Game is a Draw' : "Winner: " + winner;
    } else {
        status = "Next player: " + (isXNext ? "X" : "O");
    }

    function handleClick(i: number) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = isXNext ? 'X' : 'O';
        setSquares(nextSquares);
        setIsXNext(!isXNext);
    }

    function resetGame() {
        setSquares(Array(9).fill(null));
        setIsXNext(true);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 text-lg font-semibold">{status}</div>
            <div className="tic-tac-toe-board">
                {squares.map((square, i) => (
                    <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
                ))}
            </div>
            <Button onClick={resetGame} variant="secondary" className="mt-4">
                <RotateCw className="mr-2 h-4 w-4" />
                Reset Game
            </Button>
        </div>
    );
}
