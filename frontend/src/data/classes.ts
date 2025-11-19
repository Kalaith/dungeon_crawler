import type { CharacterClass } from '../types';
import { abilities } from './abilities';

export const characterClasses: CharacterClass[] = [
    {
        name: "Fighter",
        description: "Melee combat specialist with high HP and defense",
        base_stats: { hp: 100, mp: 20, str: 15, def: 12, agi: 8, luc: 5 },
        stat_growth: { hp: 8, mp: 2, str: 3, def: 2, agi: 1, luc: 1 },
        abilities: [abilities.power_attack, abilities.defend]
    },
    {
        name: "Mage",
        description: "Magic user with powerful spells but low defense",
        base_stats: { hp: 60, mp: 80, str: 6, def: 5, agi: 10, luc: 12 },
        stat_growth: { hp: 3, mp: 6, str: 1, def: 1, agi: 2, luc: 2 },
        abilities: [abilities.fireball, abilities.ice_shard]
    },
    {
        name: "Cleric",
        description: "Healer and support specialist",
        base_stats: { hp: 80, mp: 60, str: 8, def: 8, agi: 9, luc: 10 },
        stat_growth: { hp: 5, mp: 4, str: 1, def: 2, agi: 1, luc: 2 },
        abilities: [abilities.heal, abilities.group_heal]
    },
    {
        name: "Rogue",
        description: "Fast attacker with high critical hit chance",
        base_stats: { hp: 70, mp: 40, str: 12, def: 7, agi: 16, luc: 15 },
        stat_growth: { hp: 4, mp: 3, str: 2, def: 1, agi: 3, luc: 2 },
        abilities: [abilities.backstab, abilities.poison_blade]
    },
    {
        name: "Archer",
        description: "Ranged attacker effective from back row",
        base_stats: { hp: 75, mp: 30, str: 11, def: 6, agi: 14, luc: 8 },
        stat_growth: { hp: 4, mp: 2, str: 2, def: 1, agi: 3, luc: 1 },
        abilities: [abilities.aimed_shot, abilities.multi_shot]
    }
];
