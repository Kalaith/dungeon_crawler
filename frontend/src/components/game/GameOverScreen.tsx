import React from 'react';
import { useGameStateStore } from '../../stores/useGameStateStore';
import { usePartyStore } from '../../stores/usePartyStore';
import { useDungeonStore } from '../../stores/useDungeonStore';
import { useCombatStore } from '../../stores/useCombatStore';
import { useInventoryStore } from '../../stores/useInventoryStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useDungeonContextStore } from '../../stores/useDungeonContextStore';
import { Button } from '../ui/Button';

export const GameOverScreen: React.FC = () => {
  const { resetGame: resetGameState } = useGameStateStore();
  const { resetParty } = usePartyStore();
  const { resetDungeon } = useDungeonStore();
  const { resetCombat } = useCombatStore();
  const { resetInventory } = useInventoryStore();
  const { resetWorld } = useWorldStore();
  const { exitDungeon } = useDungeonContextStore();

  const handleReset = () => {
    // Exit any dungeon context
    exitDungeon();

    // Reset all stores
    resetParty();
    resetDungeon();
    resetCombat();
    resetInventory();
    resetWorld(); // This returns player to Millhaven
    resetGameState();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dungeon-900 text-parchment-100 p-8">
      <div className="max-w-md w-full bg-stone-700 border-4 border-stone-500 p-8 rounded-sm shadow-2xl text-center">
        <h1
          className="text-4xl font-bold text-blood-500 mb-6 tracking-widest uppercase"
          style={{ textShadow: '2px 2px 0 #000' }}
        >
          Game Over
        </h1>

        <p className="text-lg mb-8 text-parchment-300">
          Your party has fallen in the depths of the dungeon. Their story ends
          here...
        </p>

        <Button
          onClick={handleReset}
          className="w-full py-4 text-lg font-bold bg-stone-600 border-2 border-gold-600 text-gold-500 hover:bg-stone-500 hover:text-gold-400 transition-colors"
        >
          Start New Adventure
        </Button>
      </div>
    </div>
  );
};
