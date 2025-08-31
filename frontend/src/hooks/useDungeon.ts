import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';
import { dungeonMap, enemies } from '../data/gameData';
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
    addGoldToParty
  } = useGameStore();

  const { showMessage } = useUIStore();

  const getTile = useCallback((x: number, y: number): string => {
    if (y < 0 || y >= dungeonMap.layout.length || x < 0 || x >= dungeonMap.layout[0].length) {
      return '#';
    }
    return dungeonMap.layout[y][x];
  }, []);

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
        showMessage('You found stairs going up to the previous floor!');
      } else if (tile === '>') {
        showMessage('You found stairs going down to the next floor!');
      } else if (tile === '$') {
        showMessage('You found treasure!');
      } else if (tile === '+') {
        showMessage('You opened a door!');
      }

      // Random encounter check
      if (Math.random() < 0.15 && tile === '.') {
        setTimeout(() => {
          const enemy = {...enemies[Math.floor(Math.random() * enemies.length)]};
          startCombat(enemy);
        }, 500);
      } else if (tile === '$') {
        // Generate treasure loot
        const loot = generateLoot(1); // Base treasure level
        addGoldToParty(loot.gold);
        showMessage(`You found ${loot.gold} gold!`);
        if (loot.items.length > 0) {
          showMessage(`You also found: ${loot.items.map(i => i.name).join(', ')}`);
        }
      }
    }
  }, [inCombat, playerPosition, playerFacing, getDirectionVector, getTile, setPlayerPosition, addExploredTile, incrementStepCount, showMessage, startCombat, generateLoot, addGoldToParty]);

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