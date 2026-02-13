import React, { useState } from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import { feats } from '../../data/feats';
import type { Attribute, Character, Feat } from '../../types';

interface FeatSelectionModalProps {
  characterIndex: number;
  character: Character;
  onClose: () => void;
}

export const FeatSelectionModal: React.FC<FeatSelectionModalProps> = ({
  characterIndex,
  character,
  onClose,
}) => {
  const { selectFeat } = usePartyStore();
  const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);
  const [choice, setChoice] = useState<Attribute | null>(null);

  // Filter available feats
  const availableFeats = feats.filter(feat => {
    // Check if already has feat
    if (character.feats.some(f => f.id === feat.id)) return false;

    // Check prerequisites
    if (feat.prerequisites) {
      if (
        feat.prerequisites.level &&
        character.level < feat.prerequisites.level
      )
        return false;

      if (feat.prerequisites.attributes) {
        const reqAttrs = feat.prerequisites.attributes;
        for (const attr of Object.keys(reqAttrs) as Attribute[]) {
          const required = reqAttrs[attr];
          if (
            typeof required === 'number' &&
            character.attributes[attr] < required
          )
            return false;
        }
      }
    }
    return true;
  });

  const handleConfirm = () => {
    if (selectedFeat) {
      selectFeat(characterIndex, selectedFeat, choice || undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 text-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-cyan-400">
          Select a Feat for {character.name}
        </h2>
        <p className="mb-6 text-gray-400">
          Level {character.level} Reached! Choose a new feat to enhance your
          abilities.
        </p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {availableFeats.map(feat => (
            <div
              key={feat.id}
              onClick={() => {
                setSelectedFeat(feat);
                setChoice(null); // Reset choice
              }}
              className={`p-4 rounded border cursor-pointer transition-all ${selectedFeat?.id === feat.id ? 'border-cyan-500 bg-cyan-900/20 ring-1 ring-cyan-500' : 'border-gray-700 hover:bg-gray-800'}`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-200">{feat.name}</h3>
                {feat.prerequisites && (
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                    Req:{' '}
                    {feat.prerequisites.level
                      ? `Lvl ${feat.prerequisites.level}`
                      : ''}
                    {feat.prerequisites.attributes
                      ? ` ${Object.keys(feat.prerequisites.attributes).join(', ')}`
                      : ''}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">{feat.description}</p>

              {/* Choice UI if selected */}
              {selectedFeat?.id === feat.id &&
                feat.effects.type === 'stat_boost' &&
                (feat.effects.stat === 'ST_or_DX' ||
                  feat.effects.stat === 'INT_WIS_CHA') && (
                  <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-600">
                    <p className="text-sm font-bold mb-2 text-cyan-300">
                      Choose Attribute to Increase:
                    </p>
                    <div className="flex gap-2">
                      {feat.effects.stat === 'ST_or_DX' ? (
                        <>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setChoice('ST');
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${choice === 'ST' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                          >
                            Strength
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setChoice('DX');
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${choice === 'DX' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                          >
                            Dexterity
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setChoice('IT');
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${choice === 'IT' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                          >
                            Intelligence
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setChoice('WD');
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${choice === 'WD' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                          >
                            Wisdom
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setChoice('CH');
                            }}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${choice === 'CH' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                          >
                            Charisma
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
          >
            Decide Later
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              !selectedFeat ||
              (selectedFeat.effects.type === 'stat_boost' &&
                (selectedFeat.effects.stat === 'ST_or_DX' ||
                  selectedFeat.effects.stat === 'INT_WIS_CHA') &&
                !choice)
            }
            className="px-6 py-2 bg-cyan-600 text-white rounded font-medium hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cyan-900/20"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};
