export type Attribute = 'ST' | 'CO' | 'DX' | 'AG' | 'IT' | 'IN' | 'WD' | 'CH';
export type NegativeAttribute = 'SN' | 'AC' | 'CL' | 'AV' | 'NE' | 'CU' | 'VT';

export interface Attributes {
  ST: number; // Strength
  CO: number; // Constitution
  DX: number; // Dexterity
  AG: number; // Agility
  IT: number; // Intelligence
  IN: number; // Intuition
  WD: number; // Wisdom
  CH: number; // Charisma
}

export interface NegativeAttributes {
  SN: number; // Superstition
  AC: number; // Acrophobia
  CL: number; // Claustrophobia
  AV: number; // Avarice
  NE: number; // Necrophobia
  CU: number; // Curiosity
  VT: number; // Violent Temper
}

export interface DerivedStats {
  HP: { current: number; max: number }; // Health Points
  AP: { current: number; max: number }; // Astral Points (Magic)
  Initiative: number;
  AC: number; // Armor Class
  Proficiency: number;
  Movement: number;
}

export interface Character {
  id: string;
  name: string;
  race: Race;
  class: CharacterClass;
  level: number;
  exp: number;
  expToNext: number;
  attributes: Attributes;
  negativeAttributes: NegativeAttributes;
  derivedStats: DerivedStats;
  skills: CharacterSkill[];
  feats: Feat[];
  equipment: Equipment;
  inventory: Item[];
  spells: Spell[]; // For casters
  gold: number;
  alive: boolean;
  statusEffects: ActiveStatusEffect[];
  position: { row: 'front' | 'back'; index: number }; // Combat position
  concentratingOn?: string; // Spell ID if concentrating
  portrait?: string;
  deity?: string;
  background?: string;
}

export interface Race {
  id: string;
  name: string;
  description: string;
  attributeModifiers: Partial<Attributes>;
  abilities: Ability[];
  movementRate: number;
  isNpcOnly?: boolean;
}

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  baseStats: {
    HP: number;
    AP: number;
  };
  growthRates: {
    HP: number; // Dice size (e.g., 8 for d8)
    AP: number; // Dice size
  };
  primaryAttributes: Attribute[];
  proficiencies: {
    armor: string[];
    weapons: string[];
    savingThrows: Attribute[];
  };
  abilities: ClassAbility[];
  spellcasting?: {
    ability: Attribute;
    type: 'prepared' | 'known';
  };
  startingEquipment: string[];
}

export interface ClassAbility {
  id: string;
  name: string;
  description: string;
  level: number;
  type: 'passive' | 'active';
  cost?: {
    AP?: number;
    HP?: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  attribute: Attribute; // Primary attribute
  attribute2?: Attribute; // Secondary attribute (if applicable)
  category: 'Combat' | 'Physical' | 'Social' | 'Nature' | 'Lore' | 'Craftsmanship';
  description: string;
}

export interface CharacterSkill extends Skill {
  value: number; // The skill level/rating
}

export interface Feat {
  id: string;
  name: string;
  description: string;
  prerequisites?: {
    level?: number;
    attributes?: Partial<Attributes>;
    feats?: string[];
  };
  effects: any; // Define specific effects structure later
}

export interface Spell {
  name: string;
  level: number; // 0 = Cantrip, 1-9 = Spell levels
  school: string; // Evocation, Conjuration, Transmutation, etc.
  casting_time: string;
  range: string; // Self, Touch, Close, Far
  duration: string;
  concentration: boolean;
  ritual: boolean;
  ap_cost: number;
  combat_usable: boolean;
  description: string;
  classes: string[]; // Which classes can learn this spell

  // Optional fields
  higher_level?: string; // Description of effects at higher levels
  damage_type?: string; // Fire, Cold, Lightning, etc.
  damage_dice?: Record<string, string>; // Level -> dice formula (e.g., "1": "3d6", "2": "4d6")
  heal_dice?: Record<string, string>; // Level -> heal amount
  save_type?: string; // DEX, CON, WIS, INT, CHA, STR
  attack_type?: 'melee' | 'ranged';
  aoe?: string; // Area of effect (e.g., "20 sphere", "15 cone")
  material_cost?: string; // Material component cost if any
}

// --- Existing interfaces adapted or kept ---

export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attributes: Attributes;
  derivedStats: {
    AC: number;
    Initiative: number;
  };
  abilities?: Ability[];
  statusEffects: ActiveStatusEffect[];
  expReward: number;
  lootTable: LootDrop[];
}

export interface Position {
  x: number;
  y: number;
}

export interface CombatParticipant {
  id: string;
  type: 'party' | 'enemy';
  character?: Character;
  enemy?: Enemy;
  initiative: number;
  status: 'active' | 'defeated' | 'fled';
}

export interface GameData {
  party: Character[];
  dungeon: DungeonMap;
  gameState: GameState;
}

export interface StaticGameData {
  party_system: {
    max_party_size: number;
    character_classes: CharacterClass[];
  };
  craftingRecipes: CraftingRecipe[];
}

export type GameState = 'party-creation' | 'overworld' | 'town' | 'dungeon' | 'combat' | 'game-over';
export type Direction = 0 | 1 | 2 | 3; // North, East, South, West

export interface DungeonMap {
  width: number;
  height: number;
  layout: string[];
  floor: number;
  playerStart: Position;
  stairsUp?: Position;
  stairsDown?: Position;
  treasureLocations: Position[];
  explored: boolean[][]; // For automap
}

export interface Equipment {
  mainHand?: Item;
  offHand?: Item;
  armor?: Item;
  head?: Item;
  accessory1?: Item;
  accessory2?: Item;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'key';
  category?: 'weapons' | 'armor' | 'potions' | 'items'; // For shop categorization
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats?: Partial<Attributes & { HP: number; AP: number; AC: number }>;
  value: number;
  description: string;
  stackable?: boolean;
  quantity?: number;
  icon?: string; // For UI display
}

export interface CraftingMaterial extends Item {
  type: 'material';
}

export interface CraftingRecipe {
  id: string;
  resultItem: Item;
  materials: {
    materialId: string;
    count: number;
  }[];
  goldCost: number;
  levelReq: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  mpCost?: number; // Legacy, use AP
  apCost?: number;
  damage?: string | number; // Dice notation e.g. "1d6" or multiplier e.g. 1.5
  heal?: string;
  target: 'self' | 'ally' | 'enemy' | 'all_enemies' | 'all_allies';
  effect?: StatusEffect;
  unlockLevel: number;
}

export interface StatusEffect {
  type: 'poison' | 'sleep' | 'stun' | 'buff' | 'debuff' | 'buff_str' | 'buff_def' | 'buff_agi' | 'buff_int' | 'buff_wis' | 'buff_cha';
  attribute?: Attribute;
  value?: number;
  duration: number; // Turns
}

export interface ActiveStatusEffect extends StatusEffect {
  remainingTurns: number;
}

export interface LootDrop {
  gold: number;
  items: Item[];
  chance: number; // 0-1
}