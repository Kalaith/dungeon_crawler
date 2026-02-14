import React from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useDungeonContextStore } from '../../stores/useDungeonContextStore';
import { useDungeonStore } from '../../stores/useDungeonStore';
import { useGameStateStore } from '../../stores/useGameStateStore';
import { Button } from '../ui/Button';

export const DungeonEntrance: React.FC = () => {
  const { getCurrentLocation } = useWorldStore();
  const { enterDungeon } = useDungeonContextStore();
  const { generateFloor } = useDungeonStore();
  const { setGameState } = useGameStateStore();

  const currentLocation = getCurrentLocation();

  if (!currentLocation || currentLocation.type !== 'dungeon' || !currentLocation.dungeonData) {
    return null;
  }

  const { dungeonData } = currentLocation;

  const handleEnterDungeon = () => {
    // Set dungeon context
    enterDungeon(currentLocation.id, currentLocation.id);

    // Generate the appropriate floor
    const startFloor = dungeonData.currentFloor || 1;
    generateFloor(startFloor);

    // Transition to dungeon state
    setGameState('dungeon');
  };

  const handleReturnToOverworld = () => {
    setGameState('overworld');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-400/8 to-red-400/8 dark:from-gray-400/15 dark:to-red-400/15 p-8">
      <div className="bg-cream-100 dark:bg-charcoal-800 rounded-xl p-8 shadow-lg border border-gray-400/20 max-w-2xl w-full">
        {/* Dungeon Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-200 mb-2">
            {currentLocation.name}
          </h1>
          <p className="text-slate-600 dark:text-gray-400">{currentLocation.description}</p>
        </div>

        {/* Dungeon Info */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-200 mb-4">
            Dungeon Information
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600 dark:text-gray-400">Floors</p>
              <p className="text-lg font-bold text-slate-900 dark:text-gray-200">
                {dungeonData.floors}
              </p>
            </div>

            <div>
              <p className="text-slate-600 dark:text-gray-400">Difficulty</p>
              <p className="text-lg font-bold text-slate-900 dark:text-gray-200">
                {dungeonData.difficulty}/10
              </p>
            </div>

            <div>
              <p className="text-slate-600 dark:text-gray-400">Recommended Level</p>
              <p className="text-lg font-bold text-slate-900 dark:text-gray-200">
                Level {dungeonData.recommendedLevel}
              </p>
            </div>

            <div>
              <p className="text-slate-600 dark:text-gray-400">Status</p>
              <p className="text-lg font-bold text-slate-900 dark:text-gray-200">
                {dungeonData.completed ? '✅ Completed' : '🔓 Available'}
              </p>
            </div>
          </div>

          {dungeonData.currentFloor > 1 && (
            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💾 You have progress saved on floor {dungeonData.currentFloor}
              </p>
            </div>
          )}
        </div>

        {/* Warnings */}
        {!dungeonData.completed && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Warning:</strong> Make sure your party is well-prepared before entering.
              Bring healing items, check your equipment, and ensure everyone is at full health.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="primary" size="lg" onClick={handleEnterDungeon} className="flex-1">
            {dungeonData.currentFloor > 1 ? 'Continue Exploration' : 'Enter Dungeon'}
          </Button>

          <Button variant="outline" size="lg" onClick={handleReturnToOverworld}>
            Return to Map
          </Button>
        </div>

        {/* Rewards Preview (if completed) */}
        {dungeonData.completed && dungeonData.rewards && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              Rewards Already Claimed:
            </h3>
            <div className="text-xs text-green-700 dark:text-green-300">
              <p>💰 {dungeonData.rewards.gold} Gold</p>
              <p>⭐ {dungeonData.rewards.exp} Experience</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
