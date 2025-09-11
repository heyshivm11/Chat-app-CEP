"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const GAME_SIZE = 20; // 20x20 grid
const TILE_SIZE = 20; // 20px per tile
const GAME_WIDTH = GAME_SIZE * TILE_SIZE;
const GAME_HEIGHT = GAME_SIZE * TILE_SIZE;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Start moving up
const GAME_SPEED = 150; // ms

type Vector2D = { x: number; y: number };

const getRandomCoordinate = (): Vector2D => ({
    x: Math.floor(Math.random() * GAME_SIZE),
    y: Math.floor(Math.random() * GAME_SIZE),
});

export function SnakeGame() {
    const [snake, setSnake] = useState<Vector2D[]>(INITIAL_SNAKE);
    const [food, setFood] = useState<Vector2D>(INITIAL_FOOD);
    const [direction, setDirection] = useState<Vector2D>(INITIAL_DIRECTION);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const gameLoopRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const storedHighScore = localStorage.getItem('snake-highscore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setSnake(INITIAL_SNAKE);
        setFood(INITIAL_FOOD);
        setDirection(INITIAL_DIRECTION);
        gameLoopRef.current = setInterval(gameLoop, GAME_SPEED);
    };

    const resetGame = () => {
        clearInterval(gameLoopRef.current);
        startGame();
    };

    const gameLoop = () => {
        setSnake(prevSnake => {
            const newSnake = [...prevSnake];
            const head = { ...newSnake[0] };
            head.x += direction.x;
            head.y += direction.y;

            // Wall collision
            if (head.x < 0 || head.x >= GAME_SIZE || head.y < 0 || head.y >= GAME_SIZE) {
                endGame();
                return prevSnake;
            }

            // Self collision
            for (let i = 1; i < newSnake.length; i++) {
                if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
                    endGame();
                    return prevSnake;
                }
            }

            newSnake.unshift(head);

            // Food collision
            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 10);
                let newFoodPosition;
                do {
                    newFoodPosition = getRandomCoordinate();
                } while (newSnake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
                setFood(newFoodPosition);
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    };

    const endGame = () => {
        clearInterval(gameLoopRef.current);
        setGameOver(true);
        setGameStarted(false);
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snake-highscore', score.toString());
        }
    };
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameStarted && !gameOver) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    startGame();
                }
            }
            if (gameOver && e.key === 'Enter') {
                resetGame();
            }

            let newDirection = { ...direction };
            switch (e.key) {
                case 'ArrowUp':
                    if (direction.y === 0) newDirection = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (direction.y === 0) newDirection = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (direction.x === 0) newDirection = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (direction.x === 0) newDirection = { x: 1, y: 0 };
                    break;
                default:
                    break;
            }
            setDirection(newDirection);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, gameStarted, gameOver]);
    
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className="relative bg-muted/20 rounded-md overflow-hidden border-2 border-border"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
                {!gameStarted && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
                        <h3 className="text-2xl font-bold">{gameOver ? 'Game Over' : 'Snake'}</h3>
                        <p className="text-muted-foreground">{gameOver ? `Your Score: ${score}` : 'Use Arrow Keys to Start'}</p>
                        {gameOver &&
                            <Button onClick={resetGame} variant="outline" className="mt-4">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Play Again
                            </Button>
                        }
                    </div>
                )}
                {gameStarted && (
                    <>
                        {snake.map((segment, index) => (
                            <div
                                key={index}
                                className={cn("absolute", index === 0 ? "bg-primary" : "bg-primary/70")}
                                style={{
                                    left: segment.x * TILE_SIZE,
                                    top: segment.y * TILE_SIZE,
                                    width: TILE_SIZE,
                                    height: TILE_SIZE,
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
                    </>
                )}
            </div>
            <div className="w-full flex justify-between text-lg font-semibold px-2" style={{ width: GAME_WIDTH }}>
                <span>Score: {score}</span>
                <span>High Score: {highScore}</span>
            </div>
        </div>
    );
}