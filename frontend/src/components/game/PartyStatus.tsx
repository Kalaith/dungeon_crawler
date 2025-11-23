import React, { useState } from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import { CharacterCard } from '../character/CharacterCard';
import { CharacterSheetModal } from '../party/CharacterSheetModal';

export const PartyStatus: React.FC = () => {
  const { party } = usePartyStore();
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<number | null>(null);

  const partyMembers = party.filter(character => character !== null);

  if (partyMembers.length === 0) {
    return null;
  }

  const selectedCharacter = selectedCharacterIndex !== null ? party[selectedCharacterIndex] : null;

  return (
    <>
      <div className="h-full w-full overflow-hidden">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 h-full overflow-x-auto md:overflow-y-auto md:overflow-x-hidden pb-2 md:pb-0 snap-x">
          {party.map((character, index) => {
            if (!character) return null;

            return (
              <div key={index} className="min-w-[160px] md:min-w-0 h-full snap-center">
                <CharacterCard
                  character={character}
                  variant="detailed"
                  showBars={true}
                  showStats={true}
                  showAbilityCount={true}
                  className="h-full"
                  onClick={() => setSelectedCharacterIndex(index)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {selectedCharacter && (
        <CharacterSheetModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacterIndex(null)}
        />
      )}
    </>
  );
};