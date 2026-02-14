import React, { useEffect, useRef } from 'react';
import { useCombatStore } from '../../stores/useCombatStore';

export const CombatLog: React.FC = () => {
  const { combatLog } = useCombatStore();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combatLog]);

  return (
    <div
      ref={logRef}
      className="flex-1 bg-blue-400/8 dark:bg-blue-400/15 border border-gray-400/20 rounded p-3 mb-4 text-sm font-mono overflow-y-auto max-h-48"
    >
      {combatLog.map((entry, index) => (
        <div key={index} className="mb-2 text-slate-900 dark:text-gray-200 last:mb-0">
          {entry}
        </div>
      ))}
    </div>
  );
};
