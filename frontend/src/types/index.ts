export interface Character {
  name: string;
  class: CharacterClass;
  level: number;
  exp: number;
  expToNext: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  str: number;
  def: number;
  agi: number;
  luc: number;
  alive: boolean;
  gold: number;
  equipment: Equipment;
  abilities: Ability[];
  statusEffects: ActiveStatusEffect[];
}

export interface CharacterClass {
  name: string;
  description: string;
  base_stats: {
    hp: number;
    mp: number;
    str: number;
    def: number;
    agi: number;
    luc: number;
  };
  stat_growth: {
    hp: number;
    mp: number;
    str: number;
    def: number;
    agi: number;
    luc: number;
  };
  abilities: Ability[];
}

export interface Enemy {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  exp: number;
  str: number;
  def: number;
  agi: number;
  abilities?: Ability[];
  statusEffects: ActiveStatusEffect[];
}

export interface Position {
  x: number;
  y: number;
}

export interface CombatParticipant {
  type: 'party' | 'enemy';
  character: Character | Enemy;
  index?: number;
  agi: number;
}

export interface GameData {
  party_system: {
    max_party_size: number;
    character_classes: CharacterClass[];
  };
  craftingRecipes?: CraftingRecipe[];
}

export type GameState = 'party-creation' | 'exploring' | 'combat' | 'game-over';
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
}

export interface Equipment {
  weapon?: Item;
  armor?: Item;
  accessory?: Item;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: Partial<{
    str: number;
    def: number;
    agi: number;
    luc: number;
    hp: number;
    mp: number;
  }>;
  value: number;
  description: string;
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
  mpCost: number;
  damage?: number;
  heal?: number;
  target: 'self' | 'ally' | 'enemy' | 'all_enemies' | 'all_allies';
  effect?: StatusEffect;
  unlockLevel: number;
}

export interface StatusEffect {
  type: 'poison' | 'sleep' | 'buff_str' | 'buff_def' | 'buff_agi';
  duration: number;
  value?: number;
}

export interface ActiveStatusEffect extends StatusEffect {
  remainingTurns: number;
}

export interface LootDrop {
  gold: number;
  items: Item[];
}