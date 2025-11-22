import React from 'react';
import type { Spell } from '../../types';
import { getCastableSpells } from '../../data/spells';

interface SpellSelectorProps {
    spells: Spell[];
    currentAP: number;
    onSelectSpell: (spell: Spell) => void;
    onCancel: () => void;
}

export const SpellSelector: React.FC<SpellSelectorProps> = ({
    spells,
    currentAP,
    onSelectSpell,
    onCancel
}) => {
    const castableSpells = getCastableSpells(spells, currentAP);

    // Group spells by level
    const spellsByLevel: Record<number, Spell[]> = {};
    spells.forEach(spell => {
        if (!spellsByLevel[spell.level]) {
            spellsByLevel[spell.level] = [];
        }
        spellsByLevel[spell.level].push(spell);
    });

    const levelNames: Record<number, string> = {
        0: 'Cantrips',
        1: '1st Level',
        2: '2nd Level',
        3: '3rd Level',
        4: '4th Level',
        5: '5th Level',
        6: '6th Level',
        7: '7th Level',
        8: '8th Level',
        9: '9th Level'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cast Spell</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Available AP: <span className="font-bold text-indigo-600">{currentAP}</span>
                    </p>
                </div>

                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {Object.entries(spellsByLevel)
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([level, levelSpells]) => (
                            <div key={level} className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    {levelNames[Number(level)]}
                                </h3>
                                <div className="space-y-2">
                                    {levelSpells.map(spell => {
                                        const canCast = castableSpells.includes(spell);
                                        const isConcentration = spell.concentration;

                                        return (
                                            <div
                                                key={spell.id}
                                                onClick={() => canCast && onSelectSpell(spell)}
                                                className={`p-3 rounded-lg border transition-all ${canCast
                                                        ? 'border-indigo-300 bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 cursor-pointer'
                                                        : 'border-gray-200 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`font-bold ${canCast ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                                            {spell.name}
                                                        </h4>
                                                        {isConcentration && (
                                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                                                Concentration
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={`text-sm font-semibold ${canCast ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                        {spell.apCost} AP
                                                    </span>
                                                </div>

                                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                    <span className="font-medium">{spell.school}</span>
                                                    {' • '}
                                                    <span>{spell.castingTime}</span>
                                                    {' • '}
                                                    <span>Range: {spell.range}</span>
                                                </div>

                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {spell.description}
                                                </p>

                                                {spell.damageType && (
                                                    <div className="mt-2 text-xs">
                                                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                                            {spell.damageType} damage
                                                        </span>
                                                    </div>
                                                )}

                                                {spell.savingThrow && (
                                                    <div className="mt-2 text-xs">
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                            {spell.savingThrow} save
                                                        </span>
                                                    </div>
                                                )}

                                                {spell.attackRoll && (
                                                    <div className="mt-2 text-xs">
                                                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                            Spell attack
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
