import React from 'react';
import { useCombatStore } from '../../stores/useCombatStore';
import { useCombat } from '../../hooks/useCombat';
import { useTurnProcessor } from '../../hooks/useTurnProcessor';
import { usePartyStore } from '../../stores/usePartyStore';
import { CombatHeader } from './CombatHeader';
import { EnemyDisplay } from './EnemyDisplay';
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
      console.warn(
        `⚠️ Character ID ${charId} not found in party, trying name match...`
      );
      charIndex = party.findIndex(
        p => p?.name === currentParticipant.character!.name
      );
    }

    if (charIndex !== -1) {
      actionMenuProps = {
        characterIndex: charIndex,
        onAction: handleCombatAction,
      };
    } else {
      errorMsg = `Character not found: ${currentParticipant.character.name} (${charId})`;
    }
  }

  return (
    <div className="h-full w-full flex flex-col relative">
      <CombatVictoryScreen />

      {/* Combat Header / Turn Order */}
      <div className="shrink-0">
        <CombatHeader />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto">
        {/* Left: Enemy Display */}
        <div className="h-full">
          <EnemyDisplay />
        </div>

        {/* Right: Action Menu & Status */}
        <div className="flex flex-col h-full">
          {/* ActionMenu handles its own container styling */}
          {actionMenuProps ? (
            <ActionMenu {...actionMenuProps} />
          ) : (
            /* Waiting State / Error */
            <div className="bg-etrian-800/80 border border-cyan-900 p-4 rounded text-cyan-400">
              {errorMsg ? (
                <div className="text-red-400">{errorMsg}</div>
              ) : (
                currentParticipant?.type === 'party' && (
                  <div className="text-yellow-400 animate-pulse">
                    Waiting for character input...
                  </div>
                )
              )}
              {!currentParticipant && (
                <div className="text-gray-500">Processing turn...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
