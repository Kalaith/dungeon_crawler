import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Button } from '../ui/Button';

export const GameOverScreen: React.FC = () => {
    const { resetGame } = useGameStore();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-dungeon-900 text-parchment-100 p-8">
            <div className="max-w-md w-full bg-stone-700 border-4 border-stone-500 p-8 rounded-sm shadow-2xl text-center">
                <h1 className="text-4xl font-bold text-blood-500 mb-6 tracking-widest uppercase" style={{ textShadow: '2px 2px 0 #000' }}>
                    Game Over
                </h1>

                <p className="text-lg mb-8 text-parchment-300">
                    Your party has fallen in the depths of the dungeon. Their story ends here...
                </p>

                <Button
                    onClick={resetGame}
                    className="w-full py-4 text-lg font-bold bg-stone-600 border-2 border-gold-600 text-gold-500 hover:bg-stone-500 hover:text-gold-400 transition-colors"
                >
                    Start New Adventure
                </Button>
            </div>
        </div>
    );
};
