import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, GameState, Position, Direction, Enemy, CombatParticipant, LootDrop, Item } from '../types';
import { gameData, lootTables } from '../data/gameData';

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

  // Actions
  setGameState: (state: GameState) => void;
  addCharacterToParty: (character: Character, slot: number) => void;
  removeCharacterFromParty: (slot: number) => void;
  setPlayerPosition: (position: Position) => void;
  setPlayerFacing: (direction: Direction) => void;
  addExploredTile: (x: number, y: number) => void;
  incrementStepCount: () => void;

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

  // Character progression
  levelUpCharacter: (characterIndex: number) => boolean;
  addGoldToParty: (amount: number) => void;
  equipItem: (characterIndex: number, item: Item) => void;

  // Utility functions
  getPartyMembers: () => Character[];
  getAlivePartyMembers: () => Character[];
  canStartAdventure: () => boolean;
  restParty: () => void;
  resetGame: () => void;
  calculateExpToNext: (level: number) => number;
  generateLoot: (enemyLevel: number) => LootDrop;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: 'party-creation',
      party: Array(gameData.party_system.max_party_size).fill(null),
      currentFloor: 1,
      playerPosition: { x: 1, y: 1 },
      playerFacing: 0,
      exploredMap: new Set(['1,1']),
      stepCount: 0,

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
        const newExploredMap = new Set(state.exploredMap);
        newExploredMap.add(`${x},${y}`);
        return { exploredMap: newExploredMap };
      }),

      incrementStepCount: () => set((state) => ({ stepCount: state.stepCount + 1 })),

      // Combat actions
      startCombat: (enemy) => {
        console.log('⚔️ STARTING COMBAT - Building turn order...');
        const state = get();
        const turnOrder: CombatParticipant[] = [];

        console.log('Party members before turn order:');
        // Add party members
        state.party.forEach((character, index) => {
          if (character && character.alive) {
            const randomBonus = Math.floor(Math.random() * 5);
            const finalAgi = character.agi + randomBonus;
            console.log(`  ${character.name} (party index ${index}): base agi=${character.agi}, random=${randomBonus}, final=${finalAgi}`);
            
            turnOrder.push({
              type: 'party',
              character,
              index,
              agi: finalAgi
            });
          }
        });

        // Add enemy
        const enemyRandomBonus = Math.floor(Math.random() * 5);
        const enemyFinalAgi = enemy.agi + enemyRandomBonus;
        console.log(`  ${enemy.name} (enemy): base agi=${enemy.agi}, random=${enemyRandomBonus}, final=${enemyFinalAgi}`);
        
        turnOrder.push({
          type: 'enemy',
          character: { ...enemy, hp: enemy.maxHp },
          agi: enemyFinalAgi
        });

        console.log('Turn order before sorting:', turnOrder.map(p => ({ name: p.character.name, agi: p.agi, type: p.type })));
        
        // Sort by agility (highest first) - this determines the FIXED order for this entire combat
        turnOrder.sort((a, b) => {
          // Primary sort: agility (with random bonus)
          if (b.agi !== a.agi) {
            return b.agi - a.agi;
          }
          // Tiebreaker: party members before enemies, then by party index
          if (a.type === 'party' && b.type === 'enemy') return -1;
          if (a.type === 'enemy' && b.type === 'party') return 1;
          if (a.type === 'party' && b.type === 'party') {
            return (a.index || 0) - (b.index || 0);
          }
          return 0;
        });
        
        console.log('🎯 FINAL TURN ORDER for this combat:', turnOrder.map((p, i) => ({ 
          turnIndex: i, 
          name: p.character.name, 
          type: p.type, 
          partyIndex: p.index,
          agi: p.agi 
        })));
        console.log('📝 This order will remain fixed for the entire combat!');

        set({
          inCombat: true,
          gameState: 'combat',
          currentEnemy: { ...enemy, hp: enemy.maxHp },
          combatTurnOrder: turnOrder,
          currentTurn: 0,
          combatLog: [
            `A ${enemy.name} appears!`,
            `Turn order: ${turnOrder.map(p => p.character.name).join(' → ')}`
          ]
        });
        
        console.log('⚔️ Combat started! First turn goes to:', turnOrder[0]?.character.name);
      },

      endCombat: (victory, loot) => set((state) => {
        if (victory) {
          // Award experience and check for level ups
          const exp = state.currentEnemy?.exp || 0;
          const updatedParty = state.party.map((character, index) => {
            if (character && character.alive) {
              const newExp = character.exp + exp;
              const newExpToNext = character.expToNext - exp;
              const updatedCharacter = { 
                ...character, 
                exp: newExp,
                expToNext: Math.max(0, newExpToNext)
              };
              
              // Check for level up
              if (newExpToNext <= 0) {
                const { levelUpCharacter } = get();
                levelUpCharacter(index);
              }
              
              return updatedCharacter;
            }
            return character;
          });
          
          // Add loot rewards
          let totalGold = 0;
          if (loot) {
            totalGold = loot.gold;
            const { addGoldToParty } = get();
            addGoldToParty(totalGold);
          }
          
          return {
            inCombat: false,
            gameState: 'exploring',
            currentEnemy: null,
            combatTurnOrder: [],
            currentTurn: 0,
            party: updatedParty
          };
        }

        return {
          inCombat: false,
          gameState: 'exploring',
          currentEnemy: null,
          combatTurnOrder: [],
          currentTurn: 0
        };
      }),

      addCombatLog: (message) => set((state) => {
        const newLog = [...state.combatLog, message];
        if (newLog.length > 10) {
          newLog.shift();
        }
        return { combatLog: newLog };
      }),

      clearCombatLog: () => set({ combatLog: [] }),

      nextTurn: () => set((state) => {
        console.log('🔄 NEXT TURN CALLED');
        console.log('Current turn index:', state.currentTurn);
        console.log('Turn order length:', state.combatTurnOrder.length);
        console.log('Current participant:', state.combatTurnOrder[state.currentTurn]?.character.name);
        const turnOrderDetails = state.combatTurnOrder.map((p, i) => ({
          turnIndex: i,
          type: p.type,
          name: p.character.name,
          partyIndex: p.index, // This is the original party slot index
          agi: p.agi,
          alive: p.type === 'party' ? (p.character as Character).alive : true,
          hp: p.character.hp
        }));
        console.log('Turn order:', turnOrderDetails);
        console.table(turnOrderDetails);
        
        const originalTurn = state.currentTurn;
        let nextTurn = (state.currentTurn + 1) % state.combatTurnOrder.length;
        console.log('Next calculated turn index (before validation):', nextTurn);
        
        // QUESTION: Should we cycle back to 0 after all participants have had one turn?
        // Let's check if this is the issue:
        console.log('🤔 TURN CYCLING ANALYSIS:');
        console.log('- Current turn:', originalTurn, '(' + state.combatTurnOrder[originalTurn]?.character.name + ')');
        console.log('- Standard next turn:', nextTurn, '(' + (state.combatTurnOrder[nextTurn]?.character.name || 'NONE') + ')');
        console.log('- Turn order length:', state.combatTurnOrder.length);
        console.log('- Is this cycling correctly?', nextTurn < state.combatTurnOrder.length);
        
        // TEMPORARILY DISABLE VALIDATION TO DEBUG
        console.log('\ud83d\udea8 DISABLING TURN VALIDATION TO DEBUG THE CYCLING ISSUE');
        console.log('Simple next turn should be:', nextTurn);
        
        // Skip unconscious party members
        let attempts = 0;
        const skipValidation = true; // TODO: Remove this debug flag
        
        while (attempts < state.combatTurnOrder.length && !skipValidation) {
          const participant = state.combatTurnOrder[nextTurn];
          console.log(`Attempt ${attempts}: Checking participant at index ${nextTurn}:`, {
            type: participant?.type,
            name: participant?.character.name,
            alive: participant?.type === 'party' ? (participant.character as Character).alive : 'N/A',
            hp: participant?.character.hp
          });
          
          if (!participant) {
            console.log('❌ No participant found, breaking');
            break;
          }
          
          if (participant.type === 'enemy') {
            // Enemy turn is valid if enemy is alive
            if (state.currentEnemy && state.currentEnemy.hp > 0) {
              console.log('✅ Enemy turn is valid');
              break;
            } else {
              console.log('❌ Enemy is dead, skipping');
            }
          } else {
            // Party member turn is valid if they're alive
            const character = participant.character as Character;
            if (character.alive && character.hp > 0) {
              console.log('✅ Party member turn is valid');
              break;
            } else {
              console.log('❌ Party member is unconscious, skipping');
            }
          }
          
          // Move to next turn and try again
          nextTurn = (nextTurn + 1) % state.combatTurnOrder.length;
          attempts++;
          console.log(`Moving to next turn index: ${nextTurn} (attempt ${attempts})`);
        }
        
        console.log('🎯 FINAL TURN DECISION:');
        console.log('Original turn:', originalTurn);
        console.log('New turn:', nextTurn);
        console.log('Participant:', state.combatTurnOrder[nextTurn]?.character.name);
        
        return { currentTurn: nextTurn };
      }),

      resetTurnOrder: () => set({ combatTurnOrder: [], currentTurn: 0 }),

      updatePartyMemberHP: (characterIndex, newHp) => set((state) => {
        const updatedParty = [...state.party];
        const character = updatedParty[characterIndex];
        if (character) {
          updatedParty[characterIndex] = {
            ...character,
            hp: Math.max(0, newHp),
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
              hp: Math.max(0, newHp)
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
          mp: character.maxMp + growth.mp, // Full MP restore
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