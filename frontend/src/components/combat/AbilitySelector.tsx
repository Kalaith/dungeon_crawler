import React from 'react';
import type { ClassAbility } from '../../types';

interface AbilitySelectorProps {
  abilities: ClassAbility[];
  currentLevel: number;
  currentAP: number;
  onSelectAbility: (ability: ClassAbility) => void;
  onCancel: () => void;
}

/**
 * Ability selector component for choosing class abilities in combat.
 * Mirrors the structure of SpellSelector for consistency.
 * Extracted from ActionMenu to promote reusability.
 */
export const AbilitySelector: React.FC<AbilitySelectorProps> = ({
  abilities,
  currentLevel,
  currentAP,
  onSelectAbility,
  onCancel,
}) => {
  // Filter abilities available at current level
  const availableAbilities = abilities.filter(
    ability => ability.level <= currentLevel
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Use Ability
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Available AP:{' '}
            <span className="font-bold text-indigo-600">{currentAP}</span>
          </p>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {availableAbilities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No abilities available at your level
            </p>
          ) : (
            <div className="space-y-2">
              {availableAbilities.map(ability => {
                const apCost = ability.cost?.AP || 0;
                const canUse = currentAP >= apCost;

                return (
                  <button
                    key={ability.id}
                    onClick={() => canUse && onSelectAbility(ability)}
                    disabled={!canUse}
                    className={`w-full text-left p-3 rounded border transition-all ${
                      canUse
                        ? 'border-indigo-300 bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 cursor-pointer'
                        : 'border-gray-200 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`font-bold ${canUse ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}
                      >
                        {ability.name}
                      </span>
                      {apCost > 0 && (
                        <span
                          className={`text-sm font-semibold ${canUse ? 'text-indigo-600' : 'text-gray-400'}`}
                        >
                          {apCost} AP
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ability.description}
                    </p>
                    {ability.level > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        Requires Level {ability.level}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
