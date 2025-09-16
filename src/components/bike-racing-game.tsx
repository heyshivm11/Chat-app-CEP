
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { RotateCw, Trophy } from '@/components/ui/lucide-icons';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 400;
const BIKE_WIDTH = 48;
const BIKE_HEIGHT = 48;
const OBSTACLE_WIDTH = 32;
const OBSTACLE_HEIGHT = 32;
const BIKE_INITIAL_X = BOARD_WIDTH / 2 - BIKE_WIDTH / 2;
const BIKE_Y = BOARD_HEIGHT - 60;

const GAME_SPEED_START = 5;
const GAME_SPEED_INCREMENT = 0.005;


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
    const [obstacles, setObstacles] = useState<{ id: number, x: number, y: number }[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameSpeed, setGameSpeed] = useState(GAME_SPEED_START);
    const nextObstacleId = useRef(0);

    const gameBoardRef = useRef<HTMLDivElement>(null);

    const resetGame = () => {
        setBikeX(BIKE_INITIAL_X);
        setObstacles([]);
        setScore(0);
        setGameOver(false);
        setGameStarted(true);
        setGameSpeed(GAME_SPEED_START);
        nextObstacleId.current = 0;
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
            setObstacles(prevObstacles => {
                const newObstacles = prevObstacles
                    .map(obs => ({ ...obs, y: obs.y + gameSpeed }))
                    .filter(obs => obs.y < BOARD_HEIGHT);

                if (Math.random() < 0.05 * (gameSpeed / GAME_SPEED_START)) {
                    newObstacles.push({ 
                        id: nextObstacleId.current++,
                        x: Math.random() * (BOARD_WIDTH - OBSTACLE_WIDTH), 
                        y: -OBSTACLE_HEIGHT 
                    });
                }
                
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

                return newObstacles;
            });
            
            setScore(s => s + 1);
            setGameSpeed(speed => speed + GAME_SPEED_INCREMENT);

        }, 50);

        return () => clearInterval(gameLoop);
    }, [gameStarted, gameOver, bikeX, gameSpeed]);


    return (
        <div className="flex flex-col items-center gap-4 p-4 rounded-xl w-full max-w-[700px]">
            <Card className="p-2 px-6 rounded-full border-2 border-black">
                <div className="text-xl font-bold">Score: {score}</div>
            </Card>
            <div
                ref={gameBoardRef}
                tabIndex={0}
                className="relative overflow-hidden rounded-xl border-2 border-black w-full"
                style={{ height: BOARD_HEIGHT, maxWidth: BOARD_WIDTH }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-orange-300"></div>
                <div className="absolute top-8 left-8 h-16 w-16 bg-yellow-300 rounded-full"></div>
                
                <div 
                    className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-600"
                    style={{
                        clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)'
                    }}
                >
                    <div className="absolute inset-0 border-t-8 border-dashed border-gray-400/50 animate-[roadlines_20s_linear_infinite]"></div>
                </div>


                <BikeIcon 
                    className="absolute text-gray-800"
                    style={{ 
                        width: BIKE_WIDTH, 
                        height: BIKE_HEIGHT, 
                        left: bikeX, 
                        top: BIKE_Y,
                        transform: 'translateZ(0)',
                    }}
                />

                {obstacles.map((obs) => (
                    <ConeIcon
                        key={obs.id}
                        className="absolute"
                        style={{ 
                            width: OBSTACLE_WIDTH, 
                            height: OBSTACLE_HEIGHT,
                            left: obs.x, 
                            top: obs.y,
                            transform: 'translateZ(0)',
                        }}
                    />
                ))}
                
                {(!gameStarted || gameOver) && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center rounded-md z-10">
                        {gameOver ? (
                            <>
                                <h3 className="text-4xl font-bold text-white">Game Over</h3>
                                <p className="text-2xl text-white flex items-center gap-2 mt-2">
                                    <Trophy className="text-yellow-400" /> Final Score: {score}
                                </p>
                            </>
                        ) : (
                            <h3 className="text-4xl font-bold text-white">Sunset Bike Racing</h3>
                        )}
                        <Button onClick={resetGame} className="mt-6 btn-custom btn-secondary-custom">
                            <RotateCw className="mr-2 h-4 w-4" />
                            {gameOver ? "Play Again" : "Start Game"}
                        </Button>
                    </div>
                )}
            </div>
            <div className="text-sm text-muted-foreground">Use Left/Right arrow keys to move.</div>

            <style jsx>{`
                @keyframes roadlines {
                    from { background-position: 0 0; }
                    to { background-position: 0 ${BOARD_HEIGHT}px; }
                }
            `}</style>
        </div>
    );
}
