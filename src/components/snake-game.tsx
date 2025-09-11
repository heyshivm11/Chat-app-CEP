
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { RotateCw } from 'lucide-react';

const BOARD_SIZE = 20;
const TILE_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [speed, setSpeed] = useState<number | null>(200);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boardRef.current?.focus();
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('RIGHT');
    setSpeed(200);
    setGameOver(false);
    setScore(0);
    boardRef.current?.focus();
  };

  useEffect(() => {
    if (gameOver || speed === null) return;

    const gameInterval = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(gameInterval);
  }, [snake, direction, gameOver, speed]);


  const generateFood = (snakeBody: Position[]) => {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snakeBody.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    
    setFood(newFoodPosition);
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }
    
    // Wall collision
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      setGameOver(true);
      return;
    }

    // Self collision
    for (const segment of newSnake) {
      if (head.x === segment.x && head.y === segment.y) {
        setGameOver(true);
        return;
      }
    }

    newSnake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 1);
      // Increase speed slightly
      setSpeed(s => s ? Math.max(50, s * 0.95) : null);
      generateFood(newSnake);
    } else {
      newSnake.pop();
    }
    
    setSnake(newSnake);
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) return;
        e.preventDefault();

        if (gameOver) {
            if (e.key === ' ') startGame();
            return;
        }

        if (speed === null && e.key !== ' ') {
            setSpeed(200);
        }

        switch (e.key) {
            case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
            case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
            case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
            case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        }
    };
    
    const board = boardRef.current;
    board?.addEventListener('keydown', handleKeyDown);
    return () => board?.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, speed]);


  return (
    <div className="flex flex-col items-center">
        <div className="flex justify-between w-full mb-2 text-sm text-muted-foreground">
            <span>Score: {score}</span>
        </div>
      <div 
        ref={boardRef}
        tabIndex={0}
        className="relative bg-background/50 rounded-md outline-none"
        style={{ 
          width: BOARD_SIZE * TILE_SIZE, 
          height: BOARD_SIZE * TILE_SIZE,
          border: '1px solid hsl(var(--border))'
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-primary rounded"
            style={{
              left: segment.x * TILE_SIZE,
              top: segment.y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              backgroundColor: index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.8)',
            }}
          />
        ))}
        <div
          className="absolute bg-destructive rounded-full"
          style={{
            left: food.x * TILE_SIZE,
            top: food.y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
        />

        {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center rounded-md">
                <h3 className="text-2xl font-bold text-destructive-foreground">Game Over</h3>
                <p className="text-destructive-foreground">Your Score: {score}</p>
                <Button onClick={startGame} variant="secondary" className="mt-4">
                    <RotateCw className="mr-2 h-4 w-4" />
                    Play Again
                </Button>
            </div>
        )}
        {!gameOver && speed === null && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center rounded-md">
                <h3 className="text-xl font-bold text-foreground">Snake Game</h3>
                <p className="text-muted-foreground mt-2">Use arrow keys to move</p>
                <Button onClick={() => setSpeed(200)} variant="secondary" className="mt-4">
                    Start Game
                </Button>
            </div>
        )}

      </div>
    </div>
  );
}
