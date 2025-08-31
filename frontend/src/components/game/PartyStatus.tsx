import React from 'react';
import { useGameStore } from '../../stores/gameStore';

export const PartyStatus: React.FC = () => {
  const { party } = useGameStore();

  const partyMembers = party.filter(character => character !== null);

  if (partyMembers.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-cream-100 dark:bg-charcoal-800 rounded-lg border border-gray-400/20">
      <h4 className="text-base font-medium mb-3 text-slate-900 dark:text-gray-200 text-center">
        Party Status
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {partyMembers.map((character, index) => {
          if (!character) return null;

          const healthPercent = (character.hp / character.maxHp) * 100;
          const manaPercent = (character.mp / character.maxMp) * 100;

          return (
            <div
              key={index}
              className={`bg-purple-400/8 dark:bg-purple-400/15 border border-gray-400/20 rounded-lg p-3 ${
                !character.alive ? 'opacity-50' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-slate-900 dark:text-gray-200 text-sm">
                  {character.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-300">
                  {character.class.name}
                </div>
              </div>

              {/* Health Bar */}
              <div className="h-2 bg-gray-400/15 dark:bg-gray-400/15 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-green-400 transition-all duration-300"
                  style={{ width: `${healthPercent}%` }}
                />
              </div>

              {/* Mana Bar */}
              <div className="h-2 bg-gray-400/15 dark:bg-gray-400/15 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-teal-600 to-teal-300 transition-all duration-300"
                  style={{ width: `${manaPercent}%` }}
                />
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>HP: {character.hp}/{character.maxHp}</span>
                  <span>MP: {character.mp}/{character.maxMp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level: {character.level}</span>
                  <span>Gold: {character.gold}</span>
                </div>
                <div className="flex justify-between">
                  <span>EXP: {character.exp}</span>
                  <span>Next: {character.expToNext}</span>
                </div>
                {character.abilities.length > 0 && (
                  <div className="text-center pt-1 border-t border-gray-400/20">
                    <span className="text-xs text-slate-500 dark:text-gray-300">
                      {character.abilities.length} abilities
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};