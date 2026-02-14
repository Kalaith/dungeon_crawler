import React, { useState } from 'react';
import { usePartyStore } from '../../stores/usePartyStore';
import { Button } from '../ui/Button';

interface InnServiceProps {
  onClose: () => void;
}

export const InnService: React.FC<InnServiceProps> = ({ onClose }) => {
  const { party, restParty } = usePartyStore();
  const [hasRested, setHasRested] = useState(false);

  const roomCost = 10; // Gold per night

  const handleRest = () => {
    // TODO: Deduct gold when economy system is implemented
    restParty();
    setHasRested(true);
  };

  const partyMembers = party.filter(c => c !== null);
  const needsRest = partyMembers.some(
    c =>
      c &&
      c.derivedStats &&
      (c.derivedStats.HP.current < c.derivedStats.HP.max ||
        c.derivedStats.AP.current < c.derivedStats.AP.max)
  );

  return (
    <div className="h-full w-full overflow-y-auto bg-etrian-900 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏨</div>
          <h1 className="text-4xl font-bold text-gold-500 mb-2">The Cozy Inn</h1>
          <p className="text-lg text-cyan-100">Rest and recover your strength</p>
        </div>

        {/* Main Content */}
        <div className="bg-etrian-800 rounded-xl p-8 shadow-lg border border-cyan-900/50 mb-6">
          {!hasRested ? (
            <>
              <h2 className="text-2xl font-semibold text-gold-500 mb-4">Welcome, travelers!</h2>

              <p className="text-cyan-100 mb-6">
                A warm bed and a hot meal await you. Rest here to fully restore your party's health
                and energy.
              </p>

              {/* Room Options */}
              <div className="bg-etrian-700 rounded-lg p-6 mb-6 border-2 border-gold-500/30">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gold-500">Standard Room</h3>
                    <p className="text-sm text-cyan-400">
                      Clean beds, warm blankets, and a hearty breakfast
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gold-500">{roomCost} 💰</p>
                    <p className="text-xs text-cyan-400">per night</p>
                  </div>
                </div>

                <div className="bg-green-900/30 rounded p-3 mb-4 border border-green-500/30">
                  <p className="text-sm text-green-400">
                    ✨ <strong>Benefits:</strong> Fully restores HP and AP for all party members
                  </p>
                </div>

                {/* Party Status */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-cyan-100 mb-2">Party Status:</h4>
                  <div className="space-y-2">
                    {partyMembers.map((character, idx) => {
                      if (!character || !character.derivedStats) return null;

                      const hpPercent =
                        (character.derivedStats.HP.current / character.derivedStats.HP.max) * 100;
                      const apPercent =
                        (character.derivedStats.AP.current / character.derivedStats.AP.max) * 100;
                      const needsHealing = hpPercent < 100 || apPercent < 100;

                      return (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="font-medium text-cyan-100">{character.name}</span>
                          <div className="flex gap-4">
                            <span className={needsHealing ? 'text-red-400' : 'text-green-400'}>
                              HP: {character.derivedStats.HP.current}/
                              {character.derivedStats.HP.max}
                            </span>
                            <span className={needsHealing ? 'text-blue-400' : 'text-green-400'}>
                              AP: {character.derivedStats.AP.current}/
                              {character.derivedStats.AP.max}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {needsRest ? (
                  <Button variant="primary" size="lg" onClick={handleRest} className="w-full">
                    Rest for the Night ({roomCost} Gold)
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-green-800 dark:text-green-200">
                      ✅ Your party is already well-rested!
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Services (Coming Soon) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-etrian-900 rounded-lg p-4 opacity-50 border border-cyan-900/30">
                  <h4 className="font-semibold text-gold-500 mb-2">🍺 Tavern</h4>
                  <p className="text-xs text-cyan-400">
                    Hear rumors and gather information (Coming Soon)
                  </p>
                </div>
                <div className="bg-etrian-900 rounded-lg p-4 opacity-50 border border-cyan-900/30">
                  <h4 className="font-semibold text-gold-500 mb-2">🍖 Meals</h4>
                  <p className="text-xs text-cyan-400">Buy rations and provisions (Coming Soon)</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">😴</div>
              <h2 className="text-2xl font-bold text-gold-500 mb-4">A Good Night's Rest</h2>
              <p className="text-cyan-100 mb-6">
                Your party has rested well. Everyone feels refreshed and ready for adventure!
              </p>
              <div className="bg-green-900/30 rounded-lg p-6 mb-6 border border-green-500/30">
                <p className="text-lg font-semibold text-green-400 mb-2">
                  ✨ Party Fully Restored!
                </p>
                <p className="text-sm text-green-300">
                  All HP and AP have been restored to maximum
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={onClose}>
            {hasRested ? 'Leave Inn' : '← Back to Town'}
          </Button>
        </div>
      </div>
    </div>
  );
};
