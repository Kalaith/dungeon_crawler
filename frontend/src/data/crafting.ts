import type { Item, CraftingRecipe } from '../types';

export const craftingMaterials: Record<string, Item> = {
    iron_ore: {
        id: 'iron_ore',
        name: 'Iron Ore',
        type: 'material',
        rarity: 'common',
        stats: {},
        value: 5,
        description: 'Raw iron ore, used for smithing.'
    },
    leather_scraps: {
        id: 'leather_scraps',
        name: 'Leather Scraps',
        type: 'material',
        rarity: 'common',
        stats: {},
        value: 4,
        description: 'Scraps of leather, used for armor.'
    },
    magic_dust: {
        id: 'magic_dust',
        name: 'Magic Dust',
        type: 'material',
        rarity: 'rare',
        stats: {},
        value: 15,
        description: 'Sparkling dust with magical properties.'
    },
    ancient_rune: {
        id: 'ancient_rune',
        name: 'Ancient Rune',
        type: 'material',
        rarity: 'epic',
        stats: {},
        value: 50,
        description: 'A stone carved with ancient power.'
    }
};

export const craftingRecipes: CraftingRecipe[] = [
    {
        id: 'craft_iron_sword',
        resultItem: {
            id: 'crafted_iron_sword',
            name: 'Reinforced Iron Sword',
            type: 'weapon',
            rarity: 'common',
            stats: { str: 5 },
            value: 35,
            description: 'A well-crafted iron sword.'
        },
        materials: [
            { materialId: 'iron_ore', count: 3 }
        ],
        goldCost: 20,
        levelReq: 1
    },
    {
        id: 'craft_leather_armor',
        resultItem: {
            id: 'crafted_leather_armor',
            name: 'Studded Leather',
            type: 'armor',
            rarity: 'common',
            stats: { def: 4, hp: 15 },
            value: 30,
            description: 'Leather armor reinforced with metal studs.'
        },
        materials: [
            { materialId: 'leather_scraps', count: 3 }
        ],
        goldCost: 20,
        levelReq: 1
    },
    {
        id: 'craft_steel_sword',
        resultItem: {
            id: 'crafted_steel_sword',
            name: 'Fine Steel Sword',
            type: 'weapon',
            rarity: 'rare',
            stats: { str: 8, agi: 3 },
            value: 100,
            description: 'A finely balanced steel sword.'
        },
        materials: [
            { materialId: 'iron_ore', count: 5 },
            { materialId: 'magic_dust', count: 1 }
        ],
        goldCost: 100,
        levelReq: 3
    },
    {
        id: 'craft_magic_wand',
        resultItem: {
            id: 'crafted_magic_wand',
            name: 'Apprentice Wand',
            type: 'weapon',
            rarity: 'rare',
            stats: { mp: 20, luc: 5 },
            value: 80,
            description: 'A wand that channels magical energy.'
        },
        materials: [
            { materialId: 'magic_dust', count: 3 },
            { materialId: 'iron_ore', count: 1 }
        ],
        goldCost: 50,
        levelReq: 2
    }
];
