
"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { RotateCw, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLAYERS = {
  RED: { color: 'red', home: 'red-home', start: 1, path: Array.from({ length: 51 }, (_, i) => (i + 1) % 52) },
  GREEN: { color: 'green', home: 'green-home', start: 14, path: Array.from({ length: 51 }, (_, i) => (i + 14) % 52) },
  YELLOW: { color: 'yellow', home: 'yellow-home', start: 27, path: Array.from({ length: 51 }, (_, i) => (i + 27) % 52) },
  BLUE: { color: 'blue', home: 'blue-home', start: 40, path: Array.from({ length: 51 }, (_, i) => (i + 40) % 52) },
};

const PLAYER_ORDER = ['RED', 'GREEN', 'YELLOW', 'BLUE'];
const SAFE_SPOTS = [1, 9, 14, 22, 27, 35, 40, 48];

const INITIAL_PIECES = {
  RED: Array(4).fill({ position: -1, state: 'home' }), // -1 is home
  GREEN: Array(4).fill({ position: -1, state: 'home' }),
  YELLOW: Array(4).fill({ position: -1, state: 'home' }),
  BLUE: Array(4).fill({ position: -1, state: 'home' }),
};

export function LudoGame() {
  const [pieces, setPieces] = useState(INITIAL_PIECES);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [message, setMessage] = useState("Roll the dice to start!");

  const currentPlayer = PLAYER_ORDER[currentPlayerIndex];

  const resetGame = () => {
    setPieces(INITIAL_PIECES);
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setWinner(null);
    setMessage("Roll the dice to start!");
  };
  
  const nextPlayer = () => {
      setCurrentPlayerIndex((prev) => (prev + 1) % PLAYER_ORDER.length);
      setDiceValue(null);
  }

  const rollDice = () => {
    if (winner) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);
    
    const playerPieces = pieces[currentPlayer as keyof typeof pieces];
    const canMove = playerPieces.some((p, i) => canMovePiece(i, roll));
    
    if (!canMove) {
        setMessage(`Player ${currentPlayer} rolled a ${roll} but has no possible moves. Passing turn.`);
        setTimeout(nextPlayer, 1500);
    } else {
        setMessage(`Player ${currentPlayer} rolled a ${roll}. Select a piece to move.`);
    }
  };

  const canMovePiece = (pieceIndex: number, roll: number): boolean => {
    const playerKey = currentPlayer as keyof typeof pieces;
    const piece = pieces[playerKey][pieceIndex];
    if (piece.state === 'finished') return false;
    if (piece.state === 'home') return roll === 6;
    
    // Check if move is beyond finish
    const playerInfo = PLAYERS[playerKey as keyof typeof PLAYERS];
    const currentPathIndex = playerInfo.path.indexOf(piece.position);
    return currentPathIndex + roll < 57;
  }

  const movePiece = (pieceIndex: number) => {
    if (diceValue === null || winner) return;

    const playerKey = currentPlayer as keyof typeof pieces;
    if (!canMovePiece(pieceIndex, diceValue)) {
        setMessage("Invalid move. Try another piece or roll again.");
        return;
    }

    let newPieces = JSON.parse(JSON.stringify(pieces));
    let piece = newPieces[playerKey][pieceIndex];

    if (piece.state === 'home' && diceValue === 6) {
      piece.state = 'active';
      piece.position = PLAYERS[playerKey as keyof typeof PLAYERS].start;
      setMessage(`Player ${currentPlayer} entered a piece!`);
    } else if (piece.state === 'active') {
      const playerInfo = PLAYERS[playerKey as keyof typeof PLAYERS];
      const currentPathIndex = playerInfo.path.indexOf(piece.position);
      
      const newPathIndex = currentPathIndex + diceValue;

      if (newPathIndex < 51) {
          piece.position = playerInfo.path[newPathIndex];
      } else {
          // Move into home column
          piece.state = 'finishing';
          piece.position = newPathIndex - 50; // Position within home column
      }
      
      if (piece.position > 6 && piece.state === 'finishing') {
          piece.state = 'finished';
          piece.position = -1;
      }
      
      // Capture logic
      if (piece.state !== 'finished' && !SAFE_SPOTS.includes(piece.position)) {
        PLAYER_ORDER.forEach(p_key => {
            if(p_key !== playerKey) {
                newPieces[p_key].forEach((op: any) => {
                    if (op.position === piece.position) {
                        op.position = -1;
                        op.state = 'home';
                    }
                });
            }
        });
      }
    }
    
    setPieces(newPieces);

    if (newPieces[playerKey].every((p: any) => p.state === 'finished')) {
      setWinner(playerKey);
      setMessage(`Player ${playerKey} wins!`);
      return;
    }
    
    if (diceValue !== 6) {
        nextPlayer();
    } else {
        setMessage(`Player ${currentPlayer} got a 6, roll again!`);
        setDiceValue(null);
    }
  };

  const renderPiece = (player: string, pieceIndex: number) => {
    const pieceData = pieces[player as keyof typeof pieces][pieceIndex];
    const canMove = diceValue ? canMovePiece(pieceIndex, diceValue) : false;
    
    return (
        <div
            key={`${player}-${pieceIndex}`}
            onClick={() => player === currentPlayer && movePiece(pieceIndex)}
            className={cn(
                `ludo-piece ludo-piece-${player.toLowerCase()}`,
                {
                    'cursor-pointer ring-2 ring-offset-2 ring-white': player === currentPlayer && canMove,
                    'opacity-50': player === currentPlayer && !canMove,
                }
            )}
        >
            {pieceData.state === 'finished' && <Crown className="h-4 w-4 text-yellow-300" />}
        </div>
    );
  };
  
  const getPositionStyle = (player: string, pieceIndex: number) => {
      const piece = pieces[player as keyof typeof pieces][pieceIndex];
      if (piece.state === 'home') return {};
      if (piece.state === 'finished') return {};
      // This is a simplified positioning. A real implementation would need a precise map.
      return { gridColumn: '2 / span 13', gridRow: '2 / span 13', placeSelf: 'center' };
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-lg font-semibold">{winner ? `Winner is ${winner}!` : message}</div>
      <div className="ludo-board">
        {/* Homes */}
        <div className="ludo-home ludo-home-red">{Array(4).fill(0).map((_, i) => renderPiece('RED', i))}</div>
        <div className="ludo-home ludo-home-green">{Array(4).fill(0).map((_, i) => renderPiece('GREEN', i))}</div>
        <div className="ludo-home ludo-home-yellow">{Array(4).fill(0).map((_, i) => renderPiece('YELLOW', i))}</div>
        <div className="ludo-home ludo-home-blue">{Array(4).fill(0).map((_, i) => renderPiece('BLUE', i))}</div>
        
        {/* Center */}
        <div className="ludo-center">
            <div className="ludo-arrow-up"></div>
            <div className="ludo-arrow-right"></div>
            <div className="ludo-arrow-down"></div>
            <div className="ludo-arrow-left"></div>
        </div>

        {/* Paths */}
        {Array.from({length: 52}).map((_, i) => (
            <div key={i} className={`ludo-path ludo-path-${i+1}`}>
                {SAFE_SPOTS.includes(i + 1) && <Star className="h-4 w-4 text-white/50" />}
            </div>
        ))}

        {/* Player Home Paths */}
        {['red', 'green', 'yellow', 'blue'].map(color => 
            Array.from({length: 6}).map((_, i) => (
                <div key={`${color}-${i}`} className={`ludo-home-path ludo-home-path-${color}-${i+1}`}></div>
            ))
        )}

        {/* Render active pieces on the board */}
        {PLAYER_ORDER.map(player => 
            pieces[player as keyof typeof pieces].map((p, i) => {
                if (p.state !== 'home' && p.state !== 'finished') {
                    // Logic to place piece on correct square div needed here
                    // This is a complex part requiring mapping piece.position to a grid cell
                }
                return null;
            })
        )}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex flex-col items-center">
          <span className="font-semibold">Current Player:</span>
          <div className={`w-8 h-8 rounded-full ludo-bg-${currentPlayer.toLowerCase()}`} />
        </div>
        <Button onClick={rollDice} disabled={!!diceValue || !!winner}>
          {diceValue ? `Rolled: ${diceValue}` : "Roll Dice"}
        </Button>
        <Button onClick={resetGame} variant="secondary">
          <RotateCw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
}

// Dummy Star component as lucide-react might not have it
function Star(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
    )
}
