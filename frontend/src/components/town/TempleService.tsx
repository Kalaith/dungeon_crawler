import React from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import { useGoldStore } from '../../stores/useGoldStore';
import type { Character } from '../../types';
import { Button } from '../ui/Button';

interface TempleServiceProps {
    onClose: () => void;
}

export const TempleService: React.FC<TempleServiceProps> = ({ onClose }) => {
    const { party, addCharacterToParty } = usePartyStore();
    const { gold, subtractGold, canAfford } = useGoldStore();

    const partyMembers = party.filter(c => c !== null) as Character[];
    const deadMembers = partyMembers.filter(c => !c.alive);

    const getResurrectionCost = (character: Character): number => {
        // Level 1 = 0 gold, then increases by level * 50
        return character.level === 1 ? 0 : (character.level - 1) * 50;
    };

    const handleResurrect = (character: Character) => {
        const cost = getResurrectionCost(character);

        if (cost > 0 && !canAfford(cost)) {
            alert(`Insufficient funds! You need ${cost} gold but only have ${gold} gold.`);
            return;
        }

        if (cost > 0) {
            const success = subtractGold(cost);
            if (!success) {
                alert('Transaction failed!');
                return;
            }
        }

        const revivedCharacter: Character = {
            ...character,
            alive: true,
            derivedStats: {
                ...character.derivedStats,
                HP: {
                    ...character.derivedStats.HP,
                    current: Math.floor(character.derivedStats.HP.max / 2) // Revive with 50% HP
                }
            }
        };

        const characterIndex = party.findIndex(c => c?.id === character.id);
        if (characterIndex !== -1) {
            addCharacterToParty(revivedCharacter, characterIndex);
        }
    };

    const handleBless = () => {
        alert('Blessing system coming soon!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400/8 to-blue-400/8 dark:from-purple-400/15 dark:to-blue-400/15 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">⛪</div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-200 mb-2">
                        Temple of Light
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400">
                        Divine healing and resurrection services
                    </p>
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg inline-block">
                        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                            💰 Your Gold: {gold}
                        </p>
                    </div>
                </div>

                {/* Services Info */}
                <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl p-6 shadow-lg border border-gray-400/20 mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-200 mb-4">
                        Temple Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-2">
                                ⚰️ Resurrection
                            </h3>
                            <p className="text-slate-700 dark:text-gray-300 mb-2">
                                Bring fallen party members back to life
                            </p>
                            <p className="text-xs text-slate-600 dark:text-gray-400">
                                Cost: Free for Level 1, then 50 gold per level above 1
                            </p>
                            <p className="text-xs text-slate-600 dark:text-gray-400">
                                Revives with 50% HP
                            </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                                ✨ Blessing
                            </h3>
                            <p className="text-slate-700 dark:text-gray-300 mb-2">
                                Receive divine blessings for your journey
                            </p>
                            <p className="text-xs text-slate-600 dark:text-gray-400">
                                Coming Soon
                            </p>
                        </div>
                    </div>
                </div>

                {/* Resurrection Section */}
                {deadMembers.length > 0 ? (
                    <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl p-6 shadow-lg border border-gray-400/20 mb-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-200 mb-4">
                            Fallen Heroes
                        </h2>
                        <div className="space-y-4">
                            {deadMembers.map((character) => {
                                const cost = getResurrectionCost(character);
                                return (
                                    <div
                                        key={character.id}
                                        className="bg-white dark:bg-charcoal-700 rounded-lg p-4 border-2 border-red-300 dark:border-red-700"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-gray-200">
                                                    {character.name}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-gray-400">
                                                    Level {character.level} {character.race.name} {character.class.name}
                                                </p>
                                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                    💀 Deceased
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-600 dark:text-gray-400 mb-2">
                                                    Resurrection Cost
                                                </p>
                                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                                                    {cost === 0 ? 'Free' : `${cost} 💰`}
                                                </p>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleResurrect(character)}
                                                >
                                                    Resurrect
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 shadow-lg border border-green-400/20 mb-6 text-center">
                        <p className="text-lg text-green-800 dark:text-green-200">
                            ✅ All party members are alive and well!
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                            May the gods continue to watch over you.
                        </p>
                    </div>
                )}

                {/* Living Party Members - Blessing Section */}
                {partyMembers.filter(c => c.alive).length > 0 && (
                    <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl p-6 shadow-lg border border-gray-400/20 mb-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-200 mb-4">
                            Request Blessings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {partyMembers.filter(c => c.alive).map((character) => (
                                <div
                                    key={character.id}
                                    className="bg-white dark:bg-charcoal-700 rounded-lg p-4 border border-gray-300 dark:border-gray-600"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-gray-200">
                                                {character.name}
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-gray-400">
                                                Level {character.level} {character.race.name} {character.class.name}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleBless}
                                            disabled
                                        >
                                            Bless
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-500 mt-4 text-center italic">
                            Blessing system coming soon
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onClose}
                    >
                        ← Back to Town
                    </Button>
                </div>
            </div>
        </div>
    );
};
