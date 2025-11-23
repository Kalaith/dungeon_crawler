import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState } from '../types';

interface GameStateStore {
    gameState: GameState;
    godMode: boolean;
    setGameState: (state: GameState) => void;
    toggleGodMode: () => void;
    resetGame: () => void;
}

export const useGameStateStore = create<GameStateStore>()(
    persist(
        (set) => ({
            gameState: 'party-creation',
            godMode: false,
            setGameState: (state) => set({ gameState: state }),
            toggleGodMode: () => set((state) => ({ godMode: !state.godMode })),
            resetGame: () => set({ gameState: 'party-creation', godMode: false })
        }),
        {
            name: 'dungeon-crawler-game-state',
        }
    )
);
