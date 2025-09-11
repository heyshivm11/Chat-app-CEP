
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { RotateCw, Footprints, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 40;
const OBSTACLE_WIDTH = 20;
const OBSTACLE_HEIGHT = 40;
const GRAVITY = 0.6;
const JUMP_FORCE = -15;

export function DinoRunGame() {
  const [dinoY, setDinoY] = useState(GAME_HEIGHT - DINO_HEIGHT);
  const [dinoVelocity, setDinoVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<{ x: number; width: number; height: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const gameLoopRef = useRef<number>();
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gameAreaRef.current?.focus();
  }, []);

  const startGame = () => {
    setDinoY(GAME_HEIGHT - DINO_HEIGHT);
    setDinoVelocity(0);
    setIsJumping(false);
    setObstacles([{ x: GAME_WIDTH, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT }]);
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
    gameAreaRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isRunning && !gameOver) {
          startGame();
        }
        if (!isJumping && !gameOver) {
          setIsJumping(true);
          setDinoVelocity(JUMP_FORCE);
        }
        if (gameOver) {
          startGame();
        }
      }
    };

    const gameArea = gameAreaRef.current;
    gameArea?.addEventListener('keydown', handleKeyDown);
    return () => gameArea?.removeEventListener('keydown', handleKeyDown);
  }, [isJumping, gameOver, isRunning]);

  const gameLoop = () => {
    if (!isRunning || gameOver) return;

    // Dino physics
    setDinoVelocity(v => {
        const newVelocity = v + GRAVITY;
        setDinoY(y => {
            const newY = y + newVelocity;
            if (newY >= GAME_HEIGHT - DINO_HEIGHT) {
                setIsJumping(false);
                return GAME_HEIGHT - DINO_HEIGHT;
            }
            return newY;
        });
        return newVelocity;
    });

    // Obstacle movement and generation
    setObstacles(prevObstacles => {
      let newObstacles = prevObstacles
        .map(o => ({ ...o, x: o.x - 5 - (score / 100) }))
        .filter(o => o.x > -o.width);

      if (newObstacles.length === 0 || (newObstacles[newObstacles.length - 1].x < GAME_WIDTH - 200 - Math.random() * 200)) {
        newObstacles.push({
          x: GAME_WIDTH,
          width: 20 + Math.random() * 20,
          height: 30 + Math.random() * 30,
        });
      }
      return newObstacles;
    });

    // Collision detection
    const dinoRect = { x: 50, y: dinoY, width: DINO_WIDTH, height: DINO_HEIGHT };
    for (const obstacle of obstacles) {
      const obstacleRect = { x: obstacle.x, y: GAME_HEIGHT - obstacle.height, width: obstacle.width, height: obstacle.height };
      if (
        dinoRect.x < obstacleRect.x + obstacleRect.width &&
        dinoRect.x + dinoRect.width > obstacleRect.x &&
        dinoRect.y < obstacleRect.y + obstacleRect.height &&
        dinoRect.y + dinoRect.height > obstacleRect.y
      ) {
        setGameOver(true);
        setIsRunning(false);
      }
    }
    
    setScore(s => s + 0.1);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isRunning) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isRunning, gameOver, dinoY, obstacles]);


  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2 text-sm text-muted-foreground">
        <span>Score: {Math.floor(score)}</span>
      </div>
      <div
        ref={gameAreaRef}
        tabIndex={0}
        className="relative bg-background/50 rounded-md outline-none overflow-hidden"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          border: '1px solid hsl(var(--border))'
        }}
      >
        {/* Dino */}
        <div
          className="absolute text-primary"
          style={{
            left: 50,
            bottom: GAME_HEIGHT - dinoY - DINO_HEIGHT,
            width: DINO_WIDTH,
            height: DINO_HEIGHT,
          }}
        >
            <Footprints className="w-full h-full" />
        </div>
        
        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="absolute text-destructive"
            style={{
              left: obstacle.x,
              bottom: 0,
              width: obstacle.width,
              height: obstacle.height,
            }}
          >
            <AlertTriangle className="w-full h-full" />
          </div>
        ))}
        
        {/* Game Over Screen */}
        {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center rounded-md">
                <h3 className="text-2xl font-bold text-destructive-foreground">Game Over</h3>
                <p className="text-destructive-foreground">Your Score: {Math.floor(score)}</p>
                <Button onClick={startGame} variant="secondary" className="mt-4">
                    <RotateCw className="mr-2 h-4 w-4" />
                    Play Again
                </Button>
            </div>
        )}
        
        {/* Start Screen */}
        {!isRunning && !gameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center rounded-md">
                <h3 className="text-xl font-bold text-foreground">Dino Run</h3>
                <p className="text-muted-foreground mt-2">Press Space or Up Arrow to Jump</p>
                <Button onClick={startGame} variant="secondary" className="mt-4">
                    Start Game
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
