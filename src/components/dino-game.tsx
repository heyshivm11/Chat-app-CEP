"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 200;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 40;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const OBSTACLE_WIDTH = 20;
const OBSTACLE_HEIGHT = 40;
const OBSTACLE_SPEED = 5;

const Dino = ({ y, isJumping }: { y: number, isJumping: boolean }) => (
    <div
        className={cn("absolute bottom-0 transition-transform duration-100", isJumping && "animate-jump")}
        style={{ left: '20px', width: DINO_WIDTH, height: DINO_HEIGHT, transform: `translateY(${-y}px)` }}
    >
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary w-full h-full">
            <path d="M14.5,13.5C14.5,13.5 15,14.5 15,15.5C15,16.5 14,17 14,17H13.5C13.5,17 13,17 13,16C13,15 13.5,13.5 14.5,13.5M20,11V12.5C20,12.5 18,13 18,14C18,15 19,15.5 19,15.5V16C19,16.5 18,17 17.5,17H15C15,17 15,17.5 15,18C15,18.5 15.5,19 16,19H17C17.5,19 18,18.5 18,18V17.5C18,17.2 18.2,17 18.5,17H20C20.8,17 21,16.3 21,15.5V12C21,11.4 20.6,11 20,11M13.5,6C13.5,6 13,7 13.5,7.5C14,8 15,8 15,8C15,8 16,8 16.5,7.5C17,7 16.5,6 16.5,6C16.5,6 15,5.5 13.5,6M12,12.5C12,12.5 12,11.5 11.5,11.5C11,11.5 11,12.5 11,12.5C11,12.5 10.5,13 10,13.5C9.5,14 9,15 9,15C9,15 8.5,17 8.5,17H8C7,17 6.5,16.5 6.5,15.5C6.5,14.5 7,13.5 7,13.5L6,13L5.5,14.5L4.5,14L5,12.5V12L10,11L11,10H12V12.5M12,2C12,2 8,4 8,7C8,10 12,12 12,12C12,12 16,10 16,7C16,4 12,2 12,2Z" />
        </svg>
    </div>
);

const Obstacle = ({ x }: { x: number }) => (
    <div
        className="absolute bottom-0 bg-destructive"
        style={{ left: `${x}px`, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT }}
    />
);

export function DinoGame() {
    const [dinoY, setDinoY] = useState(0);
    const [dinoVelocity, setDinoVelocity] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [obstacles, setObstacles] = useState<{ x: number }[]>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const gameLoopRef = useRef<NodeJS.Timeout>();
    const obstacleTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const storedHighScore = localStorage.getItem('dino-highscore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setDinoY(0);
        setDinoVelocity(0);
        setObstacles([{ x: GAME_WIDTH - 50 }]);
        gameLoop();
        spawnObstacle();
    };
    
    const resetGame = () => {
        clearInterval(gameLoopRef.current);
        clearTimeout(obstacleTimeoutRef.current);
        startGame();
    };
    
    const gameLoop = () => {
        gameLoopRef.current = setInterval(() => {
            if (gameOver) {
                clearInterval(gameLoopRef.current);
                return;
            }

            // Dino physics
            setDinoVelocity(v => {
                const newV = v + GRAVITY;
                setDinoY(y => {
                    const newY = y + newV;
                    if (newY <= 0) {
                        setIsJumping(false);
                        return 0;
                    }
                    return newY;
                });
                return newV;
            });

            // Move obstacles
            setObstacles(obs => obs.map(o => ({ ...o, x: o.x - OBSTACLE_SPEED })).filter(o => o.x > -OBSTACLE_WIDTH));
            
            // Score
            setScore(s => s + 1);

            // Collision detection
            const dinoRect = { x: 20, y: dinoY, width: DINO_WIDTH, height: DINO_HEIGHT };
            obstacles.forEach(obstacle => {
                const obstacleRect = { x: obstacle.x, y: 0, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT };
                if (
                    dinoRect.x < obstacleRect.x + obstacleRect.width &&
                    dinoRect.x + dinoRect.width > obstacleRect.x &&
                    dinoRect.y < obstacleRect.y + obstacleRect.height &&
                    dinoRect.y + dinoRect.height > obstacleRect.y
                ) {
                    endGame();
                }
            });
        }, 20);
    };
    
    const spawnObstacle = () => {
        obstacleTimeoutRef.current = setTimeout(() => {
            if (!gameOver) {
                setObstacles(obs => [...obs, { x: GAME_WIDTH + Math.random() * 200 }]);
                spawnObstacle();
            }
        }, 1500 + Math.random() * 1500);
    };

    const endGame = () => {
        setGameOver(true);
        setGameStarted(false);
        clearInterval(gameLoopRef.current);
        clearTimeout(obstacleTimeoutRef.current);
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('dino-highscore', score.toString());
        }
    };
    
    const handleJump = (e: React.KeyboardEvent | React.MouseEvent) => {
        if ((e as React.KeyboardEvent).code === 'Space' || e.type === 'click') {
            if (!gameStarted && !gameOver) {
                startGame();
            } else if (!isJumping && gameStarted) {
                setIsJumping(true);
                setDinoVelocity(JUMP_FORCE);
            } else if (gameOver) {
                resetGame();
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => handleJump(e as any);
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isJumping, gameStarted, gameOver]);

    return (
        <div className="flex flex-col items-center gap-4" onClick={handleJump} tabIndex={0} onKeyDown={handleJump}>
             <div
                className="relative w-full bg-muted/20 rounded-md overflow-hidden border-2 border-border"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
                {!gameStarted && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
                        <h3 className="text-2xl font-bold">{gameOver ? 'Game Over' : 'Dino Run'}</h3>
                        <p className="text-muted-foreground">{gameOver ? `Your Score: ${Math.floor(score / 10)}` : 'Click or Press Space to Start'}</p>
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
                        <Dino y={dinoY} isJumping={isJumping} />
                        {obstacles.map((o, i) => <Obstacle key={i} x={o.x} />)}
                    </>
                )}

                <div className="absolute bottom-0 left-0 w-full h-1 bg-foreground/30" />
            </div>
            <div className="w-full flex justify-between text-lg font-semibold px-2" style={{width: GAME_WIDTH}}>
                <span>Score: {Math.floor(score / 10)}</span>
                <span>High Score: {Math.floor(highScore / 10)}</span>
            </div>
        </div>
    );
}

