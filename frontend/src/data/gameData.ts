import type { GameData, Enemy, DungeonMap, Ability, Item } from '../types';

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

export const gameData: GameData = {
  party_system: {
    max_party_size: 5,
    character_classes: [
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
    ]
  }
};

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
    }
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
    }
  ]
};

export const enemies: Enemy[] = [
  { name: "Goblin", level: 1, hp: 25, maxHp: 25, exp: 15, str: 8, def: 4, agi: 12 },
  { name: "Skeleton", level: 2, hp: 35, maxHp: 35, exp: 25, str: 10, def: 8, agi: 6 },
  { name: "Orc", level: 3, hp: 50, maxHp: 50, exp: 40, str: 15, def: 10, agi: 8 },
  { name: "Troll", level: 4, hp: 80, maxHp: 80, exp: 60, str: 20, def: 15, agi: 5 },
  { name: "Dark Mage", level: 5, hp: 65, maxHp: 65, exp: 75, str: 12, def: 8, agi: 15 }
];

export const dungeonMap: DungeonMap = {
  width: 20,
  height: 20,
  layout: [
    "####################",
    "#..................#",
    "#.####.......####..#",
    "#.#..#.......#..#..#",
    "#.#..+.......+..#..#",
    "#.####.......####..#",
    "#..................#",
    "#.......<..........#",
    "#..................#",
    "#.####.......####..#",
    "#.#..#.......#..#..#",
    "#.#..+.......+..#..#",
    "#.####.......####..#",
    "#..................#",
    "#..................#",
    "#.####.......####..#",
    "#.#$##.......##$#..#",
    "#..................#",
    "#.........>........#",
    "####################"
  ]
};