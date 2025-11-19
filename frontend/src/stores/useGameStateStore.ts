import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState } from '../types';

interface GameStateStore {
    gameState: GameState;
    setGameState: (state: GameState) => void;
    resetGame: () => void;
}

export const useGameStateStore = create<GameStateStore>()(
    persist(
        (set) => ({
            gameState: 'party-creation',
            setGameState: (state) => set({ gameState: state }),
            resetGame: () => set({ gameState: 'party-creation' })
        }),
        {
            name: 'dungeon-crawler-game-state',
        }
    )
);
