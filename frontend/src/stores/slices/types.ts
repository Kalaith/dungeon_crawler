import type { StateCreator } from 'zustand';
import type { Character, GameState, Position, Direction, Enemy, CombatParticipant, LootDrop, Item, DungeonMap, ActiveStatusEffect } from '../../types';

export interface GeneralSlice {
    gameState: GameState;
    setGameState: (state: GameState) => void;
    resetGame: () => void;
}

export interface DungeonSlice {
    currentFloor: number;
    playerPosition: Position;
    playerFacing: Direction;
    exploredMap: Set<string>;
    stepCount: number;
    currentDungeonMap: DungeonMap | null;

    setPlayerPosition: (position: Position) => void;
    setPlayerFacing: (direction: Direction) => void;
    addExploredTile: (x: number, y: number) => void;
    incrementStepCount: () => void;
    generateFloor: (floorNumber: number) => void;
    changeFloor: (direction: 'up' | 'down') => void;
}

export interface PartySlice {
    party: (Character | null)[];
    inventory: Item[];

    addCharacterToParty: (character: Character, slot: number) => void;
    removeCharacterFromParty: (slot: number) => void;
    addItemToInventory: (item: Item) => void;
    removeItemFromInventory: (itemId: string, count?: number) => void;
    equipItem: (characterIndex: number, item: Item) => void;
    craftItem: (recipeId: string) => boolean;
    getPartyMembers: () => Character[];
    getAlivePartyMembers: () => Character[];
    canStartAdventure: () => boolean;
    restParty: () => void;
    calculateExpToNext: (level: number) => number;
    generateLoot: (enemyLevel: number) => LootDrop;
    levelUpCharacter: (characterIndex: number) => boolean;
    addXpToParty: (amount: number) => void;
    addGoldToParty: (amount: number) => void;
    updatePartyMemberHP: (characterIndex: number, newHp: number) => void;
    applyStatusEffectToPartyMember: (characterIndex: number, effects: ActiveStatusEffect[]) => void;
    updatePartyMemberStatusEffects: (characterIndex: number, effects: ActiveStatusEffect[]) => void;
}

export interface CombatSlice {
    inCombat: boolean;
    currentEnemy: Enemy | null;
    combatTurnOrder: CombatParticipant[];
    currentTurn: number;
    combatLog: string[];

    startCombat: (enemy: Enemy) => void;
    endCombat: (victory: boolean, loot?: LootDrop) => void;
    addCombatLog: (message: string) => void;
    clearCombatLog: () => void;
    nextTurn: () => void;
    resetTurnOrder: () => void;
    useAbility: (characterIndex: number, abilityId: string, targetIndex?: number) => void;
    updateEnemyHP: (newHp: number) => void;
    applyStatusEffectToEnemy: (effects: ActiveStatusEffect[]) => void;
    updateEnemyStatusEffects: (effects: ActiveStatusEffect[]) => void;
}

export type GameStore = GeneralSlice & DungeonSlice & PartySlice & CombatSlice;

export type GameSliceCreator<T> = StateCreator<GameStore, [["zustand/persist", unknown]], [], T>;
