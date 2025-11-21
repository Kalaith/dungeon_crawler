import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, ActiveStatusEffect, Item } from '../types';
import { GAME_CONFIG } from '../data/constants';

interface PartyStore {
    party: (Character | null)[];

    // Actions
    addCharacterToParty: (character: Character, slot: number) => void;
    removeCharacterFromParty: (slot: number) => void;
    updatePartyMemberHP: (characterIndex: number, newHp: number) => void;
    updatePartyMemberAP: (characterIndex: number, newAp: number) => void;
    updatePartyMemberStatusEffects: (characterIndex: number, effects: ActiveStatusEffect[]) => void;
    updatePartyMember: (characterIndex: number, updates: Partial<Character>) => void;
    equipItem: (characterIndex: number, item: Item, slot: keyof Character['equipment']) => void;
    addGoldToParty: (amount: number) => void;
    restParty: () => void;
    resetParty: () => void;

    // Getters
    getPartyMembers: () => Character[];
    getAlivePartyMembers: () => Character[];
    canStartAdventure: () => boolean;
}

export const usePartyStore = create<PartyStore>()(
    persist(
        (set, get) => ({
            party: Array(GAME_CONFIG.PARTY.MAX_SIZE).fill(null),

            addCharacterToParty: (character, slot) => set((state) => {
                const newParty = [...state.party];
                newParty[slot] = character;
                return { party: newParty };
            }),

            removeCharacterFromParty: (slot) => set((state) => {
                const newParty = [...state.party];
                newParty[slot] = null;
                return { party: newParty };
            }),

            updatePartyMemberHP: (characterIndex, newHp) => set((state) => {
                const updatedParty = [...state.party];
                const character = updatedParty[characterIndex];
                if (character) {
                    updatedParty[characterIndex] = {
                        ...character,
                        derivedStats: {
                            ...character.derivedStats,
                            HP: {
                                ...character.derivedStats.HP,
                                current: Math.max(0, Math.min(character.derivedStats.HP.max, newHp))
                            }
                        },
                        alive: newHp > 0
                    };
                }
                return { party: updatedParty };
            }),

            updatePartyMemberAP: (characterIndex, newAp) => set((state) => {
                const updatedParty = [...state.party];
                const character = updatedParty[characterIndex];
                if (character) {
                    updatedParty[characterIndex] = {
                        ...character,
                        derivedStats: {
                            ...character.derivedStats,
                            AP: {
                                ...character.derivedStats.AP,
                                current: Math.max(0, Math.min(character.derivedStats.AP.max, newAp))
                            }
                        }
                    };
                }
                return { party: updatedParty };
            }),

            updatePartyMemberStatusEffects: (characterIndex, effects) => set((state) => {
                const updatedParty = [...state.party];
                const character = updatedParty[characterIndex];
                if (character) {
                    updatedParty[characterIndex] = {
                        ...character,
                        statusEffects: effects
                    };
                }
                return { party: updatedParty };
            }),

            updatePartyMember: (characterIndex, updates) => set((state) => {
                const updatedParty = [...state.party];
                const character = updatedParty[characterIndex];
                if (character) {
                    updatedParty[characterIndex] = {
                        ...character,
                        ...updates
                    };
                }
                return { party: updatedParty };
            }),

            equipItem: (characterIndex, item, slot) => set((state) => {
                const character = state.party[characterIndex];
                if (!character) return state;

                const updatedParty = [...state.party];
                const newEquipment = { ...character.equipment };

                newEquipment[slot] = item;

                updatedParty[characterIndex] = {
                    ...character,
                    equipment: newEquipment
                };

                return { party: updatedParty };
            }),

            addGoldToParty: (amount) => set((state) => {
                const partyMembers = state.party.filter((c): c is Character => c !== null);
                if (partyMembers.length === 0) return state;

                const goldPerMember = Math.floor(amount / partyMembers.length);
                const updatedParty = state.party.map(character => {
                    if (character) {
                        return { ...character, gold: character.gold + goldPerMember };
                    }
                    return character;
                });
                return { party: updatedParty };
            }),

            restParty: () => set((state) => {
                const restedParty = state.party.map(character => {
                    if (character) {
                        return {
                            ...character,
                            derivedStats: {
                                ...character.derivedStats,
                                HP: { ...character.derivedStats.HP, current: character.derivedStats.HP.max },
                                AP: { ...character.derivedStats.AP, current: character.derivedStats.AP.max }
                            },
                            alive: true,
                            statusEffects: []
                        };
                    }
                    return character;
                });
                return { party: restedParty };
            }),

            resetParty: () => set({
                party: Array(GAME_CONFIG.PARTY.MAX_SIZE).fill(null)
            }),

            getPartyMembers: () => {
                const state = get();
                return state.party.filter((character): character is Character => character !== null);
            },

            getAlivePartyMembers: () => {
                const state = get();
                return state.party.filter((character): character is Character =>
                    character !== null && character.alive
                );
            },

            canStartAdventure: () => {
                const state = get();
                return state.party.some(character => character !== null);
            }
        }),
        {
            name: 'dungeon-crawler-party',
        }
    )
);
