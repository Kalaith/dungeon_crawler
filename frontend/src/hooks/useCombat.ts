import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';
import type { Character, Enemy } from '../types';

import { calculateEffectiveStats } from '../utils/characterUtils';
import { applyStatusEffect, processStatusEffects, updateStatusEffects, hasStatusEffect } from '../utils/statusEffectUtils';

export const useCombat = () => {
  const {
    party,
    currentEnemy,
    combatTurnOrder,
    currentTurn,
    addCombatLog,
    nextTurn,
    endCombat,
    generateLoot,
    updatePartyMemberHP,
    updateEnemyHP,
    applyStatusEffectToPartyMember,
    applyStatusEffectToEnemy,
    updatePartyMemberStatusEffects,
    updateEnemyStatusEffects
  } = useGameStore();

  const { showMessage } = useUIStore();

  const performAttack = useCallback((attacker: Character | Enemy, target: Character | Enemy) => {
    // Calculate effective stats for attacker
    let attackerStr = attacker.str;
    if ('equipment' in attacker) {
      const stats = calculateEffectiveStats(attacker as Character);
      attackerStr = stats.str;
    }

    // Calculate effective stats for target
    let targetDef = target.def;
    if ('equipment' in target) {
      const stats = calculateEffectiveStats(target as Character);
      targetDef = stats.def;
    }

    const damage = Math.max(1, attackerStr - targetDef + Math.floor(Math.random() * 5));
    const newHp = target.hp - damage;

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
    if (!currentEnemy) return;

    const aliveParty = party.filter((c): c is Character => c !== null && c.alive);
    if (aliveParty.length === 0) return;

    // Enemy AI: 40% chance to use ability if available
    const useAbility = currentEnemy.abilities &&
      currentEnemy.abilities.length > 0 &&
      Math.random() < 0.4;

    if (useAbility && currentEnemy.abilities) {
      // Pick a random ability
      const ability = currentEnemy.abilities[Math.floor(Math.random() * currentEnemy.abilities.length)];

      if (ability.damage) {
        // Damage ability - target lowest HP party member
        const target = aliveParty.reduce((lowest, current) =>
          current.hp < lowest.hp ? current : lowest
        );

        const baseDamage = Math.max(1, currentEnemy.str - target.def + Math.floor(Math.random() * 5));
        const abilityDamage = Math.floor(baseDamage * ability.damage);
        const newHp = target.hp - abilityDamage;

        addCombatLog(`${currentEnemy.name} uses ${ability.name} on ${target.name} for ${abilityDamage} damage!`);

        const characterIndex = party.findIndex(c => c && c.name === target.name);
        if (characterIndex >= 0) {
          updatePartyMemberHP(characterIndex, newHp);

          // Apply status effect if ability has one
          if (ability.effect) {
            const newEffects = applyStatusEffect(target, ability.effect);
            applyStatusEffectToPartyMember(characterIndex, newEffects);
            addCombatLog(`${target.name} is ${ability.effect.type}ed!`);
          }

          if (newHp <= 0) {
            addCombatLog(`${target.name} is knocked unconscious!`);
          }
        }
      } else if (ability.heal) {
        // Heal ability - heal self
        const healAmount = ability.heal;
        const newHp = Math.min(currentEnemy.maxHp, currentEnemy.hp + healAmount);
        updateEnemyHP(newHp);
        addCombatLog(`${currentEnemy.name} uses ${ability.name} and heals ${healAmount} HP!`);
      }
    } else {
      // Basic attack on random target
      const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
      performAttack(currentEnemy, target);
    }

    setTimeout(() => {
      console.log('👹 Enemy action complete, checking party status...');
      const stillAlive = party.filter((c): c is Character => c !== null && c.alive);
      console.log('Still alive party members:', stillAlive.length);

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
  }, [currentEnemy, party, performAttack, addCombatLog, showMessage, nextTurn, endCombat, updatePartyMemberHP, updateEnemyHP]);

  const processTurn = useCallback(() => {
    console.log('🎲 PROCESS TURN CALLED');
    const currentParticipant = combatTurnOrder[currentTurn];
    console.log('Processing turn for participant:', {
      index: currentTurn,
      type: currentParticipant?.type,
      name: currentParticipant?.character.name
    });

    if (!currentParticipant) {
      console.log('❌ No participant to process');
      return;
    }

    // Process status effects at start of turn
    const character = currentParticipant.character;
    const statusResult = processStatusEffects(character);

    if (statusResult.message) {
      addCombatLog(statusResult.message);
    }

    // Apply poison damage
    if (statusResult.damage > 0) {
      if (currentParticipant.type === 'party') {
        const characterIndex = currentParticipant.index!;
        const newHp = character.hp - statusResult.damage;
        updatePartyMemberHP(characterIndex, newHp);
      } else if (currentEnemy) {
        const newHp = currentEnemy.hp - statusResult.damage;
        updateEnemyHP(newHp);
      }
    }

    // Update status effect durations
    const updatedEffects = updateStatusEffects(character);
    if (currentParticipant.type === 'party') {
      updatePartyMemberStatusEffects(currentParticipant.index!, updatedEffects);
    } else {
      updateEnemyStatusEffects(updatedEffects);
    }

    // Check for sleep - skip turn if asleep
    if (hasStatusEffect(character, 'sleep')) {
      addCombatLog(`${character.name} is asleep and cannot act!`);
      setTimeout(() => nextTurn(), 1000);
      return;
    }

    if (currentParticipant.type === 'enemy') {
      console.log('👹 Scheduling enemy action in 500ms');
      setTimeout(() => {
        console.log('👹 Executing enemy action now');
        enemyAction();
      }, 500);
    }
    // Player turns are handled by ActionMenu component
  }, [combatTurnOrder, currentTurn, enemyAction, processStatusEffects, updateStatusEffects, hasStatusEffect, addCombatLog, updatePartyMemberHP, updateEnemyHP, updatePartyMemberStatusEffects, updateEnemyStatusEffects, currentEnemy, nextTurn]);

  const handleCombatAction = useCallback((action: string, options?: { abilityId?: string }) => {
    console.log('⚔️ COMBAT ACTION TRIGGERED:', action);
    const currentParticipant = combatTurnOrder[currentTurn];
    console.log('Current participant in action:', {
      index: currentTurn,
      type: currentParticipant?.type,
      name: currentParticipant?.character.name
    });

    if (!currentParticipant || currentParticipant.type === 'enemy') {
      console.log('❌ Action blocked: no participant or enemy turn');
      return;
    }

    const character = currentParticipant.character as Character;
    const characterIndex = currentParticipant.index;
    console.log('Processing action for character:', character.name, 'at index:', characterIndex);

    switch (action) {
      case 'attack':
        if (currentEnemy) {
          performAttack(character, currentEnemy);
        }
        break;
      case 'ability':
        if (options?.abilityId && characterIndex !== undefined) {
          const ability = character.abilities.find(a => a.id === options.abilityId);
          if (ability && character.mp >= ability.mpCost) {
            // Deduct MP cost
            const updatedParty = [...party];
            updatedParty[characterIndex] = {
              ...character,
              mp: character.mp - ability.mpCost
            };
            // Note: This should be handled through proper state management
            // For now, we'll handle the MP deduction in the ability logic below

            // Handle different ability effects
            if (ability.damage && currentEnemy) {
              // Calculate effective stats for ability user
              const stats = calculateEffectiveStats(character);
              const baseDamage = Math.max(1, stats.str - currentEnemy.def + Math.floor(Math.random() * 5));

              // For magic abilities, we might want to use INT/MAG stat if we had one, 
              // but for now we'll use STR or a flat bonus based on the ability type?
              // Actually, let's just use STR for physical and maybe add a magic stat later.
              // For now, abilities scale off STR which is modified by gear.

              const abilityDamage = Math.floor(baseDamage * ability.damage);
              currentEnemy.hp = Math.max(0, currentEnemy.hp - abilityDamage);

              addCombatLog(`${character.name} uses ${ability.name} for ${abilityDamage} damage!`);

              if (currentEnemy.hp <= 0) {
                addCombatLog(`${currentEnemy.name} is defeated!`);
                const loot = generateLoot(currentEnemy.level);
                setTimeout(() => {
                  addCombatLog(`Victory! Gained ${loot.gold} gold!`);
                  if (loot.items.length > 0) {
                    addCombatLog(`Found: ${loot.items.map(i => i.name).join(', ')}`);
                  }
                  endCombat(true, loot);
                }, 1000);
                return;
              }
            }

            if (ability.heal) {
              const healAmount = ability.heal;
              character.hp = Math.min(character.maxHp, character.hp + healAmount);
              addCombatLog(`${character.name} uses ${ability.name} and heals ${healAmount} HP!`);
            }

            if (ability.effect) {
              addCombatLog(`${character.name} uses ${ability.name}!`);
              // Status effects implementation could be added here
            }
          } else {
            addCombatLog(`${character.name} doesn't have enough MP!`);
          }
        }
        break;
      case 'defend':
        addCombatLog(`${character.name} defends!`);
        // Could add temporary defense boost here
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
  }, [combatTurnOrder, currentTurn, currentEnemy, performAttack, addCombatLog, endCombat, nextTurn, generateLoot, party]);

  return {
    handleCombatAction,
    processTurn
  };
};