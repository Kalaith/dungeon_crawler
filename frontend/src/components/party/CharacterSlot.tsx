import React from 'react';
import type { Character } from '../../types';
import { Button } from '../ui/Button';

interface CharacterSlotProps {
  character: Character | null;
  slotIndex: number;
  onCreateCharacter: (slotIndex: number) => void;
}

export const CharacterSlot: React.FC<CharacterSlotProps> = ({
  character,
  slotIndex,
  onCreateCharacter
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
    <div className="bg-green-400/8 dark:bg-green-400/15 border-2 border-gray-400/20 rounded-lg p-4 min-h-[200px] flex items-center justify-center text-center transition-all hover:border-teal-500 hover:shadow-sm hover:-translate-y-0.5">
      <div className="w-full">
        <h4 className="text-lg font-semibold mb-2 text-slate-900 dark:text-gray-200">
          {character.name}
        </h4>
        <div className="text-sm text-slate-500 dark:text-gray-300 mb-3">
          {character.class.name}
        </div>
        <div className="text-xs leading-relaxed text-slate-600 dark:text-gray-400">
          HP: {character.hp}/{character.maxHp}<br />
          MP: {character.mp}/{character.maxMp}<br />
          STR: {character.str} DEF: {character.def}<br />
          AGI: {character.agi} LUC: {character.luc}
        </div>
      </div>
    </div>
  );
};