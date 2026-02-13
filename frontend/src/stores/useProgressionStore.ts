import { create } from 'zustand';
import { gameData } from '../data/gameData';
import { lootTables } from '../data/loot';
import { lootConfig } from '../data/constants';
import type { Item, LootDrop } from '../types';

interface ProgressionStore {
  // Actions
  generateLoot: (enemyLevel: number) => LootDrop;
  getRecipe: (
    recipeId: string
  ) => import('../types').CraftingRecipe | undefined;
}

export const useProgressionStore = create<ProgressionStore>(() => ({
  generateLoot: enemyLevel => {
    const {
      BASE_GOLD_MIN: baseGoldMin,
      GOLD_LEVEL_MULTIPLIER: goldLevelMultiplier,
      COMMON_DROP_CHANCE: commonDropChance,
      RARE_DROP_CHANCE: rareDropChance,
    } = lootConfig;

    const gold =
      Math.floor(Math.random() * (lootConfig.BASE_GOLD_MAX - baseGoldMin)) +
      baseGoldMin +
      enemyLevel * goldLevelMultiplier;
    const items: Item[] = [];

    const roll = Math.random();
    if (roll < commonDropChance) {
      const commonItems = lootTables.common;
      if (commonItems && commonItems.length > 0) {
        items.push(commonItems[Math.floor(Math.random() * commonItems.length)]);
      }
    } else if (roll < commonDropChance + rareDropChance) {
      const rareItems = lootTables.rare;
      if (rareItems && rareItems.length > 0) {
        items.push(rareItems[Math.floor(Math.random() * rareItems.length)]);
      }
    }

    return { gold, items, chance: 1 };
  },

  getRecipe: recipeId => {
    return gameData.craftingRecipes?.find(r => r.id === recipeId);
  },
}));
