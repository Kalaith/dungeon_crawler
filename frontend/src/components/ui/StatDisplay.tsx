import React from 'react';
import { StatBar } from './StatBar';

interface StatDisplayProps {
  label: string;
  current: number;
  max: number;
  showBar?: boolean;
  barColor?: 'health' | 'mana' | 'experience' | 'custom';
  customColor?: string;
  barHeight?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Reusable stat display component that shows a label, current/max values, and optional bar.
 * Commonly used for HP, AP, and XP displays.
 */
export const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  current,
  max,
  showBar = true,
  barColor = 'health',
  customColor,
  barHeight = 'sm',
  className = '',
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600 dark:text-gray-400">{label}</span>
        <span className="font-mono text-slate-900 dark:text-gray-200">
          {current}/{max}
        </span>
      </div>
      {showBar && (
        <StatBar
          current={current}
          max={max}
          color={barColor}
          customColor={customColor}
          height={barHeight}
        />
      )}
    </div>
  );
};
