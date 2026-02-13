
import type { CombatParticipant } from '../../types';
import type { GameSliceCreator, CombatSlice } from './types';

export const createCombatSlice: GameSliceCreator<CombatSlice> = (set, get) => ({
  inCombat: false,
  currentEnemy: null,
  combatTurnOrder: [],
  currentTurn: 0,
  combatLog: [],

  startCombat: enemy => {
    const state = get();
    const partyMembers = state.getAlivePartyMembers();

    // Calculate initiative
    const participants: CombatParticipant[] = [
      {
        id: 'enemy',
        type: 'enemy' as const,
        enemy: { ...enemy, hp: enemy.maxHp }, // Ensure enemy starts with full HP
        initiative: enemy.derivedStats.Initiative,
        status: 'active' as const,
      },
      ...partyMembers.map(char => ({
        id: char.id,
        type: 'party' as const,
        character: char,
        index: state.party.indexOf(char),
        initiative: char.derivedStats.Initiative,
        status: 'active' as const,
      })),
    ].sort((a, b) => b.initiative - a.initiative);

    set({
      inCombat: true,
      gameState: 'combat',
      currentEnemy: { ...enemy, hp: enemy.maxHp },
      combatTurnOrder: participants,
      currentTurn: 0,
      combatLog: [`Combat started with ${enemy.name}!`],
    });
  },

  endCombat: (victory, loot) =>
    set(state => {
      if (victory) {
        // Award experience
        const exp = state.currentEnemy?.expReward || 0;

        const updatedParty = state.party.map(character => {
          if (character && character.alive) {
            const newExp = character.exp + exp;
            const newExpToNext = character.expToNext - exp;

            // Check for level up
            if (newExpToNext <= 0) {
              // Level up logic inline
              const newLevel = character.level + 1;
              const growth = character.class.growthRates;
              const { calculateExpToNext } = get();

              return {
                ...character,
                level: newLevel,
                exp: newExp,
                expToNext: calculateExpToNext(newLevel) + newExpToNext, // Carry over excess XP
                derivedStats: {
                  ...character.derivedStats,
                  HP: {
                    current: character.derivedStats.HP.max + growth.HP,
                    max: character.derivedStats.HP.max + growth.HP,
                  },
                  AP: {
                    current: character.derivedStats.AP.max + growth.AP,
                    max: character.derivedStats.AP.max + growth.AP,
                  },
                },
                attributes: {
                  ...character.attributes,
                  // Simple attribute growth for now
                  ST:
                    character.attributes.ST +
                    (character.class.primaryAttributes.includes('ST') ? 1 : 0),
                  CO:
                    character.attributes.CO +
                    (character.class.primaryAttributes.includes('CO') ? 1 : 0),
                  DX:
                    character.attributes.DX +
                    (character.class.primaryAttributes.includes('DX') ? 1 : 0),
                  AG:
                    character.attributes.AG +
                    (character.class.primaryAttributes.includes('AG') ? 1 : 0),
                  IT:
                    character.attributes.IT +
                    (character.class.primaryAttributes.includes('IT') ? 1 : 0),
                  IN:
                    character.attributes.IN +
                    (character.class.primaryAttributes.includes('IN') ? 1 : 0),
                  WD:
                    character.attributes.WD +
                    (character.class.primaryAttributes.includes('WD') ? 1 : 0),
                  CH:
                    character.attributes.CH +
                    (character.class.primaryAttributes.includes('CH') ? 1 : 0),
                },
              };
            }

            return {
              ...character,
              exp: newExp,
              expToNext: newExpToNext,
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
            return {
              ...char,
              gold:
                char.gold +
                Math.floor(totalGold / state.getPartyMembers().length),
            };
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
          combatLog: [
            ...state.combatLog,
            `Victory! Gained ${exp} XP and ${totalGold} Gold.`,
          ],
        };
      }

      return {
        inCombat: false,
        gameState: 'game-over',
        currentEnemy: null,
        combatTurnOrder: [],
        currentTurn: 0,
      };
    }),

  addCombatLog: message =>
    set(state => ({
      combatLog: [...state.combatLog, message],
    })),

  clearCombatLog: () => set({ combatLog: [] }),

  nextTurn: () =>
    set(state => {
      const nextTurnIndex =
        (state.currentTurn + 1) % state.combatTurnOrder.length;
      return { currentTurn: nextTurnIndex };
    }),

  resetTurnOrder: () =>
    set(state => {
      // Re-calculate initiative
      if (!state.currentEnemy) return {};

      const partyMembers = state.getAlivePartyMembers();
      const participants: CombatParticipant[] = [
        {
          id: 'enemy',
          type: 'enemy' as const,
          enemy: state.currentEnemy,
          initiative: state.currentEnemy.derivedStats.Initiative,
          status: 'active' as const,
        },
        ...partyMembers.map(char => ({
          id: char.id,
          type: 'party' as const,
          character: char,
          index: state.party.indexOf(char),
          initiative: char.derivedStats.Initiative,
          status: 'active' as const,
        })),
      ].sort((a, b) => b.initiative - a.initiative);

      return { combatTurnOrder: participants, currentTurn: 0 };
    }),

  useAbility: (characterIndex, abilityId) => {
    const state = get();
    const character = state.party[characterIndex];
    if (!character) return;

    // Find ability and check AP cost
    const ability = character.class.abilities.find(a => a.id === abilityId);
    if (!ability || !ability.cost?.AP) return;

    const apCost = ability.cost.AP;
    if (character.derivedStats.AP.current < apCost) return;

    // Deduct AP
    const updatedParty = [...state.party];
    updatedParty[characterIndex] = {
      ...character,
      derivedStats: {
        ...character.derivedStats,
        AP: {
          ...character.derivedStats.AP,
          current: character.derivedStats.AP.current - apCost,
        },
      },
    };

    set({ party: updatedParty });
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

  applyStatusEffectToEnemy: effects =>
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
});

