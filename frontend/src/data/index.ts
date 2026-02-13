import type { GameData } from '../types';
import { characterClasses } from './classes';
import { craftingRecipes } from './crafting';
import { gameConfig } from './constants';

export * from './abilities';
export * from './classes';
export * from './enemies';
export * from './crafting';
export * from './loot';
export * from './constants';

export const gameData: GameData = {
    party_system: {
        max_party_size: gameConfig.PARTY.MAX_SIZE,
        character_classes: characterClasses
    },
    craftingRecipes
};
