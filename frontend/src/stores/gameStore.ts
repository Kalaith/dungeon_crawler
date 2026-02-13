import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStore } from './slices/types';
import { createGeneralSlice } from './slices/generalSlice';
import { createDungeonSlice } from './slices/dungeonSlice';
import { createPartySlice } from './slices/partySlice';
import { createCombatSlice } from './slices/combatSlice';

export const useGameStore = create<GameStore>()(
  persist(
    (...a) => ({
      ...createGeneralSlice(...a),
      ...createDungeonSlice(...a),
      ...createPartySlice(...a),
      ...createCombatSlice(...a),
    }),
    {
      name: 'dungeon-crawler-game',
      partialize: state => ({
        party: state.party,
        inventory: state.inventory,
        currentFloor: state.currentFloor,
        playerPosition: state.playerPosition,
        playerFacing: state.playerFacing,
        exploredMap: Array.from(state.exploredMap),
        stepCount: state.stepCount,
        gameState: state.gameState,
      }),
      merge: (persistedState: unknown, currentState) => {
        const state = persistedState as Partial<GameStore> | null;
        return {
          ...currentState,
          ...(state || {}),
          exploredMap: new Set(state?.exploredMap || ['1,1']),
        };
      },
    }
  )
);
