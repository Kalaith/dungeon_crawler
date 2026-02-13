import React from 'react';

interface TurnOrderBadgeProps {
  name: string;
  isActive: boolean;
  className?: string;
}

/**
 * Reusable badge component for displaying turn order in combat.
 * Extracted from CombatHeader to promote reusability.
 */
export const TurnOrderBadge: React.FC<TurnOrderBadgeProps> = ({
  name,
  isActive,
  className = '',
}) => {
  return (
    <div
      className={`px-3 py-1.5 rounded-sm text-xs font-bold border-2 ${
        isActive
          ? 'bg-gold-500 border-gold-600 text-stone-700'
          : 'bg-stone-600 border-stone-500 text-stone-400'
      } ${className}`}
    >
      {name}
    </div>
  );
};
