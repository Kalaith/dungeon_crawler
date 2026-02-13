import { useCallback, useEffect, useRef } from 'react';
import { useDungeonStore } from '../stores/useDungeonStore';
import { useCombatStore } from '../stores/useCombatStore';
import { usePartyStore } from '../stores/usePartyStore';
import { useInventoryStore } from '../stores/useInventoryStore';
import { useProgressionStore } from '../stores/useProgressionStore';
import { useUIStore } from '../stores/uiStore';
import { foeData } from '../data/foes';
import { enemies } from '../data/enemies';
import type { Direction, Position, CombatParticipant, Enemy } from '../types';

export const useDungeon = () => {
  const {
    playerPosition,
    playerFacing,
    setPlayerPosition,
    setPlayerFacing,
    addExploredTile,
    incrementStepCount,
    stepsUntilEncounter,
    decrementEncounterCounter,
    resetEncounterCounter,
    currentDungeonMap,
    generateFloor,
    changeFloor,
    currentFloor,
    foes,
    interactiveTiles,
    setFoes,
    updateInteractiveTile
  } = useDungeonStore();

  const { inCombat, startCombat } = useCombatStore();
  const { addGoldToParty, getAlivePartyMembers } = usePartyStore();
  const { addItemsToInventory } = useInventoryStore();
  const { generateLoot } = useProgressionStore();
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
  }, [currentDungeonMap, generateFloor]);

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
    // Get the tile to the left of the player (perpendicular to facing)
    const leftDirection = ((playerFacing + 3) % 4) as Direction;
    const [lx, ly] = getDirectionVector(leftDirection);
    return getTile(playerPosition.x + lx, playerPosition.y + ly);
  }, [playerFacing, getDirectionVector, getTile, playerPosition]);

  const getTileRight = useCallback(() => {
    // Get the tile to the right of the player (perpendicular to facing)
    const rightDirection = ((playerFacing + 1) % 4) as Direction;
    const [rx, ry] = getDirectionVector(rightDirection);
    return getTile(playerPosition.x + rx, playerPosition.y + ry);
  }, [playerFacing, getDirectionVector, getTile, playerPosition]);

  const checkForFoeCollision = useCallback((pos: Position) => {
    const foe = foes.find(f => f.x === pos.x && f.y === pos.y);
    if (foe) {
      // Trigger combat with FOE
      const foeDef = foeData[foe.defId];
      if (foeDef) {
        // Prepare combat participants
        const partyMembers = getAlivePartyMembers();

        const enemy: Enemy = {
          ...foeDef,
          id: foe.id,
          hp: foe.hp,
          maxHp: foe.maxHp,
          statusEffects: []
        };

        const participants: CombatParticipant[] = [
          {
            id: foe.id,
            type: 'enemy',
            enemy: enemy,
            initiative: foeDef.derivedStats.Initiative,
            status: 'active'
          },
          ...partyMembers.map((char) => ({
            id: char.id,
            type: 'party' as const,
            character: char,
            initiative: char.derivedStats.Initiative,
            status: 'active' as const
          }))
        ];

        startCombat(enemy, participants);
        return true;
      }
    }
    return false;
  }, [foes, getAlivePartyMembers, showMessage, startCombat]);

  const moveFoes = useCallback(() => {
    const newFoes = [...foes];
    let updated = false;

    newFoes.forEach(foe => {
      // Simple random movement for now, can be improved with patterns
      // Only move if not in combat (which is handled globally, but good to check)

      // 50% chance to move
      if (Math.random() > 0.5) return;

      const directions: Direction[] = [0, 1, 2, 3];
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      const [dx, dy] = getDirectionVector(randomDir);
      const newX = foe.x + dx;
      const newY = foe.y + dy;

      // Check bounds and walls
      if (getTile(newX, newY) === '.') {
        // Check if another FOE is there
        if (!newFoes.some(f => f.id !== foe.id && f.x === newX && f.y === newY)) {
          foe.x = newX;
          foe.y = newY;
          foe.facing = randomDir;
          updated = true;
        }
      }
    });

    if (updated) {
      setFoes(newFoes);

      // Check for collision after FOE move
      if (checkForFoeCollision(playerPosition)) {
        return;
      }
    }
  }, [foes, getDirectionVector, getTile, setFoes, checkForFoeCollision, playerPosition]);

  const interactWithTile = useCallback(() => {
    const tileId = Object.keys(interactiveTiles).find(key => {
      const tile = interactiveTiles[key];
      return tile.x === playerPosition.x && tile.y === playerPosition.y;
    });

    if (tileId) {
      const tile = interactiveTiles[tileId];
      if (tile.type === 'gathering_point' && tile.state === 'active') {
        // Gather logic
        const loot = generateLoot(currentFloor); // Simplified loot
        addGoldToParty(loot.gold);
        if (loot.items.length > 0) addItemsToInventory(loot.items);

        showMessage(`Gathered: ${loot.gold} gold${loot.items.length > 0 ? ' and items' : ''}`);
        updateInteractiveTile(tileId, { state: 'depleted' });
      }
    }
  }, [interactiveTiles, playerPosition, generateLoot, currentFloor, addGoldToParty, addItemsToInventory, showMessage, updateInteractiveTile]);

  const moveForward = useCallback(() => {
    if (inCombat) return;

    const [dx, dy] = getDirectionVector(playerFacing);
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    const tile = getTile(newX, newY);

    // Check for interactive tiles blocking path (Doors)
    const doorId = Object.keys(interactiveTiles).find(key => {
      const t = interactiveTiles[key];
      return t.x === newX && t.y === newY && t.type === 'door';
    });

    if (doorId) {
      const door = interactiveTiles[doorId];
      if (door && door.state === 'closed') {
        updateInteractiveTile(doorId, { state: 'open' });
        return; // Don't move, just open
      } else if (door && door.state === 'locked') {
        showMessage('The door is locked.');
        return;
      }
    }

    if (tile !== '#') {
      // Check for FOE collision before moving
      if (checkForFoeCollision({ x: newX, y: newY })) {
        return;
      }

      setPlayerPosition({ x: newX, y: newY });

      // Reveal tiles in a 1-tile radius around the player
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const exploreX = newX + dx;
          const exploreY = newY + dy;
          addExploredTile(exploreX, exploreY);
        }
      }

      incrementStepCount();

      // Move FOEs after player moves
      moveFoes();

      // Handle special tiles
      if (tile === '<') {
        showMessage('You found stairs going up! Press Enter to ascend.');
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
      }

      // Random encounter check (Step Counter System)
      if (tile === '.') {
        decrementEncounterCounter();

        if (stepsUntilEncounter <= 0) {
          setTimeout(() => {
            // Scale enemies by floor
            const floorEnemies = enemies.filter(e => e.level <= currentFloor + 1 && e.level >= Math.max(1, currentFloor - 2));
            // Fallback if no specific level enemies found
            const availableEnemies = floorEnemies.length > 0 ? floorEnemies : enemies;

            if (availableEnemies.length > 0) {
              // Create a random enemy instance
              const enemyDef = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];

              if (enemyDef) {
                const enemy: Enemy = {
                  ...enemyDef,
                  id: `enemy_${Math.random().toString(36).substr(2, 9)}`,
                  hp: enemyDef.maxHp,
                  maxHp: enemyDef.maxHp,
                  statusEffects: []
                };

                // Prepare combat participants
                const partyMembers = getAlivePartyMembers();
                const participants: CombatParticipant[] = [
                  {
                    id: enemy.id,
                    type: 'enemy',
                    enemy: enemy,
                    initiative: enemyDef.derivedStats.Initiative,
                    status: 'active'
                  },
                  ...partyMembers.map((char) => ({
                    id: char.id,
                    type: 'party' as const,
                    character: char,
                    initiative: char.derivedStats.Initiative,
                    status: 'active' as const
                  }))
                ];

                startCombat(enemy, participants);
                resetEncounterCounter();
              }
            }
          }, 500);
        }
      } else if (tile === '$') {
        // Generate treasure loot scaled by floor
        const loot = generateLoot(currentFloor);
        addGoldToParty(loot.gold);
        if (loot.items.length > 0) {
          addItemsToInventory(loot.items);
        }

        showMessage(`You found ${loot.gold} gold!`);
        if (loot.items.length > 0) {
          showMessage(`You also found: ${loot.items.map(i => i.name).join(', ')}`);
        }
      }
    }
  }, [inCombat, playerPosition, playerFacing, getDirectionVector, getTile, setPlayerPosition, addExploredTile, incrementStepCount, showMessage, startCombat, generateLoot, addGoldToParty, changeFloor, currentFloor, getAlivePartyMembers, addItemsToInventory, interactiveTiles, updateInteractiveTile, checkForFoeCollision, moveFoes, stepsUntilEncounter, decrementEncounterCounter, resetEncounterCounter]);

  const moveBackward = useCallback(() => {
    if (inCombat) return;

    const [dx, dy] = getDirectionVector(playerFacing);
    const newX = playerPosition.x - dx;
    const newY = playerPosition.y - dy;
    const tile = getTile(newX, newY);

    if (tile !== '#') {
      // Check for FOE collision
      if (checkForFoeCollision({ x: newX, y: newY })) {
        return;
      }

      setPlayerPosition({ x: newX, y: newY });

      // Reveal tiles in a 1-tile radius around the player
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const exploreX = newX + dx;
          const exploreY = newY + dy;
          addExploredTile(exploreX, exploreY);
        }
      }

      incrementStepCount();

      // Also check for encounters when moving backward
      if (tile === '.') {
        decrementEncounterCounter();
        if (stepsUntilEncounter <= 0) {
          // Trigger combat logic (reuse from moveForward or extract to helper)
          // For now, just reset to avoid immediate loop, but ideally trigger combat
          setTimeout(() => {
            const floorEnemies = enemies.filter(e => e.level <= currentFloor + 1 && e.level >= Math.max(1, currentFloor - 2));
            const availableEnemies = floorEnemies.length > 0 ? floorEnemies : enemies;

            if (availableEnemies.length > 0) {
              const enemyDef = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];

              if (enemyDef) {
                const enemy: Enemy = {
                  ...enemyDef,
                  id: `enemy_${Math.random().toString(36).substr(2, 9)}`,
                  hp: enemyDef.maxHp,
                  maxHp: enemyDef.maxHp,
                  statusEffects: []
                };

                const partyMembers = getAlivePartyMembers();
                const participants: CombatParticipant[] = [
                  {
                    id: enemy.id,
                    type: 'enemy',
                    enemy: enemy,
                    initiative: enemyDef.derivedStats.Initiative,
                    status: 'active'
                  },
                  ...partyMembers.map((char) => ({
                    id: char.id,
                    type: 'party' as const,
                    character: char,
                    initiative: char.derivedStats.Initiative,
                    status: 'active' as const
                  }))
                ];

                startCombat(enemy, participants);
                resetEncounterCounter();
              }
            }
          }, 500);
        }
      }

      moveFoes();
    }
  }, [inCombat, playerPosition, playerFacing, getDirectionVector, getTile, setPlayerPosition, addExploredTile, incrementStepCount, checkForFoeCollision, moveFoes, stepsUntilEncounter, decrementEncounterCounter, resetEncounterCounter, currentFloor, getAlivePartyMembers, showMessage, startCombat]);

  const turnLeft = useCallback(() => {
    if (inCombat) return;
    setPlayerFacing(((playerFacing + 3) % 4) as Direction);
    moveFoes(); // Turning takes a turn? Usually yes in these games.
  }, [inCombat, playerFacing, setPlayerFacing, moveFoes]);

  const turnRight = useCallback(() => {
    if (inCombat) return;
    setPlayerFacing(((playerFacing + 1) % 4) as Direction);
    moveFoes();
  }, [inCombat, playerFacing, setPlayerFacing, moveFoes]);

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
    turnRight,
    interactWithTile
  };
};
