import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';
import { enemies } from '../data/gameData';
import type { Direction } from '../types';

export const useDungeon = () => {
  const {
    playerPosition,
    playerFacing,
    setPlayerPosition,
    setPlayerFacing,
    addExploredTile,
    incrementStepCount,
    inCombat,
    startCombat,
    generateLoot,
    addGoldToParty,
    currentDungeonMap,
    generateFloor,
    changeFloor,
    currentFloor
  } = useGameStore();

  const { showMessage } = useUIStore();
  const hasGenerated = useRef(false);

  // Generate initial floor if no dungeon exists
  useEffect(() => {
    if (!currentDungeonMap && !hasGenerated.current) {
      console.log('🏗️ Generating initial dungeon floor 1...');
      hasGenerated.current = true;
      try {
        generateFloor(1);
        console.log('✅ Dungeon generation complete');
      } catch (error) {
        console.error('❌ Error generating dungeon:', error);
        hasGenerated.current = false; // Reset on error
      }
    }
  }, [currentDungeonMap, generateFloor]); // Include all dependencies

  const getTile = useCallback((x: number, y: number): string => {
    if (!currentDungeonMap) return '#';
    if (y < 0 || y >= currentDungeonMap.layout.length || x < 0 || x >= currentDungeonMap.layout[0].length) {
      return '#';
    }
    return currentDungeonMap.layout[y][x];
  }, [currentDungeonMap]);

  const getDirectionVector = useCallback((direction: Direction): [number, number] => {
    const directions: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N, E, S, W
    return directions[direction];
  }, []);

  const getTileInDirection = useCallback((direction: Direction, distance: number = 1): string => {
    const [dx, dy] = getDirectionVector(direction);
    return getTile(playerPosition.x + dx * distance, playerPosition.y + dy * distance);
  }, [playerPosition, getDirectionVector, getTile]);

  const getTileAhead = useCallback(() => getTileInDirection(playerFacing), [getTileInDirection, playerFacing]);
  const getTileFarAhead = useCallback(() => getTileInDirection(playerFacing, 2), [getTileInDirection, playerFacing]);
  const getTileLeft = useCallback(() => {
    const leftDirection = ((playerFacing + 3) % 4) as Direction;
    return getTileInDirection(leftDirection);
  }, [getTileInDirection, playerFacing]);
  const getTileRight = useCallback(() => {
    const rightDirection = ((playerFacing + 1) % 4) as Direction;
    return getTileInDirection(rightDirection);
  }, [getTileInDirection, playerFacing]);

  const moveForward = useCallback(() => {
    if (inCombat) return;

    const [dx, dy] = getDirectionVector(playerFacing);
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    const tile = getTile(newX, newY);

    if (tile !== '#') {
      setPlayerPosition({ x: newX, y: newY });
      addExploredTile(newX, newY);
      incrementStepCount();

      // Handle special tiles
      if (tile === '<') {
        showMessage('You found stairs going up! Press Enter to ascend.');
        // Check if player wants to go up
        setTimeout(() => {
          if (currentFloor > 1) {
            changeFloor('up');
            showMessage(`Ascending to floor ${currentFloor - 1}...`);
          } else {
            showMessage('These stairs lead to the surface.');
          }
        }, 100);
      } else if (tile === '>') {
        showMessage('You found stairs going down! Press Enter to descend.');
        setTimeout(() => {
          changeFloor('down');
          showMessage(`Descending to floor ${currentFloor + 1}...`);
        }, 100);
      } else if (tile === '$') {
        showMessage('You found treasure!');
      } else if (tile === '+') {
        showMessage('You opened a door!');
      }

      // Random encounter check (scaled by floor)
      const encounterChance = 0.10 + (currentFloor * 0.02);
      if (Math.random() < encounterChance && tile === '.') {
        setTimeout(() => {
          // Scale enemies by floor
          const floorEnemies = enemies.filter(e => e.level <= currentFloor + 1);
          const enemy = { ...floorEnemies[Math.floor(Math.random() * floorEnemies.length)] };
          startCombat(enemy);
        }, 500);
      } else if (tile === '$') {
        // Generate treasure loot scaled by floor
        const loot = generateLoot(currentFloor);
        addGoldToParty(loot.gold);
        showMessage(`You found ${loot.gold} gold!`);
        if (loot.items.length > 0) {
          showMessage(`You also found: ${loot.items.map(i => i.name).join(', ')}`);
        }
      }
    }
  }, [inCombat, playerPosition, playerFacing, getDirectionVector, getTile, setPlayerPosition, addExploredTile, incrementStepCount, showMessage, startCombat, generateLoot, addGoldToParty, changeFloor, currentFloor]);

  const moveBackward = useCallback(() => {
    if (inCombat) return;

    const [dx, dy] = getDirectionVector(playerFacing);
    const newX = playerPosition.x - dx;
    const newY = playerPosition.y - dy;
    const tile = getTile(newX, newY);

    if (tile !== '#') {
      setPlayerPosition({ x: newX, y: newY });
      addExploredTile(newX, newY);
      incrementStepCount();
    }
  }, [inCombat, playerPosition, playerFacing, getDirectionVector, getTile, setPlayerPosition, addExploredTile, incrementStepCount]);

  const turnLeft = useCallback(() => {
    if (inCombat) return;
    setPlayerFacing(((playerFacing + 3) % 4) as Direction);
  }, [inCombat, playerFacing, setPlayerFacing]);

  const turnRight = useCallback(() => {
    if (inCombat) return;
    setPlayerFacing(((playerFacing + 1) % 4) as Direction);
  }, [inCombat, playerFacing, setPlayerFacing]);

  return {
    playerPosition,
    playerFacing,
    getTile,
    getTileAhead,
    getTileFarAhead,
    getTileLeft,
    getTileRight,
    moveForward,
    moveBackward,
    turnLeft,
    turnRight
  };
};