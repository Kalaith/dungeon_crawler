import React from 'react';
import { useCombatStore } from '../../stores/useCombatStore';

export const CombatHeader: React.FC = () => {
  const { combatTurnOrder, currentTurn } = useCombatStore();

  return (
    <div className="bg-stone-700 p-4 border-b-4 border-stone-500 text-center">
      <h3 className="text-xl font-bold mb-3 text-blood-500 tracking-widest uppercase" style={{ textShadow: '1px 1px 0 #000' }}>
        ⚔️ Combat ⚔️
      </h3>
      <div className="flex justify-center gap-2 flex-wrap">
        {combatTurnOrder.map((participant, index) => {
          const name = participant.type === 'party'
            ? participant.character?.name
            : participant.enemy?.name;

          return (
            <div
              key={index}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold border-2 ${index === currentTurn
                ? 'bg-gold-500 border-gold-600 text-stone-700'
                : 'bg-stone-600 border-stone-500 text-stone-400'
                }`}
            >
              {name || 'Unknown'}
            </div>
          );
        })}
      </div>
    </div>
  );
};