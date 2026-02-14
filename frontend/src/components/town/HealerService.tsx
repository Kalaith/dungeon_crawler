import React from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import { useGoldStore } from '../../stores/useGoldStore';
import type { Character } from '../../types';
import { Button } from '../ui/Button';

interface HealerServiceProps {
  onClose: () => void;
}

export const HealerService: React.FC<HealerServiceProps> = ({ onClose }) => {
  const { party, addCharacterToParty } = usePartyStore();
  const { gold, subtractGold, canAfford } = useGoldStore();

  const partyMembers = party.filter(c => c !== null) as Character[];

  const getHealCost = (character: Character): number => {
    const hpMissing = character.derivedStats.HP.max - character.derivedStats.HP.current;
    const apMissing = character.derivedStats.AP.max - character.derivedStats.AP.current;
    // 1 gold per HP, 2 gold per AP
    return hpMissing + apMissing * 2;
  };

  const getCureStatusCost = (): number => {
    return 25; // Flat rate for curing status effects
  };

  const needsHealing = (character: Character): boolean => {
    return (
      character.derivedStats.HP.current < character.derivedStats.HP.max ||
      character.derivedStats.AP.current < character.derivedStats.AP.max
    );
  };

  const hasStatusEffects = (character: Character): boolean => {
    return character.statusEffects && character.statusEffects.length > 0;
  };

  const handleHeal = (character: Character) => {
    const cost = getHealCost(character);

    if (!canAfford(cost)) {
      alert(`Insufficient funds! You need ${cost} gold but only have ${gold} gold.`);
      return;
    }

    const success = subtractGold(cost);
    if (!success) {
      alert('Transaction failed!');
      return;
    }

    const healedCharacter: Character = {
      ...character,
      derivedStats: {
        ...character.derivedStats,
        HP: {
          ...character.derivedStats.HP,
          current: character.derivedStats.HP.max,
        },
        AP: {
          ...character.derivedStats.AP,
          current: character.derivedStats.AP.max,
        },
      },
    };

    const characterIndex = party.findIndex(c => c?.id === character.id);
    if (characterIndex !== -1) {
      addCharacterToParty(healedCharacter, characterIndex);
    }
  };

  const handleCureStatus = (character: Character) => {
    const cost = getCureStatusCost();

    if (!canAfford(cost)) {
      alert(`Insufficient funds! You need ${cost} gold but only have ${gold} gold.`);
      return;
    }

    const success = subtractGold(cost);
    if (!success) {
      alert('Transaction failed!');
      return;
    }

    const curedCharacter: Character = {
      ...character,
      statusEffects: [],
    };

    const characterIndex = party.findIndex(c => c?.id === character.id);
    if (characterIndex !== -1) {
      addCharacterToParty(curedCharacter, characterIndex);
    }
  };

  const handleFullTreatment = (character: Character) => {
    const healCost = getHealCost(character);
    const statusCost = hasStatusEffects(character) ? getCureStatusCost() : 0;
    const totalCost = healCost + statusCost;

    if (!canAfford(totalCost)) {
      alert(`Insufficient funds! You need ${totalCost} gold but only have ${gold} gold.`);
      return;
    }

    const success = subtractGold(totalCost);
    if (!success) {
      alert('Transaction failed!');
      return;
    }

    const treatedCharacter: Character = {
      ...character,
      derivedStats: {
        ...character.derivedStats,
        HP: {
          ...character.derivedStats.HP,
          current: character.derivedStats.HP.max,
        },
        AP: {
          ...character.derivedStats.AP,
          current: character.derivedStats.AP.max,
        },
      },
      statusEffects: [],
    };

    const characterIndex = party.findIndex(c => c?.id === character.id);
    if (characterIndex !== -1) {
      addCharacterToParty(treatedCharacter, characterIndex);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-etrian-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚕️</div>
          <h1 className="text-4xl font-bold text-gold-500 mb-2">Healer's Clinic</h1>
          <p className="text-lg text-cyan-100">Professional healing and treatment services</p>
          <div className="mt-4 p-3 bg-etrian-800 border border-gold-500/30 rounded-lg inline-block">
            <p className="text-sm font-semibold text-gold-500">💰 Your Gold: {gold}</p>
          </div>
        </div>

        {/* Services Info */}
        <div className="bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50 mb-6">
          <h2 className="text-xl font-semibold text-gold-500 mb-4">Healer Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-etrian-700 rounded-lg p-4 border border-cyan-900/30">
              <h3 className="font-bold text-green-400 mb-2">💚 Restore HP/AP</h3>
              <p className="text-cyan-100 mb-2">Restore health and action points</p>
              <p className="text-xs text-cyan-400">Cost: 1 gold per HP, 2 gold per AP</p>
            </div>
            <div className="bg-etrian-700 rounded-lg p-4 border border-cyan-900/30">
              <h3 className="font-bold text-blue-400 mb-2">🧪 Cure Status</h3>
              <p className="text-cyan-100 mb-2">Remove all status effects</p>
              <p className="text-xs text-cyan-400">Cost: 25 gold flat rate</p>
            </div>
            <div className="bg-etrian-700 rounded-lg p-4 border border-cyan-900/30">
              <h3 className="font-bold text-purple-400 mb-2">✨ Full Treatment</h3>
              <p className="text-cyan-100 mb-2">Complete healing package</p>
              <p className="text-xs text-cyan-400">Restore HP/AP + Cure Status</p>
            </div>
          </div>
        </div>

        {/* Party Members */}
        <div className="bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50 mb-6">
          <h2 className="text-xl font-semibold text-gold-500 mb-4">Party Members</h2>

          {partyMembers.length === 0 ? (
            <p className="text-center text-cyan-400 py-8">No party members to heal</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {partyMembers.map(character => {
                const healCost = getHealCost(character);
                const statusCost = getCureStatusCost();
                const fullCost = healCost + (hasStatusEffects(character) ? statusCost : 0);
                const needsHeal = needsHealing(character);
                const hasStatus = hasStatusEffects(character);

                return (
                  <div
                    key={character.id}
                    className={`bg-etrian-700 rounded-lg p-4 border-2 ${
                      needsHeal || hasStatus ? 'border-yellow-500/50' : 'border-green-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Character Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gold-500">{character.name}</h3>
                        <p className="text-sm text-cyan-400 mb-3">
                          Level {character.level} {character.race.name} {character.class.name}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div
                            className={`p-2 rounded ${
                              character.derivedStats.HP.current < character.derivedStats.HP.max
                                ? 'bg-red-900/30 border border-red-500/30'
                                : 'bg-green-900/30 border border-green-500/30'
                            }`}
                          >
                            <p
                              className={
                                character.derivedStats.HP.current < character.derivedStats.HP.max
                                  ? 'text-red-400'
                                  : 'text-green-400'
                              }
                            >
                              HP: {character.derivedStats.HP.current}/
                              {character.derivedStats.HP.max}
                            </p>
                          </div>
                          <div
                            className={`p-2 rounded ${
                              character.derivedStats.AP.current < character.derivedStats.AP.max
                                ? 'bg-blue-900/30 border border-blue-500/30'
                                : 'bg-green-900/30 border border-green-500/30'
                            }`}
                          >
                            <p
                              className={
                                character.derivedStats.AP.current < character.derivedStats.AP.max
                                  ? 'text-blue-400'
                                  : 'text-green-400'
                              }
                            >
                              AP: {character.derivedStats.AP.current}/
                              {character.derivedStats.AP.max}
                            </p>
                          </div>
                        </div>

                        {/* Status Effects */}
                        {hasStatus && (
                          <div className="bg-purple-900/30 border border-purple-500/30 rounded p-2 mb-2">
                            <p className="text-xs text-purple-300">
                              Status Effects: {character.statusEffects.map(s => s.type).join(', ')}
                            </p>
                          </div>
                        )}

                        {!needsHeal && !hasStatus && (
                          <p className="text-sm text-green-400">✅ Healthy</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        {needsHeal && (
                          <div>
                            <p className="text-xs text-cyan-400 mb-1">Heal: {healCost} 💰</p>
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
                            <p className="text-xs text-cyan-400 mb-1">Cure: {statusCost} 💰</p>
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
                            <p className="text-xs text-cyan-400 mb-1">Full: {fullCost} 💰</p>
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
          <Button variant="outline" size="lg" onClick={onClose}>
            ← Back to Town
          </Button>
        </div>
      </div>
    </div>
  );
};
