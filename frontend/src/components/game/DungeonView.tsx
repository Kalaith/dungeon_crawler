import React, { useRef, useEffect } from 'react';
import { useDungeon } from '../../hooks/useDungeon';
import { useDungeonStore } from '../../stores/useDungeonStore';
import { DungeonRenderer } from '../../utils/dungeonRenderer';
import { renderConfig } from '../../data/constants';

export const DungeonView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getTileAhead, getTileFarAhead, getTileLeft, getTileRight, getTile } = useDungeon();
  const { playerPosition, playerFacing, currentDungeonMap, foes, interactiveTiles } =
    useDungeonStore();

  // Helper function to get direction vectors
  const getDirectionVector = (direction: number): [number, number] => {
    const directions: [number, number][] = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]; // N, E, S, W
    return directions[direction] || [0, -1];
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
    const farAheadX = playerPosition.x + dx * 2;
    const farAheadY = playerPosition.y + dy * 2;

    // Get left and right direction vectors (perpendicular to facing)
    const [lx, ly] = getDirectionVector((playerFacing + 3) % 4);
    const [rx, ry] = getDirectionVector((playerFacing + 1) % 4);

    // leftOfAhead is the tile to the left of the ahead tile (not diagonal)
    const leftOfAhead = getTile(aheadX + lx, aheadY + ly);
    // rightOfAhead is the tile to the right of the ahead tile (not diagonal)
    const rightOfAhead = getTile(aheadX + rx, aheadY + ry);

    // Find visible FOEs
    const foeAhead = foes.find(f => f.x === aheadX && f.y === aheadY);
    const foeFarAhead = foes.find(f => f.x === farAheadX && f.y === farAheadY);

    // Find visible Objects
    const objectAhead = Object.values(interactiveTiles).find(t => t.x === aheadX && t.y === aheadY);
    const objectFarAhead = Object.values(interactiveTiles).find(
      t => t.x === farAheadX && t.y === farAheadY
    );

    renderer.renderScene({
      ahead: getTileAhead(),
      farAhead: getTileFarAhead(),
      left: getTileLeft(),
      right: getTileRight(),
      leftOfAhead,
      rightOfAhead,
      foeAhead,
      foeFarAhead,
      objectAhead,
      objectFarAhead,
    });
  }, [
    currentDungeonMap,
    playerPosition,
    playerFacing,
    getTileAhead,
    getTileFarAhead,
    getTileLeft,
    getTileRight,
    getTile,
    foes,
    interactiveTiles,
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
        width={renderConfig.VIEWPORT.WIDTH}
        height={renderConfig.VIEWPORT.HEIGHT}
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
