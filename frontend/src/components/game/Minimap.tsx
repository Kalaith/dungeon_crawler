import React, { useRef, useEffect } from 'react';
import { useDungeonStore } from '../../stores/useDungeonStore';

export const Minimap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playerPosition, playerFacing, exploredMap, currentDungeonMap } = useDungeonStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentDungeonMap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileSize = 8;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw explored tiles
    for (let y = 0; y < currentDungeonMap.layout.length; y++) {
      const row = currentDungeonMap.layout[y];
      if (!row) continue;

      for (let x = 0; x < row.length; x++) {
        if (exploredMap.has(`${x},${y}`)) {
          const tile = row[x];
          const drawX = x * tileSize;
          const drawY = y * tileSize;

          switch (tile) {
            case '.':
              ctx.fillStyle = '#32b4c2';
              break;
            case '#':
              ctx.fillStyle = '#626c71';
              break;
            case '+':
              ctx.fillStyle = '#8b5cf6';
              break;
            case '<':
              ctx.fillStyle = '#22d3ee';
              break;
            case '>':
              ctx.fillStyle = '#f59e0b';
              break;
            case '$':
              ctx.fillStyle = '#eab308';
              break;
            default:
              ctx.fillStyle = '#32b4c2';
          }

          ctx.fillRect(drawX, drawY, tileSize, tileSize);
        }
      }
    }

    // Draw player position
    ctx.fillStyle = '#ff5459';
    const playerX = playerPosition.x * tileSize;
    const playerY = playerPosition.y * tileSize;
    ctx.fillRect(playerX, playerY, tileSize, tileSize);

    // Draw player facing direction
    ctx.fillStyle = '#ffffff';
    const centerX = playerX + tileSize / 2;
    const centerY = playerY + tileSize / 2;
    const directions: Array<[number, number]> = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N, E, S, W
    const direction = directions[playerFacing];
    if (direction) {
      const [dx, dy] = direction;
      ctx.fillRect(centerX + dx * 2 - 1, centerY + dy * 2 - 1, 2, 2);
    }

  }, [playerPosition, playerFacing, exploredMap, currentDungeonMap]);

  return (
    <div className="flex flex-col items-center p-4 bg-cream-100 dark:bg-charcoal-800 rounded-lg border border-gray-400/20">
      <h4 className="text-base font-medium mb-3 text-slate-900 dark:text-gray-200">Automap</h4>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="border border-gray-400/30 rounded bg-charcoal-700 mb-3"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="grid grid-cols-2 gap-2 w-full text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-gray-300">
          <span className="w-3 h-3 bg-teal-300 dark:bg-teal-300 text-charcoal-800 rounded-sm flex items-center justify-center text-xs">□</span>
          <span>Floor</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-gray-300">
          <span className="w-3 h-3 bg-slate-500 text-white rounded-sm flex items-center justify-center text-xs">■</span>
          <span>Wall</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-gray-300">
          <span className="w-3 h-3 bg-red-400 text-white rounded-sm flex items-center justify-center text-xs">●</span>
          <span>Party</span>
        </div>
      </div>
    </div>
  );
};