import React from 'react';
import { useGameStore } from '../../stores/gameStore';

export const EnemyDisplay: React.FC = () => {
  const { currentEnemy } = useGameStore();

  if (!currentEnemy) return null;

  const healthPercent = (currentEnemy.hp / currentEnemy.maxHp) * 100;

  return (
    <div className="flex items-center justify-center p-5 bg-orange-400/8 dark:bg-orange-400/15 border-r border-gray-400/20 md:border-r-0 md:border-b md:border-b-gray-400/20">
      <div className="text-center text-slate-900 dark:text-gray-200">
        <div className="mb-4">
          <div className="text-lg font-semibold mb-2">
            {currentEnemy.name}
          </div>
          <div className="bg-gray-400/15 h-3 rounded-full overflow-hidden mb-2 min-w-[150px]">
            <div
              className="h-full bg-red-400 transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
          <div className="text-sm">
            HP: {currentEnemy.hp}/{currentEnemy.maxHp}
          </div>
        </div>
      </div>
    </div>
  );
};