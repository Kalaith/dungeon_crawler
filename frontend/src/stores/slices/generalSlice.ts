import { gameData } from '../../data/gameData';
import type { GameSliceCreator, GeneralSlice } from './types';

export const createGeneralSlice: GameSliceCreator<GeneralSlice> = set => ({
  gameState: 'party-creation',

  setGameState: state => set({ gameState: state }),

  resetGame: () =>
    set({
      gameState: 'party-creation',
      party: Array(gameData.party_system.max_party_size).fill(null),
      currentFloor: 1,
      playerPosition: { x: 1, y: 1 },
      playerFacing: 0,
      exploredMap: new Set(['1,1']),
      stepCount: 0,
      inCombat: false,
      currentEnemy: null,
      combatTurnOrder: [],
      currentTurn: 0,
      combatLog: [],
    }),
});
