import { create } from 'zustand';
import type { Enemy, CombatParticipant, ActiveStatusEffect } from '../types';
import { gameConfig } from '../data/constants';
import { useGameStateStore } from './useGameStateStore';

interface ActionEconomy {
  actionUsed: boolean;
  bonusActionUsed: boolean;
  movementUsed: boolean;
  reactionUsed: boolean;
}

interface CombatStore {
  inCombat: boolean;
  currentEnemy: Enemy | null;
  combatTurnOrder: CombatParticipant[];
  currentTurn: number;
  combatLog: string[];

  // Action Economy
  currentActionEconomy: ActionEconomy;

  // Concentration Tracking
  concentratingCharacterId: string | null;
  concentrationSpellId: string | null;

  // Actions
  startCombat: (enemy: Enemy, partyMembers: CombatParticipant[]) => void;
  endCombat: () => void;
  addCombatLog: (message: string) => void;
  clearCombatLog: () => void;
  nextTurn: () => void;
  resetTurnOrder: (partyParticipants: CombatParticipant[]) => void;
  updateEnemyHP: (newHp: number) => void;
  updateEnemyStatusEffects: (effects: ActiveStatusEffect[]) => void;
  resetCombat: () => void;

  // Action Economy Methods
  useAction: () => void;
  useBonusAction: () => void;
  useMovement: () => void;
  useReaction: () => void;
  resetActionEconomy: () => void;

  // Concentration Methods
  setConcentration: (characterId: string, spellId: string) => void;
  breakConcentration: () => void;
  checkConcentration: (damage: number) => boolean;

  // Victory State
  victoryData: VictoryData | null;
  setVictoryData: (data: VictoryData | null) => void;
}

export interface VictoryData {
  exp: number;
  gold: number;
  items: import('../types').Item[];
  levelUps: { characterId: string; name: string; levelsGained: number }[];
}

export const useCombatStore = create<CombatStore>((set, get) => ({
  inCombat: false,
  currentEnemy: null,
  combatTurnOrder: [],
  currentTurn: 0,
  combatLog: [],
  victoryData: null,

  // Action Economy State
  currentActionEconomy: {
    actionUsed: false,
    bonusActionUsed: false,
    movementUsed: false,
    reactionUsed: false,
  },

  // Concentration State
  concentratingCharacterId: null,
  concentrationSpellId: null,

  startCombat: (enemy, participants) => {
    // Create enemy participant
    const enemyParticipant: CombatParticipant = {
      id: enemy.id,
      type: 'enemy',
      enemy: enemy,
      initiative:
        enemy.derivedStats.Initiative + Math.floor(Math.random() * 20) + 1, // d20 + Init
      status: 'active',
    };

    // Combine and sort by initiative
    const allParticipants = [...participants, enemyParticipant];
    const sortedParticipants = allParticipants.sort(
      (a, b) => b.initiative - a.initiative
    );

    set({
      inCombat: true,
      currentEnemy: { ...enemy, hp: enemy.maxHp },
      combatTurnOrder: sortedParticipants,
      currentTurn: 0,
      combatLog: [`Combat started with ${enemy.name}!`],
      victoryData: null,
    });

    // Set game state to combat to show UI
    useGameStateStore.getState().setGameState('combat');
  },

  endCombat: () => {
    set({
      inCombat: false,
      currentEnemy: null,
      combatTurnOrder: [],
      currentTurn: 0,
      victoryData: null,
    });

    // Return to dungeon view
    useGameStateStore.getState().setGameState('dungeon');
  },

  addCombatLog: message =>
    set(state => {
      const newLog = [...state.combatLog, message];
      if (newLog.length > gameConfig.COMBAT.MAX_COMBAT_LOG_ENTRIES) {
        newLog.shift();
      }
      return { combatLog: newLog };
    }),

  clearCombatLog: () => set({ combatLog: [] }),

  nextTurn: () =>
    set(state => {
      const nextTurnIndex =
        (state.currentTurn + 1) % state.combatTurnOrder.length;
      return {
        currentTurn: nextTurnIndex,
        // Reset action economy for new turn
        currentActionEconomy: {
          actionUsed: false,
          bonusActionUsed: false,
          movementUsed: false,
          reactionUsed: false,
        },
      };
    }),

  resetTurnOrder: participants => {
    const sortedParticipants = [...participants].sort(
      (a, b) => b.initiative - a.initiative
    );
    set({ combatTurnOrder: sortedParticipants, currentTurn: 0 });
  },

  updateEnemyHP: newHp =>
    set(state => {
      if (state.currentEnemy) {
        return {
          currentEnemy: {
            ...state.currentEnemy,
            hp: Math.max(0, Math.min(state.currentEnemy.maxHp, newHp)),
          },
        };
      }
      return state;
    }),

  updateEnemyStatusEffects: effects =>
    set(state => {
      if (state.currentEnemy) {
        return {
          currentEnemy: {
            ...state.currentEnemy,
            statusEffects: effects,
          },
        };
      }
      return state;
    }),

  resetCombat: () =>
    set({
      inCombat: false,
      currentEnemy: null,
      combatTurnOrder: [],
      currentTurn: 0,
      combatLog: [],
      victoryData: null,
      currentActionEconomy: {
        actionUsed: false,
        bonusActionUsed: false,
        movementUsed: false,
        reactionUsed: false,
      },
      concentratingCharacterId: null,
      concentrationSpellId: null,
    }),

  setVictoryData: data => set({ victoryData: data }),

  // Action Economy Methods
  useAction: () =>
    set(state => ({
      currentActionEconomy: { ...state.currentActionEconomy, actionUsed: true },
    })),

  useBonusAction: () =>
    set(state => ({
      currentActionEconomy: {
        ...state.currentActionEconomy,
        bonusActionUsed: true,
      },
    })),

  useMovement: () =>
    set(state => ({
      currentActionEconomy: {
        ...state.currentActionEconomy,
        movementUsed: true,
      },
    })),

  useReaction: () =>
    set(state => ({
      currentActionEconomy: {
        ...state.currentActionEconomy,
        reactionUsed: true,
      },
    })),

  resetActionEconomy: () =>
    set({
      currentActionEconomy: {
        actionUsed: false,
        bonusActionUsed: false,
        movementUsed: false,
        reactionUsed: false,
      },
    }),

  // Concentration Methods
  setConcentration: (characterId, spellId) => {
    const state = get();
    // Break previous concentration if exists
    if (state.concentratingCharacterId) {
      get().addCombatLog(`Concentration broken on previous spell`);
    }
    set({
      concentratingCharacterId: characterId,
      concentrationSpellId: spellId,
    });
  },

  breakConcentration: () => {
    const state = get();
    if (state.concentratingCharacterId) {
      get().addCombatLog(`Concentration broken!`);
      set({
        concentratingCharacterId: null,
        concentrationSpellId: null,
      });
    }
  },

  checkConcentration: damage => {
    const state = get();
    if (!state.concentratingCharacterId) return true;

    // DC = 10 or half damage, whichever is higher
    const dc = Math.max(10, Math.floor(damage / 2));
    // Simplified: 50% chance to maintain concentration
    // TODO: Implement proper Constitution saving throw
    const roll = Math.floor(Math.random() * 20) + 1;
    const success = roll >= dc;

    if (!success) {
      get().breakConcentration();
    }

    return success;
  },
}));
