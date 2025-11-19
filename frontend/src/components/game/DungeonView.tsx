import React, { useRef, useEffect } from 'react';
import { useDungeon } from '../../hooks/useDungeon';
import { useDungeonStore } from '../../stores/useDungeonStore';
import { DungeonRenderer } from '../../utils/dungeonRenderer';
import { RENDER_CONFIG } from '../../data/constants';

export const DungeonView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getTileAhead, getTileFarAhead, getTileLeft, getTileRight, getTile } = useDungeon();
  const { playerPosition, playerFacing, currentDungeonMap } = useDungeonStore();

  // Helper function to get direction vectors
  const getDirectionVector = (direction: number): [number, number] => {
    const directions: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N, E, S, W
    return directions[direction];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentDungeonMap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderer = new DungeonRenderer(ctx, canvas.width, canvas.height);

    // Calculate "Left of Ahead" and "Right of Ahead" for the middle section
    const [dx, dy] = getDirectionVector(playerFacing);
    const aheadX = playerPosition.x + dx;
    const aheadY = playerPosition.y + dy;

    const [lx, ly] = getDirectionVector((playerFacing + 3) % 4); // Left vector
    const leftOfAhead = getTile(aheadX + lx, aheadY + ly);

    const [rx, ry] = getDirectionVector((playerFacing + 1) % 4); // Right vector
    const rightOfAhead = getTile(aheadX + rx, aheadY + ry);

    renderer.renderScene({
      ahead: getTileAhead(),
      farAhead: getTileFarAhead(),
      left: getTileLeft(),
      right: getTileRight(),
      leftOfAhead,
      rightOfAhead
    });

  }, [
    currentDungeonMap,
    playerPosition,
    playerFacing,
    getTileAhead,
    getTileFarAhead,
    getTileLeft,
    getTileRight,
    getTile
  ]);

  if (!currentDungeonMap) {
    return (
      <div className="w-full h-64 bg-black flex items-center justify-center text-white font-mono">
        Generating dungeon...
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl">
      <canvas
        ref={canvasRef}
        width={RENDER_CONFIG.VIEWPORT.WIDTH}
        height={RENDER_CONFIG.VIEWPORT.HEIGHT}
        className="w-full h-auto block bg-black"
      />

      {/* Compass / Direction Indicator */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded font-mono border border-white/20">
        {['NORTH', 'EAST', 'SOUTH', 'WEST'][playerFacing]}
      </div>

      {/* Coordinates (Debug) */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded font-mono text-xs border border-white/20">
        {playerPosition.x}, {playerPosition.y}
      </div>
    </div>
  );
};