import React, { useRef, useEffect } from 'react';
import { useDungeon } from '../../hooks/useDungeon';
import { useGameStore } from '../../stores/gameStore';

export const DungeonView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getTileAhead, getTileFarAhead, getTileLeft, getTileRight, getTile } = useDungeon();
  const { currentFloor, playerPosition, playerFacing, currentDungeonMap } = useGameStore();

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

    const width = canvas.width;
    const height = canvas.height;

    // Geometry Constants for 3D perspective
    // Rect 0: The screen edges (Player's current position)
    const r0 = { x: 0, y: 0, w: width, h: height };

    // Rect 1: The end of the current tile / start of next tile
    const r1 = { x: 60, y: 40, w: 280, h: 220 };

    // Rect 2: The end of the next tile / start of the far tile
    const r2 = { x: 130, y: 100, w: 140, h: 100 };

    // Rect 3: The vanishing point area (far distance)
    const r3 = { x: 170, y: 130, w: 60, h: 40 };

    // Colors
    const colors = {
      wallFace: '#4a5568', // Gray 600
      wallSide: '#2d3748', // Gray 700
      floor: '#1a202c',    // Gray 900
      ceiling: '#0f1115',  // Very dark
      door: '#8b5cf6',     // Purple
      stairs: '#22d3ee',   // Cyan
      treasure: '#eab308', // Yellow
    };

    // Helper to draw a filled polygon (trapezoid)
    const drawPoly = (points: [number, number][], color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Helper to draw a wall face
    const drawRect = (rect: { x: number, y: number, w: number, h: number }, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    };

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // --- DATA GATHERING ---
    const ahead = getTileAhead();
    const left = getTileLeft();
    const right = getTileRight();
    const farAhead = getTileFarAhead();

    // Calculate "Left of Ahead" and "Right of Ahead" for the middle section
    const [dx, dy] = getDirectionVector(playerFacing);
    const aheadX = playerPosition.x + dx;
    const aheadY = playerPosition.y + dy;

    const [lx, ly] = getDirectionVector((playerFacing + 3) % 4); // Left vector
    const leftOfAhead = getTile(aheadX + lx, aheadY + ly);

    const [rx, ry] = getDirectionVector((playerFacing + 1) % 4); // Right vector
    const rightOfAhead = getTile(aheadX + rx, aheadY + ry);

    // --- RENDERING (Back to Front) ---

    // 1. Background (Ceiling and Floor)
    // Ceiling
    ctx.fillStyle = colors.ceiling;
    ctx.fillRect(0, 0, width, height / 2);
    // Floor
    ctx.fillStyle = colors.floor;
    ctx.fillRect(0, height / 2, width, height / 2);

    // 2. FAR LAYER (2 steps away)
    // We only see this if the tile ahead is NOT a wall
    if (ahead !== '#') {
      if (farAhead === '#') {
        // Wall at distance
        drawRect(r2, '#374151'); // Darker gray
      } else {
        // Passage continues - draw vanishing point darkness
        drawRect(r3, '#111827');
      }

      // Special tiles at distance
      if (farAhead === '<' || farAhead === '>' || farAhead === '$' || farAhead === '+') {
        const color = farAhead === '+' ? colors.door : (farAhead === '$' ? colors.treasure : colors.stairs);
        ctx.fillStyle = color;
        ctx.fillRect(r2.x + r2.w * 0.4, r2.y + r2.h * 0.4, r2.w * 0.2, r2.h * 0.2);
      }
    }

    // 3. MIDDLE LAYER (1 step away)
    // This is the "corridor" we are looking into
    if (ahead !== '#') {
      // Floor of the tile ahead
      drawPoly([
        [r1.x, r1.y + r1.h], [r1.x + r1.w, r1.y + r1.h], // Bottom of R1
        [r2.x + r2.w, r2.y + r2.h], [r2.x, r2.y + r2.h]  // Bottom of R2
      ], '#2d3748');

      // Ceiling of the tile ahead
      drawPoly([
        [r1.x, r1.y], [r1.x + r1.w, r1.y], // Top of R1
        [r2.x + r2.w, r2.y], [r2.x, r2.y]  // Top of R2
      ], '#1a202c');

      // Left wall of the tile ahead
      if (leftOfAhead === '#') {
        drawPoly([
          [r1.x, r1.y], [r2.x, r2.y],           // Top-Lefts
          [r2.x, r2.y + r2.h], [r1.x, r1.y + r1.h] // Bottom-Lefts
        ], '#374151');
      } else if (leftOfAhead === '+') {
        // Door to the left
        drawPoly([
          [r1.x, r1.y], [r2.x, r2.y],           // Top-Lefts
          [r2.x, r2.y + r2.h], [r1.x, r1.y + r1.h] // Bottom-Lefts
        ], colors.door);
      }

      // Right wall of the tile ahead
      if (rightOfAhead === '#') {
        drawPoly([
          [r1.x + r1.w, r1.y], [r2.x + r2.w, r2.y],           // Top-Rights
          [r2.x + r2.w, r2.y + r2.h], [r1.x + r1.w, r1.y + r1.h] // Bottom-Rights
        ], '#374151');
      } else if (rightOfAhead === '+') {
        // Door to the right
        drawPoly([
          [r1.x + r1.w, r1.y], [r2.x + r2.w, r2.y],           // Top-Rights
          [r2.x + r2.w, r2.y + r2.h], [r1.x + r1.w, r1.y + r1.h] // Bottom-Rights
        ], colors.door);
      }
    } else {
      // Wall directly ahead (Face)
      drawRect(r1, colors.wallFace);

      // Add detail to wall
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(r1.x + 20, r1.y + 20, r1.w - 40, r1.h - 40);
    }

    // Special items ahead (1 step)
    if (ahead === '<') {
      // Stairs Up
      ctx.fillStyle = colors.stairs;
      ctx.beginPath();
      ctx.moveTo(r1.x + r1.w / 2, r1.y + r1.h * 0.2);
      ctx.lineTo(r1.x + r1.w * 0.2, r1.y + r1.h * 0.8);
      ctx.lineTo(r1.x + r1.w * 0.8, r1.y + r1.h * 0.8);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('UP', r1.x + r1.w / 2, r1.y + r1.h / 2);
    } else if (ahead === '>') {
      // Stairs Down
      ctx.fillStyle = colors.stairs;
      ctx.beginPath();
      ctx.moveTo(r1.x + r1.w / 2, r1.y + r1.h * 0.8);
      ctx.lineTo(r1.x + r1.w * 0.2, r1.y + r1.h * 0.2);
      ctx.lineTo(r1.x + r1.w * 0.8, r1.y + r1.h * 0.2);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('DOWN', r1.x + r1.w / 2, r1.y + r1.h / 2);
    } else if (ahead === '$') {
      // Treasure
      ctx.fillStyle = colors.treasure;
      ctx.fillRect(r1.x + r1.w * 0.3, r1.y + r1.h * 0.6, r1.w * 0.4, r1.h * 0.3);
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(r1.x + r1.w * 0.3, r1.y + r1.h * 0.6, r1.w * 0.4, r1.h * 0.3);
    } else if (ahead === '+') {
      // Door
      ctx.fillStyle = colors.door;
      ctx.fillRect(r1.x + r1.w * 0.2, r1.y + r1.h * 0.2, r1.w * 0.6, r1.h * 0.8);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(r1.x + r1.w * 0.7, r1.y + r1.h * 0.6, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. NEAR LAYER (Current tile)
    // Floor
    drawPoly([
      [r0.x, r0.y + r0.h], [r0.x + r0.w, r0.y + r0.h], // Bottom of Screen
      [r1.x + r1.w, r1.y + r1.h], [r1.x, r1.y + r1.h]  // Bottom of R1
    ], '#2d3748'); // Slightly lighter floor

    // Ceiling
    drawPoly([
      [r0.x, r0.y], [r0.x + r0.w, r0.y], // Top of Screen
      [r1.x + r1.w, r1.y], [r1.x, r1.y]  // Top of R1
    ], '#111827');

    // Left Wall (Current Tile)
    if (left === '#') {
      drawPoly([
        [r0.x, r0.y], [r1.x, r1.y],           // Top-Lefts
        [r1.x, r1.y + r1.h], [r0.x, r0.y + r0.h] // Bottom-Lefts
      ], colors.wallSide);
    } else if (left === '+') {
      // Door Left
      drawPoly([
        [r0.x, r0.y], [r1.x, r1.y],           // Top-Lefts
        [r1.x, r1.y + r1.h], [r0.x, r0.y + r0.h] // Bottom-Lefts
      ], colors.door);
    }

    // Right Wall (Current Tile)
    if (right === '#') {
      drawPoly([
        [r0.x + r0.w, r0.y], [r1.x + r1.w, r1.y],           // Top-Rights
        [r1.x + r1.w, r1.y + r1.h], [r0.x + r0.w, r0.y + r0.h] // Bottom-Rights
      ], colors.wallSide);
    } else if (right === '+') {
      // Door Right
      drawPoly([
        [r0.x + r0.w, r0.y], [r1.x + r1.w, r1.y],           // Top-Rights
        [r1.x + r1.w, r1.y + r1.h], [r0.x + r0.w, r0.y + r0.h] // Bottom-Rights
      ], colors.door);
    }

  }, [getTileAhead, getTileFarAhead, getTileLeft, getTileRight, getTile, playerPosition, playerFacing, currentDungeonMap]);

  const directions = ['North', 'East', 'South', 'West'];

  // Show loading state if dungeon not generated
  if (!currentDungeonMap) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-stone-900 border-4 border-stone-600">
        <div className="text-parchment-100 text-xl font-bold">Generating dungeon...</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-stone-700 rounded-sm border-4 border-stone-500 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border-4 border-stone-600 rounded-sm bg-black shadow-inner"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute top-4 left-4 bg-stone-800/90 text-gold-500 px-3 py-2 rounded-sm text-xs space-y-1 border border-gold-600/30 font-mono">
        <div>Floor {currentFloor}</div>
        <div>Position: {playerPosition.x},{playerPosition.y}</div>
        <div>Facing: {directions[playerFacing]}</div>
      </div>
    </div>
  );
};