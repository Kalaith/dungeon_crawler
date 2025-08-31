import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useCombat } from '../../hooks/useCombat';
import type { Character } from '../../types';
import { CombatHeader } from './CombatHeader';
import { EnemyDisplay } from './EnemyDisplay';
import { CombatLog } from './CombatLog';
import { ActionMenu } from './ActionMenu';

export const CombatInterface: React.FC = () => {
  const { inCombat, combatTurnOrder, currentTurn, nextTurn } = useGameStore();
  const { processTurn } = useCombat();
  const lastProcessedTurn = useRef<number | null>(null);

  // Process enemy turns automatically and skip unconscious party members
  useEffect(() => {
    console.log('🎨 COMBAT INTERFACE EFFECT TRIGGERED');
    console.log('InCombat:', inCombat);
    console.log('Turn order length:', combatTurnOrder.length);
    console.log('Current turn index:', currentTurn);
    
    if (inCombat && combatTurnOrder.length > 0) {
      const currentParticipant = combatTurnOrder[currentTurn];
      console.log('Current participant:', {
        index: currentTurn,
        type: currentParticipant?.type,
        name: currentParticipant?.character.name,
        alive: currentParticipant?.type === 'party' ? (currentParticipant.character as Character).alive : 'N/A',
        hp: currentParticipant?.character.hp
      });
      
      if (currentParticipant) {
        if (currentParticipant.type === 'enemy') {
          console.log('👹 Processing ENEMY turn');
          
          // Prevent multiple processTurn calls for the same turn
          if (lastProcessedTurn.current === currentTurn) {
            console.log('🚫 BLOCKED: Already processed enemy turn', currentTurn);
            return;
          }
          
          console.log('✅ ALLOWING: Enemy turn', currentTurn, '(last processed:', lastProcessedTurn.current, ')');
          lastProcessedTurn.current = currentTurn;
          processTurn();
        } else {
          // Check if party member is unconscious and skip their turn
          const character = currentParticipant.character as Character;
          console.log('🧑 Processing PARTY member turn:', {
            name: character.name,
            alive: character.alive,
            hp: character.hp
          });
          
          if (!character.alive || character.hp <= 0) {
            console.log('❌ Party member is unconscious, checking if should skip...');
            
            // Check if all party members are unconscious before skipping
            const alivePartyMembers = combatTurnOrder.filter(p => {
              if (p.type === 'party') {
                const char = p.character as Character;
                return char.alive && char.hp > 0;
              }
              return false;
            });
            
            console.log('Alive party members:', alivePartyMembers.length);
            
            if (alivePartyMembers.length === 0) {
              console.log('⚠️ All party members defeated - not skipping');
              return;
            }
            
            console.log('🚀 Skipping unconscious party member in 100ms');
            setTimeout(() => nextTurn(), 100);
          } else {
            console.log('✅ Party member is conscious - waiting for player action');
            // Reset the last processed turn when it's a conscious player's turn
            if (lastProcessedTurn.current !== null) {
              console.log('🔄 Resetting lastProcessedTurn (was:', lastProcessedTurn.current, ')');
              lastProcessedTurn.current = null;
            }
          }
        }
      } else {
        console.log('❌ No current participant found!');
      }
    }
  }, [inCombat, combatTurnOrder, currentTurn, processTurn, nextTurn]);

  if (!inCombat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur">
      <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl shadow-lg border border-gray-400/20 w-[90%] max-w-4xl max-h-[90vh] overflow-hidden">
        <CombatHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 h-96">
          <EnemyDisplay />
          <div className="flex flex-col p-5">
            <CombatLog />
            <ActionMenu />
          </div>
        </div>
      </div>
    </div>
  );
};