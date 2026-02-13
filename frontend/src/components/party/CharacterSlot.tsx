import React from 'react';
import type { Character } from '../../types';
import { Button } from '../ui/Button';
import { CharacterCard } from '../character/CharacterCard';

interface CharacterSlotProps {
  character: Character | null;
  slotIndex: number;
  onCreateCharacter: (slotIndex: number) => void;
  onViewDetails?: (character: Character) => void;
  onRemoveCharacter?: (slotIndex: number) => void;
}

export const CharacterSlot: React.FC<CharacterSlotProps> = ({
  character,
  slotIndex,
  onCreateCharacter,
  onViewDetails,
  onRemoveCharacter,
}) => {
  if (!character) {
    return (
      <div className="bg-green-400/8 dark:bg-green-400/15 border-2 border-gray-400/20 rounded-lg p-4 min-h-[200px] flex items-center justify-center transition-all hover:border-teal-500 hover:shadow-sm">
        <Button
          variant="outline"
          className="w-full h-full flex-col gap-2 p-4"
          onClick={() => onCreateCharacter(slotIndex)}
        >
          <span className="text-2xl font-normal">+</span>
          Create Character
        </Button>
      </div>
    );
  }

  return (
    <div className="relative group">
      <CharacterCard
        character={character}
        variant="compact"
        onClick={() => onViewDetails?.(character)}
        showBars={false}
        showStats={false}
      />
      {onRemoveCharacter && (
        <button
          onClick={e => {
            e.stopPropagation();
            onRemoveCharacter(slotIndex);
          }}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          title="Remove character"
        >
          ✕
        </button>
      )}
    </div>
  );
};
