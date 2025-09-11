
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { RotateCw } from 'lucide-react';

const TILE_SIZE = 20;
const BOARD_WIDTH = 28;
const BOARD_HEIGHT = 31;

// 0: empty, 1: wall, 2: pellet, 3: power pellet, 4: ghost house
const initialBoard = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,0,1,0,0,4,4,0,0,1,0,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const initialPacman = { x: 14, y: 23, dir: 'LEFT' };

const initialGhosts = [
  { x: 13.5, y: 11, dir: 'LEFT', name: 'blinky', state: 'chase' },
  { x: 13.5, y: 14, dir: 'UP', name: 'pinky', state: 'chase' },
  { x: 11.5, y: 14, dir: 'UP', name: 'inky', state: 'chase' },
  { x: 15.5, y: 14, dir: 'UP', name: 'clyde', state: 'chase' },
];

type Position = { x: number; y: number; dir: string; };
type Ghost = Position & { name: string; state: string; };

export function PacmanGame() {
  const [board, setBoard] = useState(initialBoard);
  const [pacman, setPacman] = useState<Position>(initialPacman);
  const [ghosts, setGhosts] = useState<Ghost[]>(initialGhosts);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const gameLoopRef = useRef<number>();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const pacmanDirRef = useRef(pacman.dir);

  const totalPellets = initialBoard.flat().filter(t => t === 2 || t === 3).length;

  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setPacman(initialPacman);
    setGhosts(initialGhosts);
    pacmanDirRef.current = initialPacman.dir;
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
    gameAreaRef.current?.focus();
  }, []);

  const move = (character: Position, board: number[][]) => {
    const { x, y, dir } = character;
    let nextX = x, nextY = y;
    switch (dir) {
      case 'UP': nextY -= 0.25; break;
      case 'DOWN': nextY += 0.25; break;
      case 'LEFT': nextX -= 0.25; break;
      case 'RIGHT': nextX += 0.25; break;
    }

    // Tunnel logic
    if (nextX < 0) nextX = BOARD_WIDTH - 1;
    if (nextX >= BOARD_WIDTH) nextX = 0;

    const nextTileX = Math.round(nextX);
    const nextTileY = Math.round(nextY);

    if (board[nextTileY] && board[nextTileY][nextTileX] !== 1) {
      return { ...character, x: nextX, y: nextY };
    }
    return character;
  };
  
  const gameLoop = useCallback(() => {
    if (!isRunning || gameOver) return;

    // Move Pac-Man
    setPacman(p => {
      const nextPos = move({ ...p, dir: pacmanDirRef.current }, board);
      // Eat pellet
      const tileX = Math.round(nextPos.x);
      const tileY = Math.round(nextPos.y);
      if (board[tileY] && board[tileY][tileX] === 2) {
        setScore(s => s + 10);
        const newBoard = board.map(row => [...row]);
        newBoard[tileY][tileX] = 0;
        setBoard(newBoard);
      }
      return nextPos;
    });

    if (score / 10 === totalPellets) {
        setGameOver(true);
    }
    
    // Ghost collision
    ghosts.forEach(ghost => {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        if (Math.sqrt(dx * dx + dy * dy) < 0.5) {
            setGameOver(true);
        }
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [isRunning, gameOver, board, score, totalPellets, ghosts, pacman]);

  useEffect(() => {
    if (isRunning) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isRunning, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (gameOver) {
        if(e.key === ' ') resetGame();
        return;
      }
      if (!isRunning) {
        setIsRunning(true);
        return;
      }

      switch (e.key) {
        case 'ArrowUp': pacmanDirRef.current = 'UP'; break;
        case 'ArrowDown': pacmanDirRef.current = 'DOWN'; break;
        case 'ArrowLeft': pacmanDirRef.current = 'LEFT'; break;
        case 'ArrowRight': pacmanDirRef.current = 'RIGHT'; break;
      }
    };
    const gameArea = gameAreaRef.current;
    gameArea?.addEventListener('keydown', handleKeyDown);
    return () => gameArea?.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isRunning, resetGame]);

  useEffect(() => {
    gameAreaRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2 text-sm text-muted-foreground">
        <span>Score: {score}</span>
      </div>
      <div
        ref={gameAreaRef}
        tabIndex={0}
        className="relative bg-background/50 rounded-md outline-none overflow-hidden"
        style={{ width: BOARD_WIDTH * TILE_SIZE, height: BOARD_HEIGHT * TILE_SIZE }}
      >
        <div className="pacman-board" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)` }}>
          {board.flat().map((tile, index) => (
            <div key={index} className="pacman-tile">
              {tile === 1 && <div className="pacman-wall w-full h-full" />}
              {tile === 2 && <div className="pacman-pellet" />}
              {tile === 3 && <div className="pacman-power-pellet" />}
            </div>
          ))}
        </div>

        <div className="pacman" style={{ 
            left: pacman.x * TILE_SIZE - TILE_SIZE / 2, 
            top: pacman.y * TILE_SIZE - TILE_SIZE / 2,
            transform: `rotate(${pacmanDirRef.current === 'RIGHT' ? 0 : pacmanDirRef.current === 'DOWN' ? 90 : pacmanDirRef.current === 'LEFT' ? 180 : 270}deg)`
        }} />

        {ghosts.map(g => (
            <div key={g.name} className={`ghost ghost-${g.name} ${g.state === 'frightened' ? 'ghost-frightened' : ''}`} style={{
                left: g.x * TILE_SIZE - TILE_SIZE / 2, 
                top: g.y * TILE_SIZE - TILE_SIZE / 2
            }}/>
        ))}

        {(gameOver || !isRunning) && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center rounded-md">
            <h3 className="text-2xl font-bold text-destructive-foreground">
              {gameOver ? (score / 10 === totalPellets ? 'You Win!' : 'Game Over') : 'Pac-Man'}
            </h3>
            {gameOver && <p className="text-destructive-foreground">Your Score: {score}</p>}
            <Button onClick={resetGame} variant="secondary" className="mt-4">
                <RotateCw className="mr-2 h-4 w-4" />
                {gameOver || !isRunning ? 'Play' : 'Play Again'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
