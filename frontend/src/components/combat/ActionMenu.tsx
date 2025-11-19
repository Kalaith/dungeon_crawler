import React, { useState } from 'react';
import { useCombatStore } from '../../stores/useCombatStore';
import { useCombat } from '../../hooks/useCombat';
import { Button } from '../ui/Button';
import type { Character } from '../../types';

export const ActionMenu: React.FC = () => {
  const { combatTurnOrder, currentTurn } = useCombatStore();
  const { handleCombatAction } = useCombat();
  const [showingAbilities, setShowingAbilities] = useState(false);

  const currentParticipant = combatTurnOrder[currentTurn];

  if (!currentParticipant || currentParticipant.type === 'enemy') {
    return null;
  }

  const character = currentParticipant.character as Character;
  const availableAbilities = character.abilities.filter(ability =>
    character.mp >= ability.mpCost
  );

  if (showingAbilities) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-medium text-slate-900 dark:text-gray-200">
            Choose Ability
          </h4>
          <Button
            variant="outline"
            onClick={() => setShowingAbilities(false)}
            className="text-xs px-2 py-1"
          >
            Back
          </Button>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {availableAbilities.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-gray-400 text-center">
              No abilities available (insufficient MP)
            </p>
          ) : (
            availableAbilities.map((ability) => (
              <Button
                key={ability.id}
                variant="secondary"
                onClick={() => {
                  handleCombatAction('ability', { abilityId: ability.id });
                  setShowingAbilities(false);
                }}
                className="w-full text-left text-sm font-medium justify-start"
                title={`${ability.description} (MP: ${ability.mpCost})`}
              >
                <div className="flex justify-between items-center w-full">
                  <span>{ability.name}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400">
                    {ability.mpCost} MP
                  </span>
                </div>
              </Button>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 border-b-2 border-stone-500 pb-1">
        <h4 className="text-base font-bold text-gold-500 tracking-wide">
          {character.name}'s Turn
        </h4>
        <div className="text-xs font-mono text-mana-500">
          MP: {character.mp}/{character.maxMp}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleCombatAction('attack')}
          className="p-3 bg-stone-600 border-2 border-stone-400 text-parchment-100 font-bold text-sm uppercase tracking-wider hover:bg-stone-500 hover:border-gold-500 hover:text-gold-400 transition-colors active:translate-y-0.5 shadow-md"
        >
          ⚔️ Attack
        </button>
        <button
          onClick={() => setShowingAbilities(true)}
          disabled={availableAbilities.length === 0}
          className="p-3 bg-stone-600 border-2 border-stone-400 text-parchment-100 font-bold text-sm uppercase tracking-wider hover:bg-stone-500 hover:border-gold-500 hover:text-gold-400 transition-colors active:translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          title={availableAbilities.length === 0 ? "No abilities available" : "Use special abilities"}
        >
          ✨ Magic
        </button>
        <button
          onClick={() => handleCombatAction('defend')}
          className="p-3 bg-stone-600 border-2 border-stone-400 text-parchment-100 font-bold text-sm uppercase tracking-wider hover:bg-stone-500 hover:border-gold-500 hover:text-gold-400 transition-colors active:translate-y-0.5 shadow-md"
        >
          🛡️ Defend
        </button>
        <button
          onClick={() => handleCombatAction('escape')}
          className="p-3 bg-stone-600 border-2 border-stone-400 text-parchment-100 font-bold text-sm uppercase tracking-wider hover:bg-stone-500 hover:border-gold-500 hover:text-gold-400 transition-colors active:translate-y-0.5 shadow-md"
        >
          🏃 Flee
        </button>
      </div>
    </div>
  );
};