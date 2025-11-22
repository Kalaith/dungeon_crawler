import { create } from 'zustand';
import type { Enemy, CombatParticipant, ActiveStatusEffect } from '../types';
import { GAME_CONFIG } from '../data/constants';

interface CombatStore {
    inCombat: boolean;
    currentEnemy: Enemy | null;
    combatTurnOrder: CombatParticipant[];
    currentTurn: number;
    combatLog: string[];

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

    startCombat: (enemy, participants) => {
        // Create enemy participant
        const enemyParticipant: CombatParticipant = {
            id: enemy.id,
            type: 'enemy',
            enemy: enemy,
            initiative: enemy.derivedStats.Initiative + Math.floor(Math.random() * 20) + 1, // d20 + Init
            status: 'active'
        };

        // Combine and sort by initiative
        const allParticipants = [...participants, enemyParticipant];
        const sortedParticipants = allParticipants.sort((a, b) => b.initiative - a.initiative);

        set({
            inCombat: true,
            currentEnemy: { ...enemy, hp: enemy.maxHp },
            combatTurnOrder: sortedParticipants,
            currentTurn: 0,
            combatLog: [`Combat started with ${enemy.name}!`],
            victoryData: null
        });
    },

    endCombat: () => set({
        inCombat: false,
        currentEnemy: null,
        combatTurnOrder: [],
        currentTurn: 0,
        victoryData: null
    }),

    addCombatLog: (message) => set((state) => {
        const newLog = [...state.combatLog, message];
        if (newLog.length > GAME_CONFIG.COMBAT.MAX_COMBAT_LOG_ENTRIES) {
            newLog.shift();
        }
        return { combatLog: newLog };
    }),

    clearCombatLog: () => set({ combatLog: [] }),

    nextTurn: () => set((state) => {
        const nextTurnIndex = (state.currentTurn + 1) % state.combatTurnOrder.length;
        return { currentTurn: nextTurnIndex };
    }),

    resetTurnOrder: (participants) => {
        const sortedParticipants = [...participants].sort((a, b) => b.initiative - a.initiative);
        set({ combatTurnOrder: sortedParticipants, currentTurn: 0 });
    },

    updateEnemyHP: (newHp) => set((state) => {
        if (state.currentEnemy) {
            return {
                currentEnemy: {
                    ...state.currentEnemy,
                    hp: Math.max(0, Math.min(state.currentEnemy.maxHp, newHp))
                }
            };
        }
        return state;
    }),

    updateEnemyStatusEffects: (effects) => set((state) => {
        if (state.currentEnemy) {
            return {
                currentEnemy: {
                    ...state.currentEnemy,
                    statusEffects: effects
                }
            };
        }
        return state;
    }),

    resetCombat: () => set({
        inCombat: false,
        currentEnemy: null,
        combatTurnOrder: [],
        currentTurn: 0,
        combatLog: [],
        victoryData: null
    }),

    setVictoryData: (data) => set({ victoryData: data })
}));
