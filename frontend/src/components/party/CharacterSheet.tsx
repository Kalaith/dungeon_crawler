
import React from 'react';
import type { Character } from '../../types';
import { StatDisplay } from '../ui/StatDisplay';
import { AttributeGrid } from '../character/AttributeGrid';

interface CharacterSheetProps {
  character: Character;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
}) => {
  if (!character.derivedStats) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200 font-semibold">
          Invalid Character Data
        </p>
        <p className="text-sm text-red-600 dark:text-red-300">
          This character is missing required stats. Please recreate this
          character.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Header / Portrait */}
        <div className="w-full md:w-1/4 flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center overflow-hidden">
            {character.portrait ? (
              <img
                src={character.portrait}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400">?</span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {character.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {character.race.name} {character.class.name}
          </p>
          <p className="text-sm text-gray-500">Level {character.level}</p>
        </div>

        {/* Stats Grid */}
        <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attributes */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3 border-b pb-2 dark:text-white">
              Attributes
            </h3>
            <AttributeGrid attributes={character.attributes} editable={false} />
          </div>

          {/* Derived Stats */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3 border-b pb-2 dark:text-white">
              Combat Stats
            </h3>
            <div className="space-y-3">
              <StatDisplay
                label="HP"
                current={character.derivedStats.HP.current}
                max={character.derivedStats.HP.max}
                barColor="health"
              />
              <StatDisplay
                label="AP"
                current={character.derivedStats.AP.current}
                max={character.derivedStats.AP.max}
                barColor="mana"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">AC</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {character.derivedStats.AC}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  Initiative
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {character.derivedStats.Initiative}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  Movement
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {character.derivedStats.Movement} ft
                </span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
            <h3 className="text-lg font-bold mb-3 border-b pb-2 dark:text-white">
              Skills
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {character.skills.map(skill => (
                <div key={skill.id} className="flex justify-between text-sm">
                  <span>{skill.name}</span>
                  <span className="font-mono text-gray-600 dark:text-gray-400">
                    {skill.value}
                  </span>
                </div>
              ))}
              {character.skills.length === 0 && (
                <p className="text-gray-500 italic">No skills learned</p>
              )}
            </div>
          </div>

          {/* Equipment */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
            <h3 className="text-lg font-bold mb-3 border-b pb-2 dark:text-white">
              Equipment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-gray-500">Main Hand</p>
                <p>{character.equipment.mainHand?.name || 'Empty'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Off Hand</p>
                <p>{character.equipment.offHand?.name || 'Empty'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Armor</p>
                <p>{character.equipment.armor?.name || 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

