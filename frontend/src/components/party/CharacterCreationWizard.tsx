import React from 'react';
import { useCharacterCreationStore } from '../../stores/useCharacterCreationStore';
import { races } from '../../data/races';
import { characterClasses } from '../../data/classes';
import type { Attribute, Character } from '../../types';
import { AttributeGrid } from '../character/AttributeGrid';
import { createCharacterFromWizardData } from '../../utils/characterCreation';

interface CharacterCreationWizardProps {
    onFinish: (character: Character) => void;
    onCancel: () => void;
}

export const CharacterCreationWizard: React.FC<CharacterCreationWizardProps> = ({ onFinish, onCancel }) => {
    const store = useCharacterCreationStore();

    const handleNext = () => {
        if (store.step === 5) {
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Step 1: Identity</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                    type="text"
                    value={store.name}
                    onChange={(e) => store.setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="Enter character name"
                />
            </div>
            {/* Portrait selection placeholder */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Portrait</label>
                <div className="mt-1 flex items-center space-x-4">
                    <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                    </div>
                    <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Select Portrait</button>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Step 2: Race</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {races.map((race) => (
                    <div
                        key={race.id}
                        onClick={() => store.setRace(race)}
                        className={`cursor-pointer p-4 rounded-lg border ${store.selectedRace?.id === race.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <h3 className="font-bold">{race.name}</h3>
                        <p className="text-sm text-gray-600">{race.description}</p>
                        <div className="mt-2 text-xs text-gray-500">
                            Modifiers: {Object.entries(race.attributeModifiers).map(([attr, mod]) => `${attr} ${mod > 0 ? '+' : ''}${mod}`).join(', ') || 'None'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Step 3: Class</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {characterClasses.map((cls) => (
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
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Step 4: Attributes</h2>
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

                <AttributeGrid
                    attributes={store.attributes}
                    editable={store.generationMethod === 'point-buy'}
                    onAttributeChange={(attr, value) => store.setAttribute(attr, value)}
                    racialModifiers={store.selectedRace?.attributeModifiers}
                    showModifiers={true}
                    minValue={8}
                    maxValue={18}
                />

                {store.generationMethod === 'point-buy' && (
                    <div className="text-center mt-4">
                        Points Remaining: <span className="font-bold">{store.attributePointsRemaining}</span>
                    </div>
                )}
            </div>
        );
    };

    const renderStep5 = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Step 5: Review</h2>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                    <div>
                        <h3 className="text-xl font-bold">{store.name || 'Unnamed'}</h3>
                        <p className="text-gray-600">{store.selectedRace?.name} {store.selectedClass?.name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-bold mb-2">Attributes</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(store.attributes).map(([attr, val]) => (
                                <div key={attr} className="flex justify-between">
                                    <span>{attr}:</span>
                                    <span>{val + (store.selectedRace?.attributeModifiers[attr as Attribute] || 0)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Derived Stats</h4>
                        <p>HP: {store.selectedClass?.baseStats.HP}</p>
                        <p>AP: {store.selectedClass?.baseStats.AP}</p>
                        {/* Add more derived stats here */}
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
                    {store.step === 5 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};
