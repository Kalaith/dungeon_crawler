import type { Ability, Enemy } from '../types';

export const enemyAbilities: Record<string, Ability> = {
    goblin_stab: {
        id: 'goblin_stab',
        name: 'Vicious Stab',
        description: 'A quick stabbing attack',
        mpCost: 0,
        damage: 1.3,
        target: 'enemy',
        unlockLevel: 1
    },
    skeleton_bone_throw: {
        id: 'skeleton_bone_throw',
        name: 'Bone Throw',
        description: 'Throws a bone at the enemy, inflicting poison',
        mpCost: 0,
        damage: 1.2,
        target: 'enemy',
        effect: { type: 'poison', duration: 3, value: 3 },
        unlockLevel: 1
    },
    orc_smash: {
        id: 'orc_smash',
        name: 'Brutal Smash',
        description: 'A devastating overhead smash',
        mpCost: 0,
        damage: 1.6,
        target: 'enemy',
        unlockLevel: 1
    },
    troll_regenerate: {
        id: 'troll_regenerate',
        name: 'Regenerate',
        description: 'Heals some HP',
        mpCost: 0,
        heal: 15,
        target: 'self',
        unlockLevel: 1
    },
    dark_mage_shadow_bolt: {
        id: 'dark_mage_shadow_bolt',
        name: 'Shadow Bolt',
        description: 'Fires a bolt of dark energy',
        mpCost: 0,
        damage: 2.0,
        target: 'enemy',
        unlockLevel: 1
    }
};

export const enemies: Enemy[] = [
    {
        name: "Goblin",
        level: 1,
        hp: 25,
        maxHp: 25,
        exp: 15,
        str: 8,
        def: 4,
        agi: 12,
        abilities: [enemyAbilities.goblin_stab],
        statusEffects: []
    },
    {
        name: "Skeleton",
        level: 2,
        hp: 35,
        maxHp: 35,
        exp: 25,
        str: 10,
        def: 8,
        agi: 6,
        abilities: [enemyAbilities.skeleton_bone_throw],
        statusEffects: []
    },
    {
        name: "Orc",
        level: 3,
        hp: 50,
        maxHp: 50,
        exp: 40,
        str: 15,
        def: 10,
        agi: 8,
        abilities: [enemyAbilities.orc_smash],
        statusEffects: []
    },
    {
        name: "Troll",
        level: 4,
        hp: 80,
        maxHp: 80,
        exp: 60,
        str: 20,
        def: 15,
        agi: 5,
        abilities: [enemyAbilities.troll_regenerate],
        statusEffects: []
    },
    {
        name: "Dark Mage",
        level: 5,
        hp: 65,
        maxHp: 65,
        exp: 75,
        str: 12,
        def: 8,
        agi: 15,
        abilities: [enemyAbilities.dark_mage_shadow_bolt],
        statusEffects: []
    }
];
