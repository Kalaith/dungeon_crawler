import React from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import { CharacterCard } from '../character/CharacterCard';

export const PartyStatus: React.FC = () => {
  const { party } = usePartyStore();

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

          return (
            <CharacterCard
              key={index}
              character={character}
              variant="detailed"
              showBars={true}
              showStats={true}
              showAbilityCount={true}
            />
          );
        })}
      </div>
    </div>
  );
};