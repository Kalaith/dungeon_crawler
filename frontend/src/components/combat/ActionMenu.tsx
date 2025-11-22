import React, { useState } from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import type { Spell } from '../../types';
import { SpellSelector } from './SpellSelector';

interface ActionMenuProps {
  characterIndex: number;
  onAction: (action: 'attack' | 'spell' | 'defend' | 'item' | 'row-switch', data?: unknown) => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ characterIndex, onAction }) => {
  const { party } = usePartyStore();
  const [showSpellSelector, setShowSpellSelector] = useState(false);
  const [showAbilities, setShowAbilities] = useState(false);

  const character = party[characterIndex];
  if (!character) return null;

  const hasSpells = character.spells && character.spells.length > 0;
  const hasAbilities = character.class.abilities && character.class.abilities.length > 0;
  const currentAP = character.derivedStats.AP.current;

  const handleSpellCast = (spell: Spell) => {
    onAction('spell', { spell });
    setShowSpellSelector(false);
  };

  const handleAbilityUse = (abilityId: string) => {
    onAction('spell', { abilityId });
    setShowAbilities(false);
  };

  if (showAbilities) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Choose Ability
          </h4>
          <button
            onClick={() => setShowAbilities(false)}
            className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Back
          </button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {character.class.abilities
            .filter(ability => ability.level <= character.level)
            .map((ability) => {
              const apCost = ability.cost?.AP || 0;
              const canUse = currentAP >= apCost;

              return (
                <button
                  key={ability.id}
                  onClick={() => canUse && handleAbilityUse(ability.id)}
                  disabled={!canUse}
                  className={`w-full text-left p-3 rounded border transition-all ${canUse
                    ? 'border-indigo-300 bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600'
                    : 'border-gray-200 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{ability.name}</span>
                    {apCost > 0 && (
                      <span className={`text-sm font-semibold ${canUse ? 'text-indigo-600' : 'text-gray-400'}`}>
                        {apCost} AP
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{ability.description}</p>
                </button>
              );
            })}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            {character.name}'s Turn
          </h4>
          <div className="text-sm font-mono text-indigo-600 dark:text-indigo-400">
            AP: {character.derivedStats.AP.current}/{character.derivedStats.AP.max}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onAction('attack')}
            className="p-3 bg-red-600 border-2 border-red-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-red-500 hover:border-red-400 transition-all active:translate-y-0.5 shadow-md rounded"
          >
            ⚔️ Attack
          </button>

          {hasSpells && (
            <button
              onClick={() => setShowSpellSelector(true)}
              disabled={currentAP === 0}
              className="p-3 bg-purple-600 border-2 border-purple-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-purple-500 hover:border-purple-400 transition-all active:translate-y-0.5 shadow-md rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Cast Spell
            </button>
          )}

          {hasAbilities && (
            <button
              onClick={() => setShowAbilities(true)}
              className="p-3 bg-indigo-600 border-2 border-indigo-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-indigo-500 hover:border-indigo-400 transition-all active:translate-y-0.5 shadow-md rounded"
            >
              💫 Ability
            </button>
          )}

          <button
            onClick={() => onAction('defend')}
            className="p-3 bg-blue-600 border-2 border-blue-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-500 hover:border-blue-400 transition-all active:translate-y-0.5 shadow-md rounded"
          >
            🛡️ Defend
          </button>

          <button
            onClick={() => onAction('item')}
            className="p-3 bg-green-600 border-2 border-green-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-green-500 hover:border-green-400 transition-all active:translate-y-0.5 shadow-md rounded"
          >
            🎒 Item
          </button>

          <button
            onClick={() => onAction('row-switch')}
            className="p-3 bg-yellow-600 border-2 border-yellow-500 text-white font-bold text-sm uppercase tracking-wider hover:bg-yellow-500 hover:border-yellow-400 transition-all active:translate-y-0.5 shadow-md rounded"
          >
            ↔️ Row
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center">
          Position: <span className="font-semibold capitalize">{character.position.row} Row</span>
          {character.concentratingOn && (
            <span className="ml-2 text-yellow-600 dark:text-yellow-400">
              ⚠️ Concentrating
            </span>
          )}
        </div>
      </div>

      {showSpellSelector && (
        <SpellSelector
          spells={character.spells}
          currentAP={currentAP}
          onSelectSpell={handleSpellCast}
          onCancel={() => setShowSpellSelector(false)}
        />
      )}
    </>
  );
};