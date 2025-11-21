import type { Character, Item } from '../../types';
import { gameData, lootTables } from '../../data/gameData';
import type { GameSliceCreator, PartySlice } from './types';

export const createPartySlice: GameSliceCreator<PartySlice> = (set, get) => ({
    party: Array(gameData.party_system.max_party_size).fill(null),
    inventory: [],

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

    addItemToInventory: (item) => set((state) => ({
        inventory: [...state.inventory, item]
    })),

    removeItemFromInventory: (itemId, count = 1) => set((state) => {
        const inventory = state.inventory || [];
        const newInventory = [...inventory];
        let removed = 0;
        for (let i = newInventory.length - 1; i >= 0; i--) {
            if (removed >= count) break;
            const item = newInventory[i];
            if (item && item.id === itemId) {
                newInventory.splice(i, 1);
                removed++;
            }
        }
        return { inventory: newInventory };
    }),

    equipItem: (characterIndex, item) => set((state) => {
        const character = state.party[characterIndex];
        if (!character) return state;

        const updatedParty = [...state.party];
        const newEquipment = { ...character.equipment };

        // Equip item based on type
        if (item.type === 'weapon') {
            newEquipment.mainHand = item;
        } else if (item.type === 'armor') {
            newEquipment.armor = item;
        } else if (item.type === 'accessory') {
            newEquipment.accessory1 = item; // Simplified
        }

        updatedParty[characterIndex] = {
            ...character,
            equipment: newEquipment
        };

        return { party: updatedParty };
    }),

    craftItem: (recipeId) => {
        const state = get();
        const { craftingRecipes } = gameData;
        const recipe = craftingRecipes.find((r: any) => r.id === recipeId);

        if (!recipe) return false;

        const totalGold = state.party.reduce((sum, char) => sum + (char ? char.gold : 0), 0);
        if (totalGold < recipe.goldCost) return false;

        for (const mat of recipe.materials) {
            const count = state.inventory.filter(i => i.id === mat.materialId).length;
            if (count < mat.count) return false;
        }

        let remainingCost = recipe.goldCost;
        const updatedParty = state.party.map(char => {
            if (!char || remainingCost <= 0) return char;
            const deduction = Math.min(char.gold, remainingCost);
            remainingCost -= deduction;
            return { ...char, gold: char.gold - deduction };
        });

        let newInventory = [...state.inventory];
        for (const mat of recipe.materials) {
            let removed = 0;
            for (let i = newInventory.length - 1; i >= 0; i--) {
                if (newInventory[i].id === mat.materialId) {
                    newInventory.splice(i, 1);
                    removed++;
                    if (removed >= mat.count) break;
                }
            }
        }

        newInventory.push(recipe.resultItem);

        set({ party: updatedParty, inventory: newInventory });
        return true;
    },

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
    },

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
                    alive: true
                };
            }
            return character;
        });
        return { party: restedParty };
    }),

    calculateExpToNext: (level) => {
        return Math.floor(100 * Math.pow(1.2, level - 1));
    },

    generateLoot: (enemyLevel) => {
        const gold = Math.floor(Math.random() * 20) + (enemyLevel * 5);
        const items: Item[] = [];

        const roll = Math.random();
        if (roll < 0.6) {
            const commonItems = lootTables['common'];
            if (commonItems && commonItems.length > 0) {
                const item = commonItems[Math.floor(Math.random() * commonItems.length)];
                if (item) items.push(item);
            }
        } else if (roll < 0.85) {
            const rareItems = lootTables['rare'];
            if (rareItems && rareItems.length > 0) {
                const item = rareItems[Math.floor(Math.random() * rareItems.length)];
                if (item) items.push(item);
            }
        }

        return { gold, items, chance: 1 };
    },

    levelUpCharacter: (characterIndex) => {
        const state = get();
        const character = state.party[characterIndex];
        if (!character) return false;

        const { calculateExpToNext } = get();
        const newLevel = character.level + 1;
        const growth = character.class.growthRates;

        const updatedParty = [...state.party];
        updatedParty[characterIndex] = {
            ...character,
            level: newLevel,
            expToNext: calculateExpToNext(newLevel),
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

        set({ party: updatedParty });
        return true;
    },

    addXpToParty: (amount) => set((state) => {
        const updatedParty = state.party.map((character) => {
            if (character && character.alive) {
                const newExp = character.exp + amount;
                let newExpToNext = character.expToNext - amount;

                if (newExpToNext <= 0) {
                    const newLevel = character.level + 1;
                    const growth = character.class.growthRates;
                    const nextLevelExp = Math.floor(100 * Math.pow(1.2, newLevel - 1));

                    return {
                        ...character,
                        level: newLevel,
                        exp: newExp,
                        expToNext: nextLevelExp + newExpToNext,
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
                }

                return {
                    ...character,
                    exp: newExp,
                    expToNext: newExpToNext
                };
            }
            return character;
        });

        return { party: updatedParty };
    }),

    addGoldToParty: (amount) => set((state) => {
        const updatedParty = state.party.map(character => {
            if (character) {
                return { ...character, gold: character.gold + Math.floor(amount / state.getPartyMembers().length) };
            }
            return character;
        });
        return { party: updatedParty };
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

    applyStatusEffectToPartyMember: (characterIndex, effects) => set((state) => {
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
    })
});
