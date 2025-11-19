import { create } from 'zustand';
import { gameData } from '../data/gameData';
import { lootTables } from '../data/loot';
import { GAME_CONFIG, LOOT_CONFIG } from '../data/constants';
import type { Item, LootDrop } from '../types';

interface ProgressionStore {
    // Actions
    generateLoot: (enemyLevel: number) => LootDrop;
    getRecipe: (recipeId: string) => import('../types').CraftingRecipe | undefined;
}

export const useProgressionStore = create<ProgressionStore>((set, get) => ({

    generateLoot: (enemyLevel) => {
        const { BASE_GOLD_MIN, GOLD_LEVEL_MULTIPLIER, COMMON_DROP_CHANCE, RARE_DROP_CHANCE } = LOOT_CONFIG;

        const gold = Math.floor(Math.random() * (LOOT_CONFIG.BASE_GOLD_MAX - BASE_GOLD_MIN)) + BASE_GOLD_MIN + (enemyLevel * GOLD_LEVEL_MULTIPLIER);
        const items: Item[] = [];

        const roll = Math.random();
        if (roll < COMMON_DROP_CHANCE) {
            const commonItems = lootTables.common;
            if (commonItems && commonItems.length > 0) {
                items.push(commonItems[Math.floor(Math.random() * commonItems.length)]);
            }
        } else if (roll < COMMON_DROP_CHANCE + RARE_DROP_CHANCE) {
            const rareItems = lootTables.rare;
            if (rareItems && rareItems.length > 0) {
                items.push(rareItems[Math.floor(Math.random() * rareItems.length)]);
            }
        }

        return { gold, items };
    },

    getRecipe: (recipeId) => {
        return gameData.craftingRecipes?.find(r => r.id === recipeId);
    }
}));
