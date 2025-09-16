
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { RotateCw, Trophy } from 'lucide-react';
import { Card } from './ui/card';

const BOARD_SIZE = 20;
const TILE_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 0.98;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [speed, setSpeed] = useState<number | null>(null);
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
    setSpeed(INITIAL_SPEED);
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
    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
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
        return prevSnake;
      }

      // Self collision
      for (const segment of newSnake) {
        if (head.x === segment.x && head.y === segment.y) {
          setGameOver(true);
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        setSpeed(s => s ? Math.max(50, s * SPEED_INCREMENT) : null);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    })
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
            setSpeed(INITIAL_SPEED);
        }

        switch (e.key) {
            case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
            case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
            case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
            case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, speed]);


  return (
    <div className="flex flex-col items-center gap-4">
        <Card className="p-2 px-6 rounded-full border-2 border-black">
            <div className="text-xl font-bold">Score: {score}</div>
        </Card>
      <div 
        ref={boardRef}
        tabIndex={0}
        className="relative bg-background/50 rounded-xl outline-none border-2 border-black"
        style={{ 
          width: BOARD_SIZE * TILE_SIZE, 
          height: BOARD_SIZE * TILE_SIZE,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute rounded"
            style={{
              left: segment.x * TILE_SIZE,
              top: segment.y * TILE_SIZE,
              width: TILE_SIZE -1,
              height: TILE_SIZE -1,
              backgroundColor: index === 0 ? 'hsl(var(--primary))' : `hsl(var(--primary) / ${1 - index/snake.length * 0.5})`,
              transition: 'all 0.1s linear',
            }}
          />
        ))}
        <div
          className="absolute bg-destructive rounded-full"
          style={{
            left: food.x * TILE_SIZE + TILE_SIZE / 4,
            top: food.y * TILE_SIZE + TILE_SIZE / 4,
            width: TILE_SIZE / 2,
            height: TILE_SIZE / 2,
          }}
        />

        {(!gameStarted || gameOver) && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center rounded-md z-10">
                {gameOver ? (
                    <>
                        <h3 className="text-3xl font-bold text-white">Game Over</h3>
                        <p className="text-xl text-white flex items-center gap-2 mt-2">
                           <Trophy className="text-yellow-400" /> Final Score: {score}
                        </p>
                    </>
                ) : (
                    <h3 className="text-3xl font-bold text-white">Snake</h3>
                )}
                <Button onClick={startGame} className="mt-6 btn-custom btn-secondary-custom">
                    <RotateCw className="mr-2 h-4 w-4" />
                    {gameOver ? "Play Again" : "Start Game"}
                </Button>
            </div>
        )}
      </div>
       <div className="text-sm text-muted-foreground">Use Arrow keys to move.</div>
    </div>
  );
}
