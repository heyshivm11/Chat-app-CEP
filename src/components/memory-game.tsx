
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Anchor, Atom, Award, Axe, Banana, Bath, Bell, Bike, Bomb, Bone, Book, Bot, Brain, Bug, Bus, Cake, Camera, Car, Cat, Cherry, Church, Citrus, Cloud, Code, Coffee, Cog, Coins, Cookie, Crown, Diamond, Dna, Dog, DollarSign, DoorClosed, Dumbbell, Egg, Feather, FerrisWheel, Fish, Flag, Flame, FlaskConical, Flashlight, Folder, Footprints, Fuel, Gamepad2, Gem, Ghost, Gift, GitBranch, Globe, GraduationCap, Grape, Guitar, Hammer, Hand, Hash, Heart, Helicopter, Hourglass, IceCream, Image, Infinity, Key, Knife, Lamp, Laptop, Leaf, LifeBuoy, Lightbulb, Link, Lock, Lollipop, Magnet, Map, Medal, Megaphone, Mic, Microscope, Milk, Moon, Mouse, Music, Nut, Package, Palmtree, Paperclip, ParkingCircle, Pencil, Percent, Phone, Pin, Pizza, Plane, Plug, Plus, Pocket, Podcast, Power, Puzzle, Quote, Rat, Recycle, Rocket, Rss, Ruler, Save, Scale, Scissors, ScreenShare, Search, Server, Settings, Shield, Ship, ShoppingBag, ShoppingCart, Siren, Snowflake, Soccer, Spade, Sparkles, Speaker, Star, Sticker, Store, Sun, Sword, Syringe, Tag, Target, Tent, TestTube, Ticket, ToyBrick, Train, Trash, TreePine, Trophy, Truck, Tv, Umbrella, Unlink, Usb, Utensils, Vault, Video, Volume2, Wallet, Wand, Watch, Waves, Wind, Wine, Wrench, Zap, ZoomIn, ZoomOut
} from 'lucide-react';

const allIcons = [
    Anchor, Atom, Award, Axe, Banana, Bath, Bell, Bike, Bomb, Bone, Book, Bot, Brain, Bug, Bus, Cake, Camera, Car, Cat, Cherry, Church, Citrus, Cloud, Code, Coffee, Cog, Coins, Cookie, Crown, Diamond, Dna, Dog, DollarSign, DoorClosed, Dumbbell, Egg, Feather, FerrisWheel, Fish, Flag, Flame, FlaskConical, Flashlight, Folder, Footprints, Fuel, Gamepad2, Gem, Ghost, Gift, GitBranch, Globe, GraduationCap, Grape, Guitar, Hammer, Hand, Hash, Heart, Helicopter, Hourglass, IceCream, Image, Infinity, Key, Knife, Lamp, Laptop, Leaf, LifeBuoy, Lightbulb, Link, Lock, Lollipop, Magnet, Map, Medal, Megaphone, Mic, Microscope, Milk, Moon, Mouse, Music, Nut, Package, Palmtree, Paperclip, ParkingCircle, Pencil, Percent, Phone, Pin, Pizza, Plane, Plug, Plus, Pocket, Podcast, Power, Puzzle, Quote, Rat, Recycle, Rocket, Rss, Ruler, Save, Scale, Scissors, ScreenShare, Search, Server, Settings, Shield, Ship, ShoppingBag, ShoppingCart, Siren, Snowflake, Soccer, Spade, Sparkles, Speaker, Star, Sticker, Store, Sun, Sword, Syringe, Tag, Target, Tent, TestTube, Ticket, ToyBrick, Train, Trash, TreePine, Trophy, Truck, Tv, Umbrella, Unlink, Usb, Utensils, Vault, Video, Volume2, Wallet, Wand, Watch, Waves, Wind, Wine, Wrench, Zap, ZoomIn, ZoomOut
];

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateCards = () => {
    const selectedIcons = shuffleArray([...allIcons]).slice(0, 8);
    const cardPairs = [...selectedIcons, ...selectedIcons].map((Icon, index) => ({
        id: index,
        icon: Icon,
        isFlipped: false,
        isMatched: false,
    }));
    return shuffleArray(cardPairs);
};

export function MemoryGame() {
    const [cards, setCards] = useState(generateCards);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const isGameWon = useMemo(() => cards.every(card => card.isMatched), [cards]);

    useEffect(() => {
        if (isGameWon) {
            setGameOver(true);
        }
    }, [isGameWon]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstIndex, secondIndex] = flippedCards;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.icon === secondCard.icon) {
                // Match
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.icon === firstCard.icon ? { ...card, isMatched: true } : card
                    )
                );
                setFlippedCards([]);
            } else {
                // No match
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map((card, index) =>
                            index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
                        )
                    );
                    setFlippedCards([]);
                }, 1000);
            }
            setMoves(m => m + 1);
        }
    }, [flippedCards, cards]);

    const handleCardClick = (index: number) => {
        if (flippedCards.length === 2 || cards[index].isFlipped) {
            return;
        }

        setCards(prevCards =>
            prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
        );
        setFlippedCards(prev => [...prev, index]);
    };

    const resetGame = () => {
        setCards(generateCards());
        setFlippedCards([]);
        setMoves(0);
        setGameOver(false);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full mb-4 text-sm text-muted-foreground">
                <span>Moves: {moves}</span>
            </div>
            <div className="memory-game-board">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.id} className="memory-card-container" onClick={() => handleCardClick(index)}>
                            <div className={cn("memory-card-inner", (card.isFlipped || card.isMatched) && "is-flipped")}>
                                <div className="memory-card-front">
                                    <Icon className="w-10 h-10 text-primary" />
                                </div>
                                <div className="memory-card-back">
                                    <Gamepad2 className="w-10 h-10 text-primary/50" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {gameOver && (
                <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold text-primary">You Won!</h3>
                    <p>You completed the game in {moves} moves.</p>
                </div>
            )}
            <Button onClick={resetGame} variant="secondary" className="mt-4">
                <RotateCw className="mr-2 h-4 w-4" />
                Reset Game
            </Button>
        </div>
    );
}
