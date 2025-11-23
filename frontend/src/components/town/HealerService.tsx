import React, { useState } from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import type { Character } from '../../types';
import { Button } from '../ui/Button';

interface HealerServiceProps {
    onClose: () => void;
}

export const HealerService: React.FC<HealerServiceProps> = ({ onClose }) => {
    const { party, addCharacterToParty } = usePartyStore();
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    const partyMembers = party.filter(c => c !== null) as Character[];

    const getHealCost = (character: Character): number => {
        const hpMissing = character.derivedStats.HP.max - character.derivedStats.HP.current;
        const apMissing = character.derivedStats.AP.max - character.derivedStats.AP.current;
        // 1 gold per HP, 2 gold per AP
        return hpMissing + (apMissing * 2);
    };

    const getCureStatusCost = (): number => {
        return 25; // Flat rate for curing status effects
    };

    const needsHealing = (character: Character): boolean => {
        return character.derivedStats.HP.current < character.derivedStats.HP.max ||
            character.derivedStats.AP.current < character.derivedStats.AP.max;
    };

    const hasStatusEffects = (character: Character): boolean => {
        return character.statusEffects && character.statusEffects.length > 0;
    };

    const handleHeal = (character: Character) => {
        const healedCharacter: Character = {
            ...character,
            derivedStats: {
                ...character.derivedStats,
                HP: {
                    ...character.derivedStats.HP,
                    current: character.derivedStats.HP.max
                },
                AP: {
                    ...character.derivedStats.AP,
                    current: character.derivedStats.AP.max
                }
            }
        };

        const characterIndex = party.findIndex(c => c?.id === character.id);
        if (characterIndex !== -1) {
            addCharacterToParty(healedCharacter, characterIndex);
        }
    };

    const handleCureStatus = (character: Character) => {
        const curedCharacter: Character = {
            ...character,
            statusEffects: []
        };

        const characterIndex = party.findIndex(c => c?.id === character.id);
        if (characterIndex !== -1) {
            addCharacterToParty(curedCharacter, characterIndex);
        }
    };

    const handleFullTreatment = (character: Character) => {
        const treatedCharacter: Character = {
            ...character,
            derivedStats: {
                ...character.derivedStats,
                HP: {
                    ...character.derivedStats.HP,
                    current: character.derivedStats.HP.max
                },
                AP: {
                    ...character.derivedStats.AP,
                    current: character.derivedStats.AP.max
                }
            },
            statusEffects: []
        };

        const characterIndex = party.findIndex(c => c?.id === character.id);
        if (characterIndex !== -1) {
            addCharacterToParty(treatedCharacter, characterIndex);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400/8 to-emerald-400/8 dark:from-green-400/15 dark:to-emerald-400/15 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">⚕️</div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-200 mb-2">
                        Healer's Clinic
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400">
                        Professional healing and treatment services
                    </p>
                </div>

                {/* Services Info */}
                <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl p-6 shadow-lg border border-gray-400/20 mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-200 mb-4">
                        Healer Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <h3 className="font-bold text-green-900 dark:text-green-200 mb-2">
                                💚 Restore HP/AP
                            </h3>
                            <p className="text-slate-700 dark:text-gray-300 mb-2">
                                Restore health and action points
                            </p>
                            <p className="text-xs text-slate-600 dark:text-gray-400">
                                Cost: 1 gold per HP, 2 gold per AP
                            </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                                🧪 Cure Status
                            </h3>
                            <p className="text-slate-700 dark:text-gray-300 mb-2">
                                Remove all status effects
                            </p>
                            <p className="text-xs text-slate-600 dark:text-gray-400">
                                Cost: 25 gold flat rate
                            </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-2">
                                ✨ Full Treatment
                            </h3>
                            <p className="text-slate-700 dark:text-gray-300 mb-2">
                                Complete healing package
                            </p>
                            <p className="text-xs text-slate-600 dark:text-gray-400">
                                Restore HP/AP + Cure Status
                            </p>
                        </div>
                    </div>
                </div>

                {/* Party Members */}
                <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl p-6 shadow-lg border border-gray-400/20 mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-200 mb-4">
                        Party Members
                    </h2>

                    {partyMembers.length === 0 ? (
                        <p className="text-center text-slate-600 dark:text-gray-400 py-8">
                            No party members to heal
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {partyMembers.map((character) => {
                                const healCost = getHealCost(character);
                                const statusCost = getCureStatusCost();
                                const fullCost = healCost + (hasStatusEffects(character) ? statusCost : 0);
                                const needsHeal = needsHealing(character);
                                const hasStatus = hasStatusEffects(character);

                                return (
                                    <div
                                        key={character.id}
                                        className={`bg-white dark:bg-charcoal-700 rounded-lg p-4 border-2 ${needsHeal || hasStatus
                                                ? 'border-yellow-300 dark:border-yellow-700'
                                                : 'border-green-300 dark:border-green-700'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Character Info */}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-gray-200">
                                                    {character.name}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                                                    Level {character.level} {character.race.name} {character.class.name}
                                                </p>

                                                {/* Stats */}
                                                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                                    <div className={`p-2 rounded ${character.derivedStats.HP.current < character.derivedStats.HP.max
                                                            ? 'bg-red-50 dark:bg-red-900/20'
                                                            : 'bg-green-50 dark:bg-green-900/20'
                                                        }`}>
                                                        <p className={
                                                            character.derivedStats.HP.current < character.derivedStats.HP.max
                                                                ? 'text-red-800 dark:text-red-200'
                                                                : 'text-green-800 dark:text-green-200'
                                                        }>
                                                            HP: {character.derivedStats.HP.current}/{character.derivedStats.HP.max}
                                                        </p>
                                                    </div>
                                                    <div className={`p-2 rounded ${character.derivedStats.AP.current < character.derivedStats.AP.max
                                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                                            : 'bg-green-50 dark:bg-green-900/20'
                                                        }`}>
                                                        <p className={
                                                            character.derivedStats.AP.current < character.derivedStats.AP.max
                                                                ? 'text-blue-800 dark:text-blue-200'
                                                                : 'text-green-800 dark:text-green-200'
                                                        }>
                                                            AP: {character.derivedStats.AP.current}/{character.derivedStats.AP.max}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Status Effects */}
                                                {hasStatus && (
                                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2 mb-2">
                                                        <p className="text-xs text-purple-800 dark:text-purple-200">
                                                            Status Effects: {character.statusEffects.map(s => s.type).join(', ')}
                                                        </p>
                                                    </div>
                                                )}

                                                {!needsHeal && !hasStatus && (
                                                    <p className="text-sm text-green-600 dark:text-green-400">
                                                        ✅ Healthy
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                {needsHeal && (
                                                    <div>
                                                        <p className="text-xs text-slate-600 dark:text-gray-400 mb-1">
                                                            Heal: {healCost} 💰
                                                        </p>
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleHeal(character)}
                                                            className="w-full"
                                                        >
                                                            Restore HP/AP
                                                        </Button>
                                                    </div>
                                                )}

                                                {hasStatus && (
                                                    <div>
                                                        <p className="text-xs text-slate-600 dark:text-gray-400 mb-1">
                                                            Cure: {statusCost} 💰
                                                        </p>
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleCureStatus(character)}
                                                            className="w-full"
                                                        >
                                                            Cure Status
                                                        </Button>
                                                    </div>
                                                )}

                                                {(needsHeal || hasStatus) && (
                                                    <div>
                                                        <p className="text-xs text-slate-600 dark:text-gray-400 mb-1">
                                                            Full: {fullCost} 💰
                                                        </p>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleFullTreatment(character)}
                                                            className="w-full"
                                                        >
                                                            Full Treatment
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

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
