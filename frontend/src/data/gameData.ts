import type { GameData, DungeonMap } from '../types';
import { characterClasses } from './classes';
import { craftingRecipes } from './crafting';
import { GAME_CONFIG } from './constants';

// Re-export everything for backward compatibility
export * from './abilities';
export * from './classes';
export * from './enemies';
export * from './crafting';
export * from './loot';
export * from './constants';

export const gameData: GameData = {
  party_system: {
    max_party_size: GAME_CONFIG.PARTY.MAX_SIZE,
    character_classes: characterClasses
  },
  craftingRecipes
};

// Deprecated: Use generated dungeon maps instead
export const dungeonMap: DungeonMap = {
  width: 20,
  height: 20,
  layout: [],
  floor: 1,
  playerStart: { x: 1, y: 1 },
  treasureLocations: []
};
