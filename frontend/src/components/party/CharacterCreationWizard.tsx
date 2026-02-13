
import React from 'react';
import { useCharacterCreationStore } from '../../stores/useCharacterCreationStore';
import { races } from '../../data/races';
import { characterClasses } from '../../data/classes';
import { feats } from '../../data/feats';
import type { Attribute, Character } from '../../types';
import { AttributeGrid } from '../character/AttributeGrid';
import { createCharacterFromWizardData } from '../../utils/characterCreation';

interface CharacterCreationWizardProps {
  onFinish: (character: Character) => void;
  onCancel: () => void;
}

export const CharacterCreationWizard: React.FC<
  CharacterCreationWizardProps
> = ({ onFinish, onCancel }) => {
  const store = useCharacterCreationStore();

  const handleNext = () => {
    if (store.step === 6) {
      handleFinish();
    } else {
      store.setStep(store.step + 1);
    }
  };

  const handleFinish = () => {
    if (!store.selectedRace || !store.selectedClass) return;

    try {
      const newCharacter = createCharacterFromWizardData(store);
      onFinish(newCharacter);
      store.reset();
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  const handleBack = () => {
    if (store.step === 1) {
      onCancel();
    } else {
      store.setStep(store.step - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Step 1: Identity
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          type="text"
          value={store.name}
          onChange={e => store.setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          placeholder="Enter character name"
        />
      </div>
      {/* Portrait selection placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Portrait
        </label>
        <div className="mt-1 flex items-center space-x-4">
          <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Select Portrait
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Step 2: Race
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {races
          .filter(race => !race.isNpcOnly)
          .map(race => (
            <div
              key={race.id}
              onClick={() => store.setRace(race)}
              className={`cursor-pointer p-4 rounded-lg border ${store.selectedRace?.id === race.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <h3 className="font-bold">{race.name}</h3>
              <p className="text-sm text-gray-600">{race.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                Modifiers:{' '}
                {Object.entries(race.attributeModifiers)
                  .map(([attr, mod]) => `${attr} ${mod > 0 ? '+' : ''}${mod}`)
                  .join(', ') || 'None'}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Step 3: Class
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {characterClasses.map(cls => (
          <div
            key={cls.id}
            onClick={() => store.setClass(cls)}
            className={`cursor-pointer p-4 rounded-lg border ${store.selectedClass?.id === cls.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <h3 className="font-bold">{cls.name}</h3>
            <p className="text-sm text-gray-600">{cls.description}</p>
            <div className="mt-2 text-xs text-gray-500">
              Primary: {cls.primaryAttributes.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => {
    const negativeAttrKeys: Array<keyof typeof store.negativeAttributes> = [
      'SN',
      'AC',
      'CL',
      'AV',
      'NE',
      'CU',
      'VT',
    ];
    const negativeAttrNames = {
      SN: 'Superstition',
      AC: 'Acrophobia',
      CL: 'Claustrophobia',
      AV: 'Avarice',
      NE: 'Necrophobia',
      CU: 'Curiosity',
      VT: 'Violent Temper',
    };

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Step 4: Attributes
        </h2>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => store.setGenerationMethod('point-buy')}
            className={`px-3 py-1 rounded ${store.generationMethod === 'point-buy' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Point Buy
          </button>
          <button
            onClick={() => {
              store.setGenerationMethod('random');
              store.rollAttributes();
            }}
            className={`px-3 py-1 rounded ${store.generationMethod === 'random' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Random
          </button>
        </div>

        {/* Positive Attributes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Positive Attributes
          </h3>
          <AttributeGrid
            attributes={store.attributes}
            editable={store.generationMethod === 'point-buy'}
            onAttributeChange={(attr, value) => store.setAttribute(attr, value)}
            racialModifiers={store.selectedRace?.attributeModifiers}
            showModifiers={true}
            minValue={8}
            maxValue={18}
          />
        </div>

        {/* Negative Attributes */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Negative Attributes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Higher values represent stronger flaws. Range: 2-8 for new
            characters.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {negativeAttrKeys.map(attr => (
              <div
                key={attr}
                className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-300 dark:border-gray-600"
              >
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {negativeAttrNames[attr]} ({attr})
                </label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={store.negativeAttributes[attr]}
                  onChange={e =>
                    store.setNegativeAttribute(
                      attr,
                      parseInt(e.target.value) || 2
                    )
                  }
                  disabled={store.generationMethod !== 'point-buy'}
                  className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
                />
              </div>
            ))}
          </div>
        </div>

        {store.generationMethod === 'point-buy' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-center mb-2">
              <span className="text-sm font-medium">Points Remaining: </span>
              <span className="font-bold text-lg">
                {store.attributePointsRemaining}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Increase negative attributes to gain bonus positive points (every
              2 points in flaws = 1 bonus point)
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Step 5: Feats
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Select a feat for your character.
      </p>
      <div className="grid grid-cols-1 gap-4">
        {feats.map(feat => {
          const isSelected = store.selectedFeats.some(f => f.id === feat.id);
          // Basic prerequisite check (level 1 only for now)
          const isAvailable =
            !feat.prerequisites ||
            !feat.prerequisites.level ||
            feat.prerequisites.level <= 1;

          if (!isAvailable) return null;

          return (
            <div
              key={feat.id}
              onClick={() => store.toggleFeat(feat)}
              className={`cursor-pointer p-4 rounded-lg border ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{feat.name}</h3>
                {isSelected && (
                  <span className="text-indigo-600 text-sm font-bold">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{feat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Step 6: Review
      </h2>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          <div>
            <h3 className="text-xl font-bold">{store.name || 'Unnamed'}</h3>
            <p className="text-gray-600">
              {store.selectedRace?.name} {store.selectedClass?.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold mb-2">Attributes</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(store.attributes).map(([attr, val]) => (
                <div key={attr} className="flex justify-between">
                  <span>{attr}:</span>
                  <span>
                    {val +
                      (store.selectedRace?.attributeModifiers[
                        attr as Attribute
                      ] || 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-2">Derived Stats</h4>
            <p>HP: {store.selectedClass?.baseStats.HP}</p>
            <p>AP: {store.selectedClass?.baseStats.AP}</p>
            <h4 className="font-bold mt-2 mb-1">Feats</h4>
            <ul className="list-disc pl-4">
              {store.selectedFeats.map(f => (
                <li key={f.id}>{f.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      {store.step === 1 && renderStep1()}
      {store.step === 2 && renderStep2()}
      {store.step === 3 && renderStep3()}
      {store.step === 4 && renderStep4()}
      {store.step === 5 && renderStep5()}
      {store.step === 6 && renderStep6()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className={`px-4 py-2 rounded ${store.step === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
        >
          {store.step === 1 ? 'Cancel' : 'Back'}
        </button>
        <button
          onClick={handleNext}
          disabled={
            (store.step === 1 && !store.name) ||
            (store.step === 2 && !store.selectedRace) ||
            (store.step === 3 && !store.selectedClass)
          }
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {store.step === 6 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

