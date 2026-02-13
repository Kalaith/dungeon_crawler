import type { Item, CraftingRecipe } from '../types';

export const craftingMaterials = {
  iron_ore: {
    id: 'iron_ore',
    name: 'Iron Ore',
    type: 'material',
    rarity: 'common',
    stats: {},
    value: 5,
    description: 'Raw iron ore, used for smithing.',
  } as Item,
  leather_scraps: {
    id: 'leather_scraps',
    name: 'Leather Scraps',
    type: 'material',
    rarity: 'common',
    stats: {},
    value: 4,
    description: 'Scraps of leather, used for armor.',
  } as Item,
  magic_dust: {
    id: 'magic_dust',
    name: 'Magic Dust',
    type: 'material',
    rarity: 'rare',
    stats: {},
    value: 15,
    description: 'Sparkling dust with magical properties.',
  } as Item,
  ancient_rune: {
    id: 'ancient_rune',
    name: 'Ancient Rune',
    type: 'material',
    rarity: 'epic',
    stats: {},
    value: 50,
    description: 'A stone carved with ancient power.',
  } as Item,
};

export const craftingRecipes: CraftingRecipe[] = [
  {
    id: 'craft_iron_sword',
    resultItem: {
      id: 'crafted_iron_sword',
      name: 'Reinforced Iron Sword',
      type: 'weapon',
      rarity: 'common',
      stats: { ST: 5 },
      value: 35,
      description: 'A well-crafted iron sword.',
    },
    materials: [{ materialId: 'iron_ore', count: 3 }],
    goldCost: 20,
    levelReq: 1,
  },
  {
    id: 'craft_leather_armor',
    resultItem: {
      id: 'crafted_leather_armor',
      name: 'Studded Leather',
      type: 'armor',
      rarity: 'common',
      stats: { AC: 4, HP: 15 },
      value: 30,
      description: 'Leather armor reinforced with metal studs.',
    },
    materials: [{ materialId: 'leather_scraps', count: 3 }],
    goldCost: 20,
    levelReq: 1,
  },
  {
    id: 'craft_steel_sword',
    resultItem: {
      id: 'crafted_steel_sword',
      name: 'Fine Steel Sword',
      type: 'weapon',
      rarity: 'rare',
      stats: { ST: 8, AG: 3 },
      value: 100,
      description: 'A finely balanced steel sword.',
    },
    materials: [
      { materialId: 'iron_ore', count: 5 },
      { materialId: 'magic_dust', count: 1 },
    ],
    goldCost: 100,
    levelReq: 3,
  },
  {
    id: 'craft_magic_wand',
    resultItem: {
      id: 'crafted_magic_wand',
      name: 'Apprentice Wand',
      type: 'weapon',
      rarity: 'rare',
      stats: { AP: 20, CH: 5 },
      value: 80,
      description: 'A wand that channels magical energy.',
    },
    materials: [
      { materialId: 'magic_dust', count: 3 },
      { materialId: 'iron_ore', count: 1 },
    ],
    goldCost: 50,
    levelReq: 2,
  },
];
