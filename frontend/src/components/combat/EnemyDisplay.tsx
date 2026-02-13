import React from 'react';
import { useCombatStore } from '../../stores/useCombatStore';
import { StatBar } from '../ui/StatBar';

export const EnemyDisplay: React.FC = () => {
  const { currentEnemy } = useCombatStore();

  if (!currentEnemy) return null;

  return (
    <div className="flex items-center justify-center p-5 bg-orange-400/8 dark:bg-orange-400/15 border-r border-gray-400/20 md:border-r-0 md:border-b md:border-b-gray-400/20">
      <div className="text-center text-slate-900 dark:text-gray-200">
        <div className="mb-4">
          <div className="text-lg font-semibold mb-2">{currentEnemy.name}</div>
          <StatBar
            current={currentEnemy.hp}
            max={currentEnemy.maxHp}
            color="custom"
            customColor="#f87171"
            height="md"
            className="mb-2 min-w-[150px]"
          />
          <div className="text-sm">
            HP: {currentEnemy.hp}/{currentEnemy.maxHp}
          </div>
        </div>
      </div>
    </div>
  );
};
