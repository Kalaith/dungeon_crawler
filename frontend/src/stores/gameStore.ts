import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, GameState, Position, Direction, Enemy, CombatParticipant, LootDrop, Item } from '../types';
import { gameData, lootTables } from '../data/gameData';
import { generateDungeon } from '../utils/dungeonGenerator';

interface GameStore {
  // Game state
  gameState: GameState;
  party: (Character | null)[];
  currentFloor: number;
  playerPosition: Position;
  playerFacing: Direction;
  exploredMap: Set<string>;
  stepCount: number;

  // Combat state
  inCombat: boolean;
  currentEnemy: Enemy | null;
  combatTurnOrder: CombatParticipant[];
  currentTurn: number;
  combatLog: string[];

  inventory: Item[];

  // Actions
  setGameState: (state: GameState) => void;
  addCharacterToParty: (character: Character, slot: number) => void;
  removeCharacterFromParty: (slot: number) => void;
  setPlayerPosition: (position: Position) => void;
  setPlayerFacing: (direction: Direction) => void;
  addExploredTile: (x: number, y: number) => void;
  incrementStepCount: () => void;
  addItemToInventory: (item: Item) => void;
  removeItemFromInventory: (itemId: string, count?: number) => void;

  // Combat actions
  startCombat: (enemy: Enemy) => void;
  endCombat: (victory: boolean, loot?: LootDrop) => void;
  addCombatLog: (message: string) => void;
  clearCombatLog: () => void;
  nextTurn: () => void;
  resetTurnOrder: () => void;
  useAbility: (characterIndex: number, abilityId: string, targetIndex?: number) => void;
  updatePartyMemberHP: (characterIndex: number, newHp: number) => void;
  updateEnemyHP: (newHp: number) => void;
  applyStatusEffectToPartyMember: (characterIndex: number, effects: import('../types').ActiveStatusEffect[]) => void;
  applyStatusEffectToEnemy: (effects: import('../types').ActiveStatusEffect[]) => void;
  updatePartyMemberStatusEffects: (characterIndex: number, effects: import('../types').ActiveStatusEffect[]) => void;
  updateEnemyStatusEffects: (effects: import('../types').ActiveStatusEffect[]) => void;

  // Character progression
  levelUpCharacter: (characterIndex: number) => boolean;
  addXpToParty: (amount: number) => void;
  addGoldToParty: (amount: number) => void;
  equipItem: (characterIndex: number, item: Item) => void;
  craftItem: (recipeId: string) => boolean;

  // Utility functions
  getPartyMembers: () => Character[];
  getAlivePartyMembers: () => Character[];
  canStartAdventure: () => boolean;
  restParty: () => void;
  resetGame: () => void;
  calculateExpToNext: (level: number) => number;
  generateLoot: (enemyLevel: number) => LootDrop;

  // Dungeon generation
  currentDungeonMap: import('../types').DungeonMap | null;
  generateFloor: (floorNumber: number) => void;
  changeFloor: (direction: 'up' | 'down') => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: 'party-creation',
      party: Array(gameData.party_system.max_party_size).fill(null),
      inventory: [],
      currentFloor: 1,
      playerPosition: { x: 1, y: 1 },
      playerFacing: 0,
      exploredMap: new Set(['1,1']),
      stepCount: 0,

      // Dungeon state
      currentDungeonMap: null,

      // Combat state
      inCombat: false,
      currentEnemy: null,
      combatTurnOrder: [],
      currentTurn: 0,
      combatLog: [],

      // Actions
      setGameState: (state) => set({ gameState: state }),

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

      setPlayerPosition: (position) => set({ playerPosition: position }),
      setPlayerFacing: (direction) => set({ playerFacing: direction }),

      addExploredTile: (x, y) => set((state) => {
        const newExplored = new Set(state.exploredMap);
        newExplored.add(`${x},${y}`);
        return { exploredMap: newExplored };
      }),

      incrementStepCount: () => set((state) => ({ stepCount: state.stepCount + 1 })),

      addItemToInventory: (item) => set((state) => ({
        inventory: [...state.inventory, item]
      })),

      removeItemFromInventory: (itemId, count = 1) => set((state) => {
        const newInventory = [...state.inventory];
        let removed = 0;
        for (let i = newInventory.length - 1; i >= 0; i--) {
          if (newInventory[i].id === itemId) {
            newInventory.splice(i, 1);
            removed++;
            if (removed >= count) break;
          }
        }
        return { inventory: newInventory };
      }),

      // Combat actions
      startCombat: (enemy) => {
        const state = get();
        const partyMembers = state.getAlivePartyMembers();

        // Calculate initiative
        const participants: CombatParticipant[] = [
          { type: 'enemy', character: { ...enemy, hp: enemy.maxHp }, agi: enemy.agi }, // Ensure enemy starts with full HP
          ...partyMembers.map((char, index) => ({
            type: 'party' as const,
            character: char,
            index: state.party.indexOf(char),
            agi: char.agi
          }))
        ].sort((a, b) => b.agi - a.agi);

        set({
          inCombat: true,
          gameState: 'combat',
          currentEnemy: { ...enemy, hp: enemy.maxHp }, // Ensure enemy starts with full HP
          combatTurnOrder: participants,
          currentTurn: 0,
          combatLog: [`Combat started with ${enemy.name}!`]
        });
      },

      endCombat: (victory, loot) => set((state) => {
        if (victory) {
          // Award experience
          const exp = state.currentEnemy?.exp || 0;

          const updatedParty = state.party.map((character) => {
            if (character && character.alive) {
              const newExp = character.exp + exp;
              let newExpToNext = character.expToNext - exp;

              // Check for level up
              if (newExpToNext <= 0) {
                // Level up logic inline
                const newLevel = character.level + 1;
                const growth = character.class.stat_growth;
                const { calculateExpToNext } = get();

                return {
                  ...character,
                  level: newLevel,
                  exp: newExp,
                  expToNext: calculateExpToNext(newLevel) + newExpToNext, // Carry over excess XP
                  maxHp: character.maxHp + growth.hp,
                  hp: character.maxHp + growth.hp, // Full heal
                  maxMp: character.maxMp + growth.mp,
                  mp: character.maxMp + growth.mp, // Full MP
                  str: character.str + growth.str,
                  def: character.def + growth.def,
                  agi: character.agi + growth.agi,
                  luc: character.luc + growth.luc,
                  abilities: character.class.abilities.filter(a => a.unlockLevel <= newLevel)
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

          // Add loot rewards
          let totalGold = 0;
          let newInventory = [...state.inventory];

          if (loot) {
            totalGold = loot.gold;
            if (loot.items && loot.items.length > 0) {
              newInventory = [...newInventory, ...loot.items];
            }
          }

          const finalParty = updatedParty.map(char => {
            if (char && totalGold > 0) {
              return { ...char, gold: char.gold + Math.floor(totalGold / state.getPartyMembers().length) };
            }
            return char;
          });

          return {
            inCombat: false,
            gameState: 'exploring',
            currentEnemy: null,
            combatTurnOrder: [],
            currentTurn: 0,
            party: finalParty,
            inventory: newInventory,
            combatLog: [...state.combatLog, `Victory! Gained ${exp} XP and ${totalGold} Gold.`]
          };
        }

        return {
          inCombat: false,
          gameState: 'game-over',
          currentEnemy: null,
          combatTurnOrder: [],
          currentTurn: 0
        };
      }),

      addCombatLog: (message) => set((state) => ({
        combatLog: [...state.combatLog, message]
      })),

      clearCombatLog: () => set({ combatLog: [] }),

      nextTurn: () => set((state) => {
        const nextTurnIndex = (state.currentTurn + 1) % state.combatTurnOrder.length;
        return { currentTurn: nextTurnIndex };
      }),

      resetTurnOrder: () => set((state) => {
        // Re-calculate initiative
        if (!state.currentEnemy) return {};

        const partyMembers = state.getAlivePartyMembers();
        const participants: CombatParticipant[] = [
          { type: 'enemy', character: state.currentEnemy, agi: state.currentEnemy.agi },
          ...partyMembers.map((char) => ({
            type: 'party' as const,
            character: char,
            index: state.party.indexOf(char),
            agi: char.agi
          }))
        ].sort((a, b) => b.agi - a.agi);

        return { combatTurnOrder: participants, currentTurn: 0 };
      }),

      updatePartyMemberHP: (characterIndex, newHp) => set((state) => {
        const updatedParty = [...state.party];
        const character = updatedParty[characterIndex];
        if (character) {
          updatedParty[characterIndex] = {
            ...character,
            hp: Math.max(0, Math.min(character.maxHp, newHp)),
            alive: newHp > 0
          };
        }
        return { party: updatedParty };
      }),

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

      applyStatusEffectToEnemy: (effects) => set((state) => {
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

      useAbility: (characterIndex, abilityId) => {
        // Implementation will be added in combat enhancement
        const state = get();
        const character = state.party[characterIndex];
        if (!character) return;

        // Find ability and check MP cost
        const ability = character.abilities.find(a => a.id === abilityId);
        if (!ability || character.mp < ability.mpCost) return;

        // Deduct MP
        const updatedParty = [...state.party];
        updatedParty[characterIndex] = {
          ...character,
          mp: character.mp - ability.mpCost
        };

        set({ party: updatedParty });
      },

      levelUpCharacter: (characterIndex) => {
        const state = get();
        const character = state.party[characterIndex];
        if (!character) return false;

        const { calculateExpToNext } = get();
        const newLevel = character.level + 1;
        const growth = character.class.stat_growth;

        const updatedParty = [...state.party];
        updatedParty[characterIndex] = {
          ...character,
          level: newLevel,
          expToNext: calculateExpToNext(newLevel),
          maxHp: character.maxHp + growth.hp,
          hp: character.hp + growth.hp, // Full heal on level up
          maxMp: character.maxMp + growth.mp,
          mp: character.mp + growth.mp, // Full MP restore
          str: character.str + growth.str,
          def: character.def + growth.def,
          agi: character.agi + growth.agi,
          luc: character.luc + growth.luc,
          // Unlock new abilities
          abilities: character.class.abilities.filter(a => a.unlockLevel <= newLevel)
        };

        set({ party: updatedParty });
        return true;
      },

      addXpToParty: (amount) => set((state) => {
        const updatedParty = state.party.map((character) => {
          if (character && character.alive) {
            const newExp = character.exp + amount;
            let newExpToNext = character.expToNext - amount;

            // Check for level up
            if (newExpToNext <= 0) {
              const newLevel = character.level + 1;
              const growth = character.class.stat_growth;
              // We can't use get() inside set() easily for calculateExpToNext if it depends on state,
              // but calculateExpToNext is pure function in this store.
              // However, we can't access get() here easily without closure.
              // Let's just duplicate the simple formula: 100 * 1.2^(level-1)
              const nextLevelExp = Math.floor(100 * Math.pow(1.2, newLevel - 1));

              return {
                ...character,
                level: newLevel,
                exp: newExp,
                expToNext: nextLevelExp + newExpToNext, // Carry over excess XP
                maxHp: character.maxHp + growth.hp,
                hp: character.maxHp + growth.hp,
                maxMp: character.maxMp + growth.mp,
                mp: character.maxMp + growth.mp,
                str: character.str + growth.str,
                def: character.def + growth.def,
                agi: character.agi + growth.agi,
                luc: character.luc + growth.luc,
                abilities: character.class.abilities.filter(a => a.unlockLevel <= newLevel)
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

      equipItem: (characterIndex, item) => set((state) => {
        const character = state.party[characterIndex];
        if (!character) return state;

        const updatedParty = [...state.party];
        const newEquipment = { ...character.equipment };

        // Equip item based on type
        if (item.type === 'weapon') {
          newEquipment.weapon = item;
        } else if (item.type === 'armor') {
          newEquipment.armor = item;
        } else if (item.type === 'accessory') {
          newEquipment.accessory = item;
        }

        updatedParty[characterIndex] = {
          ...character,
          equipment: newEquipment
        };

        return { party: updatedParty };
      }),

      craftItem: (recipeId) => {
        const state = get();
        const { craftingRecipes } = gameData; // Use gameData directly
        const recipe = craftingRecipes.find((r: any) => r.id === recipeId);

        if (!recipe) return false;

        // Check gold (assume shared gold? No, gold is per character. Who pays? First character?)
        // Let's assume the party pools gold for crafting.
        const totalGold = state.party.reduce((sum, char) => sum + (char?.gold || 0), 0);
        if (totalGold < recipe.goldCost) return false;

        // Check materials
        for (const mat of recipe.materials) {
          const count = state.inventory.filter(i => i.id === mat.materialId).length;
          if (count < mat.count) return false;
        }

        // Deduct gold (evenly if possible, or from richest)
        // Simplified: Deduct from first available
        let remainingCost = recipe.goldCost;
        const updatedParty = state.party.map(char => {
          if (!char || remainingCost <= 0) return char;
          const deduction = Math.min(char.gold, remainingCost);
          remainingCost -= deduction;
          return { ...char, gold: char.gold - deduction };
        });

        // Deduct materials
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

        // Add result item
        newInventory.push(recipe.resultItem);

        set({ party: updatedParty, inventory: newInventory });
        return true;
      },

      // Utility functions
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
              hp: character.maxHp,
              mp: character.maxMp,
              alive: true
            };
          }
          return character;
        });
        return { party: restedParty };
      }),

      resetGame: () => set({
        gameState: 'party-creation',
        party: Array(gameData.party_system.max_party_size).fill(null),
        currentFloor: 1,
        playerPosition: { x: 1, y: 1 },
        playerFacing: 0,
        exploredMap: new Set(['1,1']),
        stepCount: 0,
        inCombat: false,
        currentEnemy: null,
        combatTurnOrder: [],
        currentTurn: 0,
        combatLog: []
      }),

      calculateExpToNext: (level) => {
        return Math.floor(100 * Math.pow(1.2, level - 1));
      },

      generateLoot: (enemyLevel) => {
        const gold = Math.floor(Math.random() * 20) + (enemyLevel * 5);
        const items: Item[] = [];

        // 60% chance for common item, 25% rare, 10% epic, 5% legendary
        const roll = Math.random();
        if (roll < 0.6) {
          const commonItems = lootTables.common;
          if (commonItems.length > 0) {
            items.push(commonItems[Math.floor(Math.random() * commonItems.length)]);
          }
        } else if (roll < 0.85) {
          const rareItems = lootTables.rare;
          if (rareItems.length > 0) {
            items.push(rareItems[Math.floor(Math.random() * rareItems.length)]);
          }
        }

        return { gold, items };
      },

      generateFloor: (floorNumber) => {
        console.log('🏗️ generateFloor called with floor:', floorNumber);
        try {
          const dungeonData = generateDungeon(20, 20, floorNumber);
          console.log('✅ Dungeon data generated:', dungeonData);

          set({
            currentDungeonMap: {
              width: 20,
              height: 20,
              floor: floorNumber,
              layout: dungeonData.layout,
              playerStart: dungeonData.playerStart,
              stairsUp: dungeonData.stairsUp,
              stairsDown: dungeonData.stairsDown,
              treasureLocations: dungeonData.treasureLocations
            },
            currentFloor: floorNumber,
            playerPosition: dungeonData.playerStart,
            playerFacing: 0,
            exploredMap: new Set([`${dungeonData.playerStart.x},${dungeonData.playerStart.y}`])
          });
          console.log('✅ State updated with new dungeon');
        } catch (error) {
          console.error('❌ Error in generateFloor:', error);
        }
      },

      changeFloor: (direction) => {
        const state = get();
        const newFloor = direction === 'up' ? state.currentFloor - 1 : state.currentFloor + 1;

        if (newFloor < 1) return; // Can't go above floor 1

        const { generateFloor } = get();
        generateFloor(newFloor);
      }
    }),
    {
      name: 'dungeon-crawler-game',
      partialize: (state) => ({
        party: state.party,
        currentFloor: state.currentFloor,
        playerPosition: state.playerPosition,
        playerFacing: state.playerFacing,
        exploredMap: Array.from(state.exploredMap),
        stepCount: state.stepCount
      }),
      merge: (persistedState: unknown, currentState) => {
        const state = persistedState as Partial<GameStore> | null;
        return {
          ...currentState,
          ...(state || {}),
          exploredMap: new Set(state?.exploredMap || ['1,1'])
        };
      }
    }
  )
);