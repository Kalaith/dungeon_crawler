import { useCallback } from 'react';
import { useCombatStore } from '../stores/useCombatStore';
import { usePartyStore } from '../stores/usePartyStore';
import { useInventoryStore } from '../stores/useInventoryStore';
import { useProgressionStore } from '../stores/useProgressionStore';
import { useUIStore } from '../stores/uiStore';
import type { Character, Enemy } from '../types';
import { calculateEffectiveStats } from '../utils/characterUtils';
import { applyStatusEffect, processStatusEffects, updateStatusEffects, hasStatusEffect } from '../utils/statusEffectUtils';
import { calculateLevelUp } from '../utils/progressionUtils';

export const useCombat = () => {
  const {
    currentEnemy,
    combatTurnOrder,
    currentTurn,
    addCombatLog,
    nextTurn,
    endCombat: endCombatStore,
    updateEnemyHP,
    updateEnemyStatusEffects
  } = useCombatStore();

  const {
    party,
    updatePartyMemberHP,
    updatePartyMemberStatusEffects,
    updatePartyMember,
    addGoldToParty
  } = usePartyStore();

  const { addItemsToInventory } = useInventoryStore();
  const { generateLoot } = useProgressionStore();
  const { showMessage } = useUIStore();

  // Helper to end combat and distribute rewards
  const endCombat = useCallback((victory: boolean, loot?: import('../types').LootDrop) => {
    if (victory) {
      // Award experience
      const exp = currentEnemy?.expReward || 0;

      // Update party with XP and check for level ups
      party.forEach((character, index) => {
        if (character && character.alive) {
          const { character: updatedCharacter, leveledUp, levelsGained } = calculateLevelUp(character, exp);

          updatePartyMember(index, updatedCharacter);

          if (leveledUp) {
            addCombatLog(`${character.name} gained ${levelsGained} level(s)!`);
          }
        }
      });

      // Add loot rewards
      if (loot) {
        addGoldToParty(loot.gold);
        if (loot.items && loot.items.length > 0) {
          addItemsToInventory(loot.items);
        }
      }

      // Reset combat state
      endCombatStore();

    } else {
      // Game Over
      endCombatStore();
      // Ideally trigger game over state in a main game store or UI
      // For now, just reset combat
    }
  }, [currentEnemy, party, updatePartyMember, addCombatLog, addGoldToParty, addItemsToInventory, endCombatStore]);

  const performAttack = useCallback((attacker: Character | Enemy, target: Character | Enemy) => {
    // Calculate effective stats for attacker
    let attackerStr = 0;
    if ('attributes' in attacker) {
      attackerStr = attacker.attributes.ST;
    }

    if ('equipment' in attacker) {
      const stats = calculateEffectiveStats(attacker as Character);
      attackerStr = stats.attributes.ST;
    }

    // Calculate effective stats for target
    let targetDef = 0;
    if ('derivedStats' in target) {
      targetDef = target.derivedStats.AC;
    }

    if ('equipment' in target) {
      const stats = calculateEffectiveStats(target as Character);
      targetDef = stats.derivedStats.AC;
    }

    const damage = Math.max(1, attackerStr - targetDef + Math.floor(Math.random() * 5));

    // Handle HP update based on target type
    let currentHp = 0;
    if ('derivedStats' in target && 'HP' in target.derivedStats) {
      // It's a Character
      currentHp = (target as Character).derivedStats.HP.current;
    } else if ('hp' in target) {
      // It's an Enemy
      currentHp = (target as Enemy).hp;
    }

    const newHp = currentHp - damage;

    const attackerName = attacker.name || 'Enemy';
    const targetName = target.name || 'Party member';

    addCombatLog(`${attackerName} attacks ${targetName} for ${damage} damage!`);

    if (target === currentEnemy) {
      // Update enemy HP
      updateEnemyHP(newHp);

      if (newHp <= 0) {
        addCombatLog(`${target.name} is defeated!`);
        const loot = generateLoot(currentEnemy.level);
        setTimeout(() => {
          addCombatLog(`Victory! Gained ${loot.gold} gold!`);
          if (loot.items.length > 0) {
            addCombatLog(`Found: ${loot.items.map(i => i.name).join(', ')}`);
          }
          endCombat(true, loot);
        }, 1000);
      }
    } else {
      // Update party member HP
      const characterIndex = party.findIndex(c => c && c.name === target.name);
      if (characterIndex >= 0) {
        updatePartyMemberHP(characterIndex, newHp);
        if (newHp <= 0) {
          addCombatLog(`${target.name} is knocked unconscious!`);
        }
      }
    }
  }, [currentEnemy, addCombatLog, endCombat, generateLoot, updateEnemyHP, updatePartyMemberHP, party]);

  const enemyAction = useCallback(() => {
    if (!currentEnemy) {
      console.error('❌ Enemy action called but currentEnemy is null');
      return;
    }

    const aliveParty = party.filter((c): c is Character => c !== null && c.alive);
    if (aliveParty.length === 0) {
      console.log('⚠️ No alive party members for enemy to attack');
      return;
    }

    console.log('👹 Enemy Action Starting:', {
      enemy: currentEnemy.name,
      attributes: currentEnemy.attributes,
      abilities: currentEnemy.abilities
    });

    try {
      // Enemy AI: 40% chance to use ability if available
      const useAbility = currentEnemy.abilities &&
        currentEnemy.abilities.length > 0 &&
        Math.random() < 0.4;

      if (useAbility && currentEnemy.abilities) {
        // Pick a random ability
        const ability = currentEnemy.abilities[Math.floor(Math.random() * currentEnemy.abilities.length)];
        console.log('👹 Enemy using ability:', ability.name);

        if (ability && ability.damage) {
          // Damage ability - target lowest HP party member
          const target = aliveParty.reduce((lowest, current) =>
            current.derivedStats.HP.current < lowest.derivedStats.HP.current ? current : lowest
          );

          // Calculate effective stats for target to get AC
          const targetStats = calculateEffectiveStats(target);
          const targetAC = targetStats.derivedStats.AC;
          const enemyST = currentEnemy.attributes?.ST || 10; // Fallback if attributes missing

          const baseDamage = Math.max(1, enemyST - targetAC + Math.floor(Math.random() * 5));
          const multiplier = typeof ability.damage === 'number' ? ability.damage : 1;
          const abilityDamage = Math.floor(baseDamage * multiplier);
          const newHp = target.derivedStats.HP.current - abilityDamage;

          addCombatLog(`${currentEnemy.name} uses ${ability.name} on ${target.name} for ${abilityDamage} damage!`);

          const characterIndex = party.findIndex(c => c && c.name === target.name);
          if (characterIndex >= 0) {
            updatePartyMemberHP(characterIndex, newHp);

            // Apply status effect if ability has one
            if (ability.effect) {
              const newEffects = applyStatusEffect(target, ability.effect);
              updatePartyMemberStatusEffects(characterIndex, newEffects);
              addCombatLog(`${target.name} is ${ability.effect.type}ed!`);
            }

            if (newHp <= 0) {
              addCombatLog(`${target.name} is knocked unconscious!`);
            }
          }
        } else if (ability && ability.heal) {
          // Heal ability - heal self
          const healAmount = parseInt(ability.heal as string) || 10;
          const newHp = Math.min(currentEnemy.maxHp, currentEnemy.hp + healAmount);
          updateEnemyHP(newHp);
          addCombatLog(`${currentEnemy.name} uses ${ability.name} and heals ${healAmount} HP!`);
        }
      } else {
        // Basic attack on random target
        console.log('👹 Enemy performing basic attack');
        const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
        performAttack(currentEnemy, target);
      }
    } catch (error) {
      console.error('❌ Error during enemy action:', error);
      addCombatLog(`Enemy tried to act but stumbled! (Error: ${error})`);
    }

    // Always schedule next turn
    setTimeout(() => {
      console.log('👹 Enemy action complete, checking party status...');
      const stillAlive = party.filter((c): c is Character => c !== null && c.alive);

      if (stillAlive.length === 0) {
        console.log('💀 All party members defeated - GAME OVER');
        addCombatLog('All party members are defeated!');
        showMessage('Game Over! All party members have fallen.');
        endCombat(false);
        return;
      }

      console.log('🔄 Enemy calling nextTurn() after attack');
      nextTurn();
    }, 1000);
  }, [currentEnemy, party, performAttack, addCombatLog, showMessage, nextTurn, endCombat, updatePartyMemberHP, updateEnemyHP, updatePartyMemberStatusEffects]);

  const processTurn = useCallback(() => {
    console.log('🎲 PROCESS TURN CALLED');
    const currentParticipant = combatTurnOrder[currentTurn];
    console.log('Processing turn for participant:', {
      index: currentTurn,
      type: currentParticipant?.type,
      name: currentParticipant?.character?.name || currentParticipant?.enemy?.name
    });

    if (!currentParticipant) {
      console.log('❌ No participant to process');
      return;
    }

    // Determine active entity
    let activeEntity: Character | Enemy | undefined;
    if (currentParticipant.type === 'party') {
      activeEntity = currentParticipant.character;
    } else {
      activeEntity = currentEnemy || currentParticipant.enemy;
    }

    if (!activeEntity) return;

    // Process status effects logic (simplified for now)
    // const statusResult = processStatusEffects(activeEntity); 
    // if (statusResult.message) addCombatLog(statusResult.message);
    // ... logic for damage application ...

    if (currentParticipant.type === 'enemy') {
      console.log('👹 Scheduling enemy action in 500ms');
      setTimeout(() => {
        console.log('👹 Executing enemy action now');
        enemyAction();
      }, 500);
    }
    // Player turns are handled by ActionMenu component
  }, [combatTurnOrder, currentTurn, enemyAction, addCombatLog, updatePartyMemberHP, updateEnemyHP, updatePartyMemberStatusEffects, updateEnemyStatusEffects, currentEnemy, nextTurn]);

  const handleCombatAction = useCallback((action: 'attack' | 'spell' | 'defend' | 'item' | 'row-switch' | 'ability' | 'escape', options?: any) => {
    console.log('⚔️ COMBAT ACTION TRIGGERED:', action);
    const currentParticipant = combatTurnOrder[currentTurn];

    if (!currentParticipant || currentParticipant.type === 'enemy') {
      console.log('❌ Action blocked: no participant or enemy turn');
      return;
    }

    const character = currentParticipant.character as Character;
    // Find index in party array
    const characterIndex = party.findIndex(p => p && p.id === character.id);

    switch (action) {
      case 'attack':
        if (currentEnemy) {
          performAttack(character, currentEnemy);
        }
        break;
      case 'ability':
        if (options?.abilityId && characterIndex !== -1) {
          const ability = character.class.abilities.find(a => a.id === options.abilityId);
          if (ability && character.derivedStats.AP.current >= (ability.cost?.AP || 0)) {
            // Deduct AP cost
            const cost = ability.cost?.AP || 0;
            const updatedCharacter = {
              ...character,
              derivedStats: {
                ...character.derivedStats,
                AP: {
                  ...character.derivedStats.AP,
                  current: character.derivedStats.AP.current - cost
                }
              }
            };
            updatePartyMember(characterIndex, updatedCharacter);
            // Character has abilities: Ability[]? No, Race has abilities: Ability[]. Class has abilities: ClassAbility[].
            // The previous code used `character.abilities.find`.
            // Let's check Character interface line 34.
            // It does NOT have `abilities` property directly!
            // It has `race.abilities` and `class.abilities`.
            // So `character.abilities` was definitely wrong.
            // However, `PartyStatus.tsx` had a fix for `character.abilities` -> `character.class.abilities`.
            // So I should use `character.class.abilities` (which are ClassAbility) or `character.race.abilities` (Ability).
            // But ClassAbility doesn't have damage/heal.
            // This implies the player ability system is not fully implemented or uses a different structure.
            // For the purpose of this fix (fixing NaN and stuck turn), I should probably just comment out the broken ability logic or try to make it safe.
            // I'll assume for now we just want to fix the syntax and the Attack action.

            addCombatLog(`${character.name} uses ${ability.name}! (Effect not fully implemented)`);

          } else {
            addCombatLog(`${character.name} doesn't have enough AP!`);
          }
        }
        break;
      case 'defend':
        addCombatLog(`${character.name} defends!`);
        break;
      case 'item':
        addCombatLog(`${character.name} uses an item! (Not implemented)`);
        break;
      case 'escape':
        if (Math.random() < 0.5) {
          addCombatLog('Successfully escaped!');
          endCombat(false);
          return;
        } else {
          addCombatLog('Cannot escape!');
        }
        break;
    }

    console.log('🕒 Scheduling next turn in 500ms after', action);
    setTimeout(() => {
      console.log('🔄 Calling nextTurn() after player action:', action);
      nextTurn();
    }, 500);
  }, [combatTurnOrder, currentTurn, currentEnemy, performAttack, addCombatLog, endCombat, nextTurn, generateLoot, party, updatePartyMember, updateEnemyHP, updatePartyMemberHP]);

  return {
    handleCombatAction,
    processTurn
  };
};