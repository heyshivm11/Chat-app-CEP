
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { RotateCw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 400;
const BIKE_WIDTH = 48;
const BIKE_HEIGHT = 48;
const OBSTACLE_WIDTH = 32;
const OBSTACLE_HEIGHT = 32;
const BIKE_INITIAL_X = BOARD_WIDTH / 2 - BIKE_WIDTH / 2;
const BIKE_Y = BOARD_HEIGHT - 60;

const GAME_SPEED_START = 10;
const GAME_SPEED_INCREMENT = 0.1;


function BikeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 20C16.2091 20 18 18.2091 18 16C18 13.7909 16.2091 12 14 12C11.7909 12 10 13.7909 10 16C10 18.2091 11.7909 20 14 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 20C6.20914 20 8 18.2091 8 16C8 13.7909 6.20914 12 4 12C1.79086 12 0 13.7909 0 16C0 18.2091 1.79086 20 4 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.21 12.33L12.5 7L15 9.5L10 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 16H3.5L5.5 7H10.5L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

function ConeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 20H20L12 2Z" fill="#f97316" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 16H19" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6.5 12H17.5" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
}

export function BikeRacingGame() {
    const [bikeX, setBikeX] = useState(BIKE_INITIAL_X);
    const [obstacles, setObstacles] = useState<{ x: number, y: number }[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameSpeed, setGameSpeed] = useState(GAME_SPEED_START);

    const gameBoardRef = useRef<HTMLDivElement>(null);

    const resetGame = () => {
        setBikeX(BIKE_INITIAL_X);
        setObstacles([]);
        setScore(0);
        setGameOver(false);
        setGameStarted(true);
        setGameSpeed(GAME_SPEED_START);
        gameBoardRef.current?.focus();
    };

    useEffect(() => {
        if (!gameStarted || gameOver) return;
        gameBoardRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setBikeX(x => Math.max(0, x - 20));
            } else if (e.key === 'ArrowRight') {
                setBikeX(x => Math.min(BOARD_WIDTH - BIKE_WIDTH, x + 20));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameStarted, gameOver]);

    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const gameLoop = setInterval(() => {
            // Move obstacles
            const newObstacles = obstacles.map(obs => ({ ...obs, y: obs.y + gameSpeed })).filter(obs => obs.y < BOARD_HEIGHT);

            // Add new obstacle
            if (Math.random() < 0.05) {
                newObstacles.push({ x: Math.random() * (BOARD_WIDTH - OBSTACLE_WIDTH), y: -OBSTACLE_HEIGHT });
            }
            
            setObstacles(newObstacles);
            setScore(s => s + 1);
            setGameSpeed(speed => speed + GAME_SPEED_INCREMENT);

            // Collision detection
            for (const obs of newObstacles) {
                if (
                    bikeX < obs.x + OBSTACLE_WIDTH &&
                    bikeX + BIKE_WIDTH > obs.x &&
                    BIKE_Y < obs.y + OBSTACLE_HEIGHT &&
                    BIKE_Y + BIKE_HEIGHT > obs.y
                ) {
                    setGameOver(true);
                    setGameStarted(false);
                    break;
                }
            }
        }, 50);

        return () => clearInterval(gameLoop);
    }, [gameStarted, gameOver, obstacles, bikeX, gameSpeed]);


    return (
        <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold">Score: {score}</div>
            <div
                ref={gameBoardRef}
                tabIndex={0}
                className="bike-game-board"
            >
                <div className="sun"></div>
                <div className="road">
                    <div className="road-lines"></div>
                </div>

                <BikeIcon 
                    className="bike text-foreground"
                    style={{ left: bikeX, top: BIKE_Y }}
                />

                {obstacles.map((obs, i) => (
                    <ConeIcon
                        key={i}
                        className="bike-obstacle"
                        style={{ left: obs.x, top: obs.y }}
                    />
                ))}
                
                {(!gameStarted || gameOver) && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center rounded-md z-10">
                        {gameOver ? (
                            <>
                                <h3 className="text-3xl font-bold text-destructive-foreground">Game Over</h3>
                                <p className="text-xl text-destructive-foreground flex items-center gap-2 mt-2">
                                    <Trophy className="text-yellow-400" /> Final Score: {score}
                                </p>
                            </>
                        ) : (
                            <h3 className="text-3xl font-bold text-foreground">Sunset Bike Racing</h3>
                        )}
                        <Button onClick={resetGame} variant="secondary" className="mt-6">
                            <RotateCw className="mr-2 h-4 w-4" />
                            {gameOver ? "Play Again" : "Start Game"}
                        </Button>
                    </div>
                )}
            </div>
            <div className="text-sm text-muted-foreground">Use Left/Right arrow keys to move.</div>
        </div>
    );
}

