import type { Enemy } from '../types';

export type FOEMovementPattern = 'static' | 'patrol' | 'chase' | 'random';

export interface FOE extends Enemy {
    isFoe: true;
    movementPattern: FOEMovementPattern;
    detectionRange: number; // Tiles
    color: string; // For minimap/view
}

export const foeData: Record<string, Omit<FOE, 'id' | 'hp' | 'maxHp' | 'statusEffects'>> = {
    'ragelope': {
        name: 'Ragelope',
        level: 5,
        attributes: { ST: 16, CO: 14, DX: 12, AG: 12, IT: 3, IN: 10, WD: 10, CH: 5 }, // Fixed to match Attributes interface
        derivedStats: {
            HP: { current: 60, max: 60 },
            AP: { current: 0, max: 0 },
            Initiative: 12,
            Movement: 30,
            AC: 14,
            Proficiency: 2
        },
        xpReward: 500,
        lootTable: [ // Fixed from drops to lootTable
            { items: [], gold: 0, chance: 1.0 } // Placeholder, need to fix LootDrop structure
        ],
        isFoe: true,
        movementPattern: 'patrol',
        detectionRange: 3,
        color: '#FF4500' // OrangeRed
    },
    'stalker_beetle': {
        name: 'Stalker Beetle',
        level: 8,
        attributes: { ST: 18, CO: 16, DX: 10, AG: 10, IT: 2, IN: 8, WD: 8, CH: 2 },
        derivedStats: {
            HP: { current: 120, max: 120 },
            AP: { current: 0, max: 0 },
            Initiative: 10,
            Movement: 30,
            AC: 18,
            Proficiency: 3
        },
        xpReward: 1200,
        lootTable: [
            { items: [], gold: 0, chance: 1.0 }
        ],
        isFoe: true,
        movementPattern: 'chase',
        detectionRange: 4,
        color: '#8B0000' // DarkRed
    }
};

export const getFoeDefinition = (key: string): FOE => {
    const def = foeData[key];
    if (!def) throw new Error(`FOE definition not found: ${key}`);

    return {
        ...def,
        id: `foe_${key}_${Math.random().toString(36).substr(2, 9)}`,
        hp: def.derivedStats.HP.max,
        maxHp: def.derivedStats.HP.max,
        statusEffects: []
    };
};
