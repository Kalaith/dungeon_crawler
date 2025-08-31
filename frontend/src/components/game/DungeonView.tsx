import React, { useRef, useEffect } from 'react';
import { useDungeon } from '../../hooks/useDungeon';
import { useGameStore } from '../../stores/gameStore';

export const DungeonView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { getTileAhead, getTileFarAhead, getTileLeft, getTileRight, getTile } = useDungeon();
  const { currentFloor, playerPosition, playerFacing } = useGameStore();

  // Helper function to get direction vectors
  const getDirectionVector = (direction: number): [number, number] => {
    const directions: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N, E, S, W
    return directions[direction];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1f2121';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;

    // Get tile information with enhanced checking
    const ahead = getTileAhead();
    const left = getTileLeft();
    const right = getTileRight();
    
    // Debug: Show what we're seeing
    console.log('\ud83c\udfae DUNGEON VIEW DEBUG:');
    console.log('Player position:', playerPosition);
    console.log('Player facing:', playerFacing, ['North', 'East', 'South', 'West'][playerFacing]);
    console.log('Tiles:', { ahead, left, right });
    
    // Check what's actually around the player in all 4 directions
    const [currentX, currentY] = [playerPosition.x, playerPosition.y];
    const northTile = getTile(currentX, currentY - 1);
    const eastTile = getTile(currentX + 1, currentY);
    const southTile = getTile(currentX, currentY + 1);
    const westTile = getTile(currentX - 1, currentY);
    
    console.log('Actual surrounding tiles:');
    console.log('North:', northTile, 'East:', eastTile, 'South:', southTile, 'West:', westTile);
    
    // Map facing direction to actual compass directions
    let actualAhead, actualLeft, actualRight;
    switch (playerFacing) {
      case 0: // North
        actualAhead = northTile;
        actualLeft = westTile;
        actualRight = eastTile;
        break;
      case 1: // East
        actualAhead = eastTile;
        actualLeft = northTile;
        actualRight = southTile;
        break;
      case 2: // South
        actualAhead = southTile;
        actualLeft = eastTile;
        actualRight = westTile;
        break;
      case 3: // West
        actualAhead = westTile;
        actualLeft = southTile;
        actualRight = northTile;
        break;
      default:
        actualAhead = ahead;
        actualLeft = left;
        actualRight = right;
    }
    
    console.log('What player should see:');
    console.log('Ahead:', actualAhead, 'Left:', actualLeft, 'Right:', actualRight);
    console.log('Functions return:', { ahead, left, right });
    console.log('Mismatch?', { 
      ahead: actualAhead !== ahead,
      left: actualLeft !== left, 
      right: actualRight !== right 
    });

    // Use the correct tile information for rendering
    const renderAhead = actualAhead;
    const renderLeft = actualLeft;
    const renderRight = actualRight;
    
    // Draw perspective corridor
    if (renderAhead !== '#') {
      // Passable tile ahead - draw corridor extending forward
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(width * 0.3, height * 0.4, width * 0.4, height * 0.2);

      // Check tiles further ahead
      const [dx, dy] = getDirectionVector(playerFacing);
      const farTile = getTile(currentX + dx * 2, currentY + dy * 2);
      if (farTile !== '#') {
        ctx.fillRect(width * 0.35, height * 0.45, width * 0.3, height * 0.1);
      } else {
        // Wall at distance
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(width * 0.35, height * 0.3, width * 0.3, height * 0.4);
      }
    } else {
      // Wall directly ahead
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(width * 0.2, height * 0.2, width * 0.6, height * 0.6);

      // Add wall details
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(width * 0.25, height * 0.25, width * 0.1, height * 0.5);
      ctx.fillRect(width * 0.65, height * 0.25, width * 0.1, height * 0.5);
    }

    // Draw side passages or walls
    if (renderLeft !== '#') {
      // Left passage exists - draw opening
      ctx.fillStyle = '#1a365d'; // Darker to show depth
      ctx.fillRect(0, height * 0.35, width * 0.25, height * 0.3);
      
      // Add passage indicator
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(width * 0.02, height * 0.37, width * 0.08, height * 0.26);
    } else {
      // Left wall
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, height * 0.3, width * 0.3, height * 0.4);
    }

    if (renderRight !== '#') {
      // Right passage exists - draw opening  
      ctx.fillStyle = '#1a365d'; // Darker to show depth
      ctx.fillRect(width * 0.75, height * 0.35, width * 0.25, height * 0.3);
      
      // Add passage indicator
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(width * 0.9, height * 0.37, width * 0.08, height * 0.26);
    } else {
      // Right wall
      ctx.fillStyle = '#374151';
      ctx.fillRect(width * 0.7, height * 0.3, width * 0.3, height * 0.4);
    }

    // Draw floor
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, height * 0.7, width, height * 0.3);

    // Draw ceiling
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height * 0.3);

    // Special tile indicators
    const drawSpecialTile = (text: string, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(width * 0.35, height * 0.35, width * 0.3, width * 0.3);

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(text, width * 0.5, height * 0.5);
    };

    // Special tile indicators using the correct tile data
    if (renderAhead === '<') {
      drawSpecialTile('Stairs Up', '#22d3ee');
    } else if (renderAhead === '>') {
      drawSpecialTile('Stairs Down', '#f59e0b');
    } else if (renderAhead === '$') {
      drawSpecialTile('Treasure', '#eab308');
    } else if (renderAhead === '+') {
      drawSpecialTile('Door', '#8b5cf6');
    }
    
    // Show side passages with indicators
    if (renderLeft === '+') {
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(width * 0.05, height * 0.45, width * 0.15, height * 0.1);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DOOR', width * 0.125, height * 0.52);
    }
    
    if (renderRight === '+') {
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(width * 0.8, height * 0.45, width * 0.15, height * 0.1);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DOOR', width * 0.875, height * 0.52);
    }

  }, [getTileAhead, getTileFarAhead, getTileLeft, getTileRight, getTile, playerPosition, playerFacing]);

  const directions = ['North', 'East', 'South', 'West'];

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-gradient-to-b from-cyan-400/8 to-blue-400/8 dark:from-cyan-400/15 dark:to-blue-400/15 rounded-lg">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border-2 border-gray-400/30 rounded-md bg-charcoal-800"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs space-y-1">
        <div>Floor {currentFloor}</div>
        <div>Position: {playerPosition.x},{playerPosition.y}</div>
        <div>Facing: {directions[playerFacing]}</div>
      </div>
    </div>
  );
};