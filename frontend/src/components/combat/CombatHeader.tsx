import React from 'react';
import { useGameStore } from '../../stores/gameStore';

export const CombatHeader: React.FC = () => {
  const { combatTurnOrder, currentTurn } = useGameStore();

  return (
    <div className="bg-red-400/8 dark:bg-red-400/15 p-4 border-b border-gray-400/20 text-center">
      <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-gray-200">
        Combat!
      </h3>
      <div className="flex justify-center gap-2 flex-wrap">
        {combatTurnOrder.map((participant, index) => (
          <div
            key={index}
            className={`px-2 py-1 rounded text-xs font-medium ${
              index === currentTurn
                ? 'bg-teal-500 text-cream-50'
                : 'bg-gray-400/15 text-slate-900 dark:text-gray-200'
            }`}
          >
            {participant.character.name}
          </div>
        ))}
      </div>
    </div>
  );
};