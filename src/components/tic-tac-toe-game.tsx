
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
    const [isBotTurn, setIsBotTurn] = useState(false);
    
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = winner === 'Draw' ? 'Game is a Draw' : "Winner: " + winner;
    } else {
        status = "Next player: " + (isXNext ? "X" : "O");
    }

    function handleClick(i: number) {
        if (squares[i] || calculateWinner(squares) || isBotTurn) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = 'X';
        setSquares(nextSquares);
        setIsXNext(false);
        setIsBotTurn(true);
    }

    function findBestMove(currentSquares: (string|null)[]) {
        // 1. Check if bot can win
        for (let i = 0; i < 9; i++) {
            if (!currentSquares[i]) {
                const tempSquares = currentSquares.slice();
                tempSquares[i] = 'O';
                if (calculateWinner(tempSquares) === 'O') {
                    return i;
                }
            }
        }

        // 2. Check if player can win and block
        for (let i = 0; i < 9; i++) {
            if (!currentSquares[i]) {
                const tempSquares = currentSquares.slice();
                tempSquares[i] = 'X';
                if (calculateWinner(tempSquares) === 'X') {
                    return i;
                }
            }
        }

        // 3. Take center if available
        if (!currentSquares[4]) {
            return 4;
        }

        // 4. Take a random corner
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => !currentSquares[i]);
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // 5. Take a random available square
        const availableSquares = currentSquares.map((sq, i) => sq === null ? i : null).filter(i => i !== null);
        if (availableSquares.length > 0) {
            return availableSquares[Math.floor(Math.random() * availableSquares.length)] as number;
        }
        
        return -1; // Should not happen
    }

    useEffect(() => {
        if (isBotTurn && !winner) {
            const botMoveTimeout = setTimeout(() => {
                const bestMove = findBestMove(squares);
                if(bestMove !== -1) {
                    const nextSquares = squares.slice();
                    nextSquares[bestMove] = 'O';
                    setSquares(nextSquares);
                    setIsXNext(true);
                    setIsBotTurn(false);
                }
            }, 500); // 0.5s delay for bot move

            return () => clearTimeout(botMoveTimeout);
        }
    }, [isBotTurn, squares, winner]);

    function resetGame() {
        setSquares(Array(9).fill(null));
        setIsXNext(true);
        setIsBotTurn(false);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 text-lg font-semibold">{status}</div>
            <div className="tic-tac-toe-board">
                {squares.map((square, i) => (
                    <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
                ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">You are X. The bot is O.</p>
            <Button onClick={resetGame} variant="secondary" className="mt-2">
                <RotateCw className="mr-2 h-4 w-4" />
                Reset Game
            </Button>
        </div>
    );
}
