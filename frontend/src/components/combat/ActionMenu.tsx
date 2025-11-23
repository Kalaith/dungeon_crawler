import React, { useState } from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import { useCombatStore } from '../../stores/useCombatStore';
import type { Spell } from '../../types';
import { SpellSelector } from './SpellSelector';
import { AbilitySelector } from './AbilitySelector';

interface ActionMenuProps {
  characterIndex: number;
  onAction: (action: 'attack' | 'spell' | 'defend' | 'item' | 'row-switch', data?: unknown) => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ characterIndex, onAction }) => {
  const { party } = usePartyStore();
  const { currentActionEconomy, concentratingCharacterId } = useCombatStore();
  const [showSpellSelector, setShowSpellSelector] = useState(false);
  const [showAbilitySelector, setShowAbilitySelector] = useState(false);

  const character = party[characterIndex];
  if (!character || !character.derivedStats) return null;

  const hasSpells = character.spells && character.spells.length > 0;
  const hasAbilities = character.class.abilities && character.class.abilities.length > 0;
  const currentAP = character.derivedStats.AP.current;
  const isConcentrating = concentratingCharacterId === character.id;

  const handleSpellCast = (spell: Spell) => {
    onAction('spell', { spell });
    setShowSpellSelector(false);
  };

  const handleAbilityUse = (ability: any) => {
    onAction('spell', { abilityId: ability.id });
    setShowAbilitySelector(false);
  };

  return (
    <>
      <div className="bg-etrian-800 rounded-lg p-4 shadow-lg border border-cyan-900/50">
        <div className="flex items-center justify-between mb-4 border-b border-cyan-900/30 pb-2">
          <h4 className="text-lg font-bold text-gold-500">
            {character.name}'s Turn
          </h4>
          <div className="text-sm font-mono text-cyan-400">
            AP: {character.derivedStats.AP.current}/{character.derivedStats.AP.max}
          </div>
        </div>

        {/* Action Economy Display */}
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
          <div className="flex gap-2 justify-center">
            <span className={currentActionEconomy.actionUsed ? 'text-gray-400 line-through' : 'text-green-600 dark:text-green-400 font-semibold'}>
              ⚡ Action
            </span>
            <span className={currentActionEconomy.bonusActionUsed ? 'text-gray-400 line-through' : 'text-blue-600 dark:text-blue-400 font-semibold'}>
              ⭐ Bonus
            </span>
            <span className={currentActionEconomy.movementUsed ? 'text-gray-400 line-through' : 'text-yellow-600 dark:text-yellow-400 font-semibold'}>
              👟 Move
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onAction('attack')}
            disabled={currentActionEconomy.actionUsed}
            className="p-3 bg-red-900/50 border-2 border-red-500 text-red-100 font-bold text-sm uppercase tracking-wider hover:bg-red-800 hover:border-red-400 transition-all active:translate-y-0.5 shadow-md rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⚔️ Attack
          </button>

          {hasSpells && (
            <button
              onClick={() => setShowSpellSelector(true)}
              disabled={currentAP === 0 || currentActionEconomy.actionUsed}
              className="p-3 bg-purple-900/50 border-2 border-purple-500 text-purple-100 font-bold text-sm uppercase tracking-wider hover:bg-purple-800 hover:border-purple-400 transition-all active:translate-y-0.5 shadow-md rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Cast Spell
            </button>
          )}

          {hasAbilities && (
            <button
              onClick={() => setShowAbilitySelector(true)}
              disabled={currentActionEconomy.actionUsed}
              className="p-3 bg-indigo-900/50 border-2 border-indigo-500 text-indigo-100 font-bold text-sm uppercase tracking-wider hover:bg-indigo-800 hover:border-indigo-400 transition-all active:translate-y-0.5 shadow-md rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💫 Ability
            </button>
          )}

          <button
            onClick={() => onAction('defend')}
            disabled={currentActionEconomy.actionUsed}
            className="p-3 bg-blue-900/50 border-2 border-blue-500 text-blue-100 font-bold text-sm uppercase tracking-wider hover:bg-blue-800 hover:border-blue-400 transition-all active:translate-y-0.5 shadow-md rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🛡️ Defend
          </button>

          <button
            onClick={() => onAction('item')}
            disabled={currentActionEconomy.actionUsed}
            className="p-3 bg-green-900/50 border-2 border-green-500 text-green-100 font-bold text-sm uppercase tracking-wider hover:bg-green-800 hover:border-green-400 transition-all active:translate-y-0.5 shadow-md rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎒 Item
          </button>

          <button
            onClick={() => onAction('row-switch')}
            disabled={currentActionEconomy.movementUsed}
            className="p-3 bg-yellow-900/50 border-2 border-yellow-500 text-yellow-100 font-bold text-sm uppercase tracking-wider hover:bg-yellow-800 hover:border-yellow-400 transition-all active:translate-y-0.5 shadow-md rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↔️ Row
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center">
          Position: <span className="font-semibold capitalize">{character.position.row} Row</span>
          {isConcentrating && (
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

      {showAbilitySelector && (
        <AbilitySelector
          abilities={character.class.abilities}
          currentLevel={character.level}
          currentAP={currentAP}
          onSelectAbility={handleAbilityUse}
          onCancel={() => setShowAbilitySelector(false)}
        />
      )}
    </>
  );
};