import type { Ability } from '../types';

export const abilities: Record<string, Ability> = {
    // Fighter abilities
    power_attack: {
        id: 'power_attack',
        name: 'Power Attack',
        description: 'A devastating melee attack that deals extra damage',
        mpCost: 5,
        damage: 1.5,
        target: 'enemy',
        unlockLevel: 1
    },
    defend: {
        id: 'defend',
        name: 'Defend',
        description: 'Increases defense for 3 turns',
        mpCost: 3,
        target: 'self',
        effect: { type: 'buff_def', duration: 3, value: 5 },
        unlockLevel: 2
    },

    // Mage abilities
    fireball: {
        id: 'fireball',
        name: 'Fireball',
        description: 'Launches a fireball at an enemy',
        mpCost: 8,
        damage: 2.0,
        target: 'enemy',
        unlockLevel: 1
    },
    ice_shard: {
        id: 'ice_shard',
        name: 'Ice Shard',
        description: 'Freezes enemy with chance to skip their turn',
        mpCost: 6,
        damage: 1.2,
        target: 'enemy',
        effect: { type: 'sleep', duration: 1 },
        unlockLevel: 3
    },

    // Cleric abilities
    heal: {
        id: 'heal',
        name: 'Heal',
        description: 'Restores HP to an ally',
        mpCost: 4,
        heal: 30,
        target: 'ally',
        unlockLevel: 1
    },
    group_heal: {
        id: 'group_heal',
        name: 'Group Heal',
        description: 'Restores HP to all allies',
        mpCost: 12,
        heal: 20,
        target: 'all_allies',
        unlockLevel: 4
    },

    // Rogue abilities
    backstab: {
        id: 'backstab',
        name: 'Backstab',
        description: 'Critical strike with high damage',
        mpCost: 6,
        damage: 2.2,
        target: 'enemy',
        unlockLevel: 1
    },
    poison_blade: {
        id: 'poison_blade',
        name: 'Poison Blade',
        description: 'Attack that inflicts poison damage over time',
        mpCost: 8,
        damage: 1.3,
        target: 'enemy',
        effect: { type: 'poison', duration: 3, value: 5 },
        unlockLevel: 3
    },

    // Archer abilities
    aimed_shot: {
        id: 'aimed_shot',
        name: 'Aimed Shot',
        description: 'Precise shot with increased accuracy and damage',
        mpCost: 5,
        damage: 1.8,
        target: 'enemy',
        unlockLevel: 1
    },
    multi_shot: {
        id: 'multi_shot',
        name: 'Multi Shot',
        description: 'Attacks all enemies with reduced damage',
        mpCost: 10,
        damage: 1.2,
        target: 'all_enemies',
        unlockLevel: 4
    }
};
