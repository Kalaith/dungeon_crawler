import React, { useState, useEffect } from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import type { Character } from '../../types';
import { createCharacterFromWizardData } from '../../utils/characterCreation';
import { races } from '../../data/races';
import { characterClasses } from '../../data/classes';
import { Button } from '../ui/Button';

interface TavernServiceProps {
  onClose: () => void;
}

// Helper to generate random character data
const generateRandomCharacter = (): Character => {
  const names = [
    'Aldric',
    'Brenna',
    'Cedric',
    'Diana',
    'Erik',
    'Fiona',
    'Gareth',
    'Helena',
    'Ivan',
    'Jade',
    'Kael',
    'Luna',
    'Magnus',
    'Nora',
    'Orin',
    'Petra',
    'Quinn',
    'Raven',
    'Silas',
    'Thea',
    'Ulric',
    'Vera',
    'Wyatt',
    'Xara',
  ];

  // Pick random race and class from available options
  const simpleRaces = races.filter(r => ['human', 'dwarf', 'halfling', 'green_elf'].includes(r.id));
  const simpleClasses = characterClasses.filter(c =>
    ['warrior', 'wizard', 'rogue', 'cleric'].includes(c.id)
  );

  const randomRace = simpleRaces[Math.floor(Math.random() * simpleRaces.length)] || races[0];
  const randomClass =
    simpleClasses[Math.floor(Math.random() * simpleClasses.length)] || characterClasses[0];
  const randomName = names[Math.floor(Math.random() * names.length)] || 'Adventurer';

  // Generate random attributes (8-14 range for balanced characters)
  const generateRandomStat = () => Math.floor(Math.random() * 7) + 8;

  const wizardData = {
    name: randomName,
    selectedRace: randomRace,
    selectedClass: randomClass,
    attributes: {
      ST: generateRandomStat(),
      CO: generateRandomStat(),
      DX: generateRandomStat(),
      AG: generateRandomStat(),
      IT: generateRandomStat(),
      IN: generateRandomStat(),
      WD: generateRandomStat(),
      CH: generateRandomStat(),
    },
    negativeAttributes: {
      SN: 2,
      AC: 2,
      CL: 2,
      AV: 2,
      NE: 2,
      CU: 2,
      VT: 2,
    },
    selectedSkills: [],
    selectedFeats: [],
    selectedBackground: 'soldier',
    selectedDeity: 'none',
    portrait: '👤',
  };

  return createCharacterFromWizardData(wizardData);
};

export const TavernService: React.FC<TavernServiceProps> = ({ onClose }) => {
  const { party, addCharacterToParty } = usePartyStore();
  const [availableCharacters, setAvailableCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  // Generate 3 random characters on mount and when refreshing
  useEffect(() => {
    refreshCharacters();
  }, []);

  const refreshCharacters = () => {
    const characters = [
      generateRandomCharacter(),
      generateRandomCharacter(),
      generateRandomCharacter(),
    ];
    setAvailableCharacters(characters);
    setSelectedCharacter(null);
  };

  const handleHire = (character: Character) => {
    // Find first empty slot
    const emptySlotIndex = party.findIndex(c => c === null);

    if (emptySlotIndex === -1) {
      alert('Your party is full! Dismiss a member first.');
      return;
    }

    addCharacterToParty(character, emptySlotIndex);

    // Remove hired character from available list
    setAvailableCharacters(prev => prev.filter(c => c.id !== character.id));
    setSelectedCharacter(null);
  };

  const partyCount = party.filter(c => c !== null).length;
  const isPartyFull = partyCount >= 6;

  const getPortraitEmoji = (raceId: string) => {
    switch (raceId) {
      case 'green_elf':
        return '🧝';
      case 'dwarf':
        return '🧔';
      case 'halfling':
        return '🧒';
      default:
        return '👤';
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-etrian-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍺</div>
          <h1 className="text-4xl font-bold text-gold-500 mb-2">The Adventurer's Tavern</h1>
          <p className="text-lg text-cyan-100">Recruit brave souls to join your party</p>
        </div>

        {/* Party Status */}
        <div className="bg-etrian-800 rounded-lg p-4 mb-6 border border-cyan-900/50">
          <p className="text-sm text-cyan-100 text-center">
            <strong>Current Party:</strong> {partyCount}/6 members
            {isPartyFull && ' (Party is full!)'}
          </p>
        </div>

        {/* Available Characters */}
        <div className="bg-etrian-800 rounded-xl p-8 shadow-lg border border-cyan-900/50 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gold-500">Available Adventurers</h2>
            <Button
              variant="outline"
              onClick={refreshCharacters}
              disabled={availableCharacters.length === 0}
            >
              🔄 New Faces
            </Button>
          </div>

          {availableCharacters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cyan-400 mb-4">
                All adventurers have been hired! Check back later.
              </p>
              <Button variant="primary" onClick={refreshCharacters}>
                Look for More Adventurers
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableCharacters.map(character => (
                <div
                  key={character.id}
                  className={`bg-etrian-700 rounded-lg p-6 border-2 transition-all cursor-pointer ${
                    selectedCharacter?.id === character.id
                      ? 'border-cyan-500 shadow-lg shadow-cyan-500/20'
                      : 'border-cyan-900/30 hover:border-cyan-400'
                  }`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  {/* Character Portrait */}
                  <div className="text-6xl text-center mb-4">
                    {getPortraitEmoji(character.race.id)}
                  </div>

                  {/* Character Info */}
                  <h3 className="text-xl font-bold text-gold-500 text-center mb-2">
                    {character.name}
                  </h3>
                  <p className="text-sm text-cyan-100 text-center mb-4">
                    {character.race.name} {character.class.name}
                  </p>

                  {/* Stats Preview */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="bg-red-900/30 rounded p-2 border border-red-500/30">
                      <p className="text-red-400">HP: {character.derivedStats.HP.max}</p>
                    </div>
                    <div className="bg-blue-900/30 rounded p-2 border border-blue-500/30">
                      <p className="text-blue-400">AP: {character.derivedStats.AP.max}</p>
                    </div>
                    <div className="bg-green-900/30 rounded p-2 border border-green-500/30">
                      <p className="text-green-400">AC: {character.derivedStats.AC}</p>
                    </div>
                    <div className="bg-purple-900/30 rounded p-2 border border-purple-500/30">
                      <p className="text-purple-400">Init: +{character.derivedStats.Initiative}</p>
                    </div>
                  </div>

                  {/* Hire Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      handleHire(character);
                    }}
                    disabled={isPartyFull}
                    className="w-full"
                  >
                    {isPartyFull ? 'Party Full' : 'Hire (Free)'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Character Details (if selected) */}
        {selectedCharacter && (
          <div className="bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50 mb-6">
            <h3 className="text-xl font-semibold text-gold-500 mb-4">
              Character Details: {selectedCharacter.name}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-cyan-400">Strength</p>
                <p className="font-semibold text-cyan-100">{selectedCharacter.attributes.ST}</p>
              </div>
              <div>
                <p className="text-cyan-400">Constitution</p>
                <p className="font-semibold text-cyan-100">{selectedCharacter.attributes.CO}</p>
              </div>
              <div>
                <p className="text-cyan-400">Dexterity</p>
                <p className="font-semibold text-cyan-100">{selectedCharacter.attributes.DX}</p>
              </div>
              <div>
                <p className="text-cyan-400">Agility</p>
                <p className="font-semibold text-cyan-100">{selectedCharacter.attributes.AG}</p>
              </div>
              <div>
                <p className="text-cyan-400">Intelligence</p>
                <p className="font-semibold text-cyan-100">{selectedCharacter.attributes.IT}</p>
              </div>
              <div>
                <p className="text-cyan-400">Intuition</p>
                <p className="font-semibold text-cyan-100">{selectedCharacter.attributes.IN}</p>
              </div>
              <div>
                <p className="text-cyan-400">Wisdom</p>
                <p className="font-semibold text-cyan-100">{selectedCharacter.attributes.WD}</p>
              </div>
              <div>
                <p className="text-cyan-400">Charisma</p>
                <p className="font-semibold text-cyan-100">{selectedCharacter.attributes.CH}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={onClose}>
            ← Back to Town
          </Button>
        </div>
      </div>
    </div>
  );
};
