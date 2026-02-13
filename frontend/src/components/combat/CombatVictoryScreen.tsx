import React from 'react';
import { useCombatStore } from '../../stores/useCombatStore';

export const CombatVictoryScreen: React.FC = () => {
  const { victoryData, endCombat } = useCombatStore();

  if (!victoryData) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 animate-in fade-in duration-300">
      <div className="bg-stone-800 border-4 border-yellow-600 p-8 rounded-lg max-w-2xl w-full text-center shadow-2xl">
        <h2 className="text-5xl font-bold text-yellow-500 mb-8 tracking-wider drop-shadow-md">
          VICTORY!
        </h2>

        <div className="space-y-6 mb-10">
          {/* Basic Rewards */}
          <div className="bg-stone-900/50 p-6 rounded-lg border border-stone-700">
            <h3 className="text-xl text-stone-400 mb-4 uppercase tracking-widest font-bold">
              Rewards
            </h3>
            <div className="flex justify-center gap-12 text-2xl font-mono">
              <div className="text-yellow-400 flex items-center gap-2">
                <span>💰</span> {victoryData.gold} Gold
              </div>
              <div className="text-blue-400 flex items-center gap-2">
                <span>✨</span> {victoryData.exp} EXP
              </div>
            </div>
          </div>

          {/* Loot */}
          {victoryData.items.length > 0 && (
            <div className="bg-stone-900/50 p-6 rounded-lg border border-stone-700">
              <h3 className="text-xl text-stone-400 mb-4 uppercase tracking-widest font-bold">
                Loot Found
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {victoryData.items.map((item, i) => (
                  <div
                    key={i}
                    className={`px-4 py-2 rounded bg-stone-800 border-2 flex items-center gap-2 ${
                      item.rarity === 'legendary'
                        ? 'text-orange-400 border-orange-500 shadow-orange-500/20 shadow-lg'
                        : item.rarity === 'epic'
                          ? 'text-purple-400 border-purple-500 shadow-purple-500/20 shadow-lg'
                          : item.rarity === 'rare'
                            ? 'text-blue-400 border-blue-500'
                            : 'text-stone-300 border-stone-600'
                    }`}
                  >
                    <span>
                      {item.type === 'weapon'
                        ? '⚔️'
                        : item.type === 'armor'
                          ? '🛡️'
                          : '📦'}
                    </span>
                    <span className="font-bold">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level Ups */}
          {victoryData.levelUps.length > 0 && (
            <div className="bg-green-900/20 p-6 rounded-lg border-2 border-green-500/50 animate-pulse">
              <h3 className="text-2xl text-green-400 mb-4 font-bold uppercase">
                Level Up!
              </h3>
              <div className="space-y-2">
                {victoryData.levelUps.map((levelup, i) => (
                  <div key={i} className="text-xl text-stone-200">
                    <span className="font-bold text-white">{levelup.name}</span>{' '}
                    gained {levelup.levelsGained} level(s)!
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={endCombat}
          className="px-10 py-4 bg-yellow-700 hover:bg-yellow-600 text-white font-bold rounded-sm text-xl transition-all hover:scale-105 border-2 border-yellow-500 shadow-lg uppercase tracking-widest"
        >
          Continue Adventure
        </button>
      </div>
    </div>
  );
};
