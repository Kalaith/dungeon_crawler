import React from 'react';

interface StatBarProps {
  current: number;
  max: number;
  color?: 'health' | 'mana' | 'experience' | 'custom';
  customColor?: string;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

/**
 * Reusable stat bar component for displaying HP, AP, XP, etc.
 * Replaces duplicated bar implementations across the codebase.
 */
export const StatBar: React.FC<StatBarProps> = ({
  current,
  max,
  color = 'health',
  customColor,
  height = 'md',
  showLabel = false,
  label,
  className = '',
}) => {
  const percent = Math.min(100, Math.max(0, (current / max) * 100));

  const colorClasses = {
    health: 'bg-gradient-to-r from-red-400 to-green-400',
    mana: 'bg-gradient-to-r from-teal-600 to-teal-300',
    experience: 'bg-gradient-to-r from-blue-400 to-purple-400',
    custom: customColor || 'bg-blue-400',
  };

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={className}>
      {showLabel && label && (
        <div className="text-xs mb-1 text-slate-600 dark:text-gray-400">{label}</div>
      )}
      <div
        className={`bg-gray-400/15 dark:bg-gray-400/15 rounded-full overflow-hidden ${heightClasses[height]}`}
      >
        <div
          className={`h-full transition-all duration-300 ${color === 'custom' ? '' : colorClasses[color]}`}
          style={{
            width: `${percent}%`,
            ...(color === 'custom' && customColor ? { backgroundColor: customColor } : {}),
          }}
        />
      </div>
    </div>
  );
};
