import React, { useEffect } from 'react';
import { useDungeonStore } from '../../stores/useDungeonStore';
import { DungeonView } from './DungeonView';
import { Minimap } from './Minimap';
import { PartyStatus } from './PartyStatus';
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
    <div className="h-screen grid grid-cols-1 lg:grid-cols-[1fr_300px] grid-rows-[1fr_200px] lg:grid-rows-1 gap-2 p-2 bg-cream-50 dark:bg-charcoal-700">
      {/* Main dungeon view */}
      <div className="row-span-1 lg:row-span-2">
        <DungeonView />
      </div>

      {/* Minimap */}
      <div className="hidden lg:block">
        <Minimap />
      </div>

      {/* Game controls */}
      <div className="hidden lg:block">
        <GameControls />
      </div>

      {/* Party status - spans full width on mobile */}
      <div className="col-span-1 lg:col-span-2 lg:row-start-2">
        <PartyStatus />
      </div>

      {/* Mobile controls */}
      <div className="lg:hidden col-span-1 grid grid-cols-2 gap-2">
        <Minimap />
        <GameControls />
      </div>
    </div>
  );
};