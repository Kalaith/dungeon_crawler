import type { Item } from '../types';
import { craftingMaterials } from './crafting';

export const lootTables: Record<string, Item[]> = {
    common: [
        {
            id: 'iron_sword',
            name: 'Iron Sword',
            type: 'weapon',
            rarity: 'common',
            stats: { str: 3 },
            value: 25,
            description: 'A sturdy iron sword'
        },
        {
            id: 'leather_armor',
            name: 'Leather Armor',
            type: 'armor',
            rarity: 'common',
            stats: { def: 2, hp: 10 },
            value: 20,
            description: 'Basic leather protection'
        },
        {
            id: 'health_potion',
            name: 'Health Potion',
            type: 'consumable',
            rarity: 'common',
            stats: {},
            value: 10,
            description: 'Restores 30 HP'
        },
        craftingMaterials.iron_ore,
        craftingMaterials.leather_scraps
    ],
    rare: [
        {
            id: 'steel_sword',
            name: 'Steel Sword',
            type: 'weapon',
            rarity: 'rare',
            stats: { str: 6, agi: 2 },
            value: 75,
            description: 'A sharp steel blade'
        },
        {
            id: 'chain_mail',
            name: 'Chain Mail',
            type: 'armor',
            rarity: 'rare',
            stats: { def: 5, hp: 20 },
            value: 60,
            description: 'Interlocked metal rings'
        },
        craftingMaterials.magic_dust
    ]
};
