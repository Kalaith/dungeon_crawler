import React from 'react';
import { useGoldStore } from '../../stores/useGoldStore';

interface GoldDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GoldDisplay: React.FC<GoldDisplayProps> = ({ size = 'md', className = '' }) => {
  const { gold } = useGoldStore();

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg font-semibold text-yellow-800 dark:text-yellow-200 ${sizeClasses[size]} ${className}`}
    >
      <span>💰</span>
      <span>{gold} Gold</span>
    </div>
  );
};
