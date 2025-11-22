import React from 'react';
import { useCombatStore } from '../../stores/useCombatStore';
import { useCombat } from '../../hooks/useCombat';
import { useTurnProcessor } from '../../hooks/useTurnProcessor';
import { usePartyStore } from '../../stores/usePartyStore';
import { CombatHeader } from './CombatHeader';
import { EnemyDisplay } from './EnemyDisplay';
import { CombatLog } from './CombatLog';
import { ActionMenu } from './ActionMenu';
import { CombatVictoryScreen } from './CombatVictoryScreen';

export const CombatInterface: React.FC = () => {
  const { inCombat, combatTurnOrder, currentTurn } = useCombatStore();
  const { processTurn, handleCombatAction } = useCombat();
  const { party } = usePartyStore();

  // Use custom hook to handle turn processing logic
  useTurnProcessor(processTurn);

  const currentParticipant = combatTurnOrder[currentTurn];

  if (!inCombat) return null;

  // Calculate ActionMenu props outside JSX
  let actionMenuProps = null;
  let errorMsg = null;

  if (currentParticipant?.type === 'party' && currentParticipant?.character) {
    const charId = currentParticipant.character.id;
    let charIndex = party.findIndex(p => p?.id === charId);

    if (charIndex === -1) {
      console.warn(`⚠️ Character ID ${charId} not found in party, trying name match...`);
      charIndex = party.findIndex(p => p?.name === currentParticipant.character!.name);
    }

    if (charIndex !== -1) {
      actionMenuProps = {
        characterIndex: charIndex,
        onAction: handleCombatAction
      };
    } else {
      errorMsg = `Character not found: ${currentParticipant.character.name} (${charId})`;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <CombatVictoryScreen />
      <div className="bg-stone-600 rounded-sm shadow-2xl border-4 border-stone-400 w-[95%] max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <CombatHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0">
          <EnemyDisplay />
          <div className="flex flex-col p-4 bg-stone-700 border-l-4 border-stone-500">
            <CombatLog />

            {/* Render ActionMenu if props exist */}
            {actionMenuProps && (
              <div className="mt-4">
                <ActionMenu {...actionMenuProps} />
              </div>
            )}

            {/* Render Error if exists */}
            {errorMsg && (
              <div className="p-4 bg-red-900/50 text-red-200 border border-red-500 rounded mt-4">
                {errorMsg}
              </div>
            )}

            {/* Debug info if no menu and no error but it IS a party turn */}
            {!actionMenuProps && !errorMsg && currentParticipant?.type === 'party' && (
              <div className="text-yellow-400 text-xs mt-2">
                Waiting for character data...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};