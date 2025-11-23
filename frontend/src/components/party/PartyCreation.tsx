import React, { useState } from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import { useGameStateStore } from '../../stores/useGameStateStore';
import { useUIStore } from '../../stores/uiStore';
import { CharacterSlot } from './CharacterSlot';
import { CharacterCreationModal } from './CharacterCreationModal';
import { CharacterSheet } from './CharacterSheet';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Character } from '../../types';

export const PartyCreation: React.FC = () => {
  const {
    party,
    canStartAdventure,
    addCharacterToParty,
  } = usePartyStore();
  const { setGameState } = useGameStateStore();

  const {
    isCharacterModalOpen,
    currentSlot,
    openCharacterModal,
    closeCharacterModal
  } = useUIStore();

  const [viewingCharacter, setViewingCharacter] = useState<Character | null>(null);

  const handleStartAdventure = () => {
    setGameState('overworld');
  };

  const handleCreateCharacter = (character: Character) => {
    if (currentSlot >= 0) {
      addCharacterToParty(character, currentSlot);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400/8 to-yellow-400/8 dark:from-blue-400/15 dark:to-yellow-400/15 p-8">
      <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl p-8 shadow-lg border border-gray-400/20 max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold mb-2 text-slate-900 dark:text-gray-200">
            Create Your Party
          </h1>
          <p className="text-slate-500 dark:text-gray-300">
            Choose up to 5 adventurers to explore the dungeon
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {party.map((character, index) => (
            <CharacterSlot
              key={index}
              character={character}
              slotIndex={index}
              onCreateCharacter={openCharacterModal}
              onViewDetails={setViewingCharacter}
            />
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartAdventure}
            disabled={!canStartAdventure()}
          >
            Start Adventure
          </Button>
        </div>
      </div>

      <CharacterCreationModal
        isOpen={isCharacterModalOpen}
        onClose={closeCharacterModal}
        onCreateCharacter={handleCreateCharacter}
      />

      <Modal
        isOpen={!!viewingCharacter}
        onClose={() => setViewingCharacter(null)}
        title="Character Details"
        className="max-w-4xl"
      >
        {viewingCharacter && <CharacterSheet character={viewingCharacter} />}
      </Modal>
    </div>
  );
};