import React from 'react';
import { Modal } from '../ui/Modal';
import { CharacterCreationWizard } from './CharacterCreationWizard';
import type { Character } from '../../types';

interface CharacterCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCharacter: (character: Character) => void;
}

export const CharacterCreationModal: React.FC<CharacterCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateCharacter,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Character" className="max-w-4xl">
      <CharacterCreationWizard
        onFinish={character => {
          onCreateCharacter(character);
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
};
