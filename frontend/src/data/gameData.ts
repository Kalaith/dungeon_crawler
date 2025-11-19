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

export const craftingRecipes: import('../types').CraftingRecipe[] = [
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

// Deprecated: Use generated dungeon maps instead
export const dungeonMap: DungeonMap = {
  width: 20,
  height: 20,
  layout: [],
  floor: 1,
  playerStart: { x: 1, y: 1 },
  treasureLocations: []
};

// Enemy abilities
const enemyAbilities: Record<string, Ability> = {
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
