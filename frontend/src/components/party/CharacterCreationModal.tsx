import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import type { Character, CharacterClass } from '../../types';
import { gameData } from '../../data/gameData';

interface CharacterCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCharacter: (character: Character) => void;
}

export const CharacterCreationModal: React.FC<CharacterCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateCharacter
}) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  const isValid = name.trim().length > 0 && selectedClass !== null;

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSelectedClass(null);
    }
  }, [isOpen]);

  const handleClassChange = (className: string) => {
    const characterClass = gameData.party_system.character_classes.find(c => c.name === className);
    setSelectedClass(characterClass || null);
  };

  const handleSubmit = () => {
    if (!isValid || !selectedClass) return;

    const character: Character = {
      name: name.trim(),
      class: selectedClass,
      level: 1,
      exp: 0,
      expToNext: 120, // Level 2 requirement
      hp: selectedClass.base_stats.hp,
      maxHp: selectedClass.base_stats.hp,
      mp: selectedClass.base_stats.mp,
      maxMp: selectedClass.base_stats.mp,
      str: selectedClass.base_stats.str,
      def: selectedClass.base_stats.def,
      agi: selectedClass.base_stats.agi,
      luc: selectedClass.base_stats.luc,
      alive: true,
      gold: 50, // Starting gold
      equipment: {}, // No starting equipment
      abilities: selectedClass.abilities.filter(a => a.unlockLevel <= 1), // Level 1 abilities
      statusEffects: [] // No starting status effects
    };

    onCreateCharacter(character);
    onClose();
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
        Create Character
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Character"
      footer={footer}
    >
      <div className="space-y-4">
        <Input
          label="Character Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter character name"
          maxLength={12}
          autoFocus
        />

        <Select
          label="Character Class"
          value={selectedClass?.name || ''}
          onChange={(e) => handleClassChange(e.target.value)}
        >
          <option value="">Select a class...</option>
          {gameData.party_system.character_classes.map((characterClass) => (
            <option key={characterClass.name} value={characterClass.name}>
              {characterClass.name} - {characterClass.description}
            </option>
          ))}
        </Select>

        {selectedClass && (
          <div className="mt-4 p-4 bg-red-400/8 dark:bg-red-400/15 border border-gray-400/20 rounded-lg">
            <h4 className="text-base font-medium mb-3 text-slate-900 dark:text-gray-200">
              Base Stats
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(selectedClass.base_stats).map(([stat, value]) => (
                <div key={stat} className="flex justify-between items-center px-2 py-1.5 bg-cream-100 dark:bg-charcoal-800 rounded-md text-sm">
                  <span className="font-medium text-slate-500 dark:text-gray-300 uppercase">
                    {stat}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-gray-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};