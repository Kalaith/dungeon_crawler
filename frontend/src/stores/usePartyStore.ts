import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, ActiveStatusEffect, Item } from '../types';
import { GAME_CONFIG } from '../data/constants';
import { migrateParty } from '../utils/characterMigration';
import { useGameStateStore } from './useGameStateStore';

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
    levelUpCharacter: (characterIndex: number) => void;
    addXpToParty: (amount: number) => void;
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
                    // Check God Mode
                    const { godMode } = useGameStateStore.getState();

                    // If godMode is active and we're taking damage (newHp < current), ignore it
                    if (godMode && newHp < character.derivedStats.HP.current) {
                        return { party: updatedParty };
                    }

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

            levelUpCharacter: (characterIndex) => set((state) => {
                const updatedParty = [...state.party];
                const character = updatedParty[characterIndex];
                if (!character) return { party: updatedParty };

                const newLevel = character.level + 1;
                const growth = character.class.growthRates;
                // Simple exponential curve: 100 * 1.2^(level-1)
                const nextLevelExp = Math.floor(1000 * Math.pow(1.2, newLevel));

                updatedParty[characterIndex] = {
                    ...character,
                    level: newLevel,
                    expToNext: nextLevelExp,
                    derivedStats: {
                        ...character.derivedStats,
                        HP: {
                            current: character.derivedStats.HP.max + growth.HP,
                            max: character.derivedStats.HP.max + growth.HP
                        },
                        AP: {
                            current: character.derivedStats.AP.max + growth.AP,
                            max: character.derivedStats.AP.max + growth.AP
                        }
                    },
                    attributes: {
                        ...character.attributes,
                        ST: character.attributes.ST + (character.class.primaryAttributes.includes('ST') ? 1 : 0),
                        CO: character.attributes.CO + (character.class.primaryAttributes.includes('CO') ? 1 : 0),
                        DX: character.attributes.DX + (character.class.primaryAttributes.includes('DX') ? 1 : 0),
                        AG: character.attributes.AG + (character.class.primaryAttributes.includes('AG') ? 1 : 0),
                        IT: character.attributes.IT + (character.class.primaryAttributes.includes('IT') ? 1 : 0),
                        IN: character.attributes.IN + (character.class.primaryAttributes.includes('IN') ? 1 : 0),
                        WD: character.attributes.WD + (character.class.primaryAttributes.includes('WD') ? 1 : 0),
                        CH: character.attributes.CH + (character.class.primaryAttributes.includes('CH') ? 1 : 0),
                    }
                };
                return { party: updatedParty };
            }),

            addXpToParty: (amount) => set((state) => {
                const updatedParty = state.party.map(character => {
                    if (character) {
                        return { ...character, exp: character.exp + amount };
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
            onRehydrateStorage: () => (state) => {
                // Migrate legacy character data when loading from localStorage
                if (state?.party) {
                    state.party = migrateParty(state.party);
                }
            }
        }
    )
);
