import React, { useEffect } from 'react';
import { useDungeonStore } from '../../stores/useDungeonStore';
import { DungeonView } from './DungeonView';
import { Minimap } from './Minimap';
import { GameControls } from './GameControls';

import { useGameOverCheck } from '../../hooks/useGameOverCheck';

export const GameScreen: React.FC = () => {
  const { addExploredTile, playerPosition } = useDungeonStore();

  // Monitor for game over condition
  useGameOverCheck();

  useEffect(() => {
    // Initialize explored map with starting position
    addExploredTile(playerPosition.x, playerPosition.y);
  }, [addExploredTile, playerPosition.x, playerPosition.y]);

  return (
    <div className="h-full w-full relative">
      {/* Main dungeon view */}
      <div className="h-full w-full">
        <DungeonView />
      </div>

      {/* Minimap Overlay */}
      <div className="absolute top-4 right-4 hidden lg:block opacity-90 hover:opacity-100 transition-opacity">
        <Minimap />
      </div>

      {/* Game controls Overlay (Bottom Center) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden lg:block">
        <GameControls />
      </div>

      {/* Mobile controls */}
      <div className="lg:hidden absolute bottom-4 right-4">
        <GameControls />
      </div>
    </div>
  );
};