import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Position, Direction, DungeonMap } from '../types';
import { generateDungeon } from '../utils/dungeonGenerator';
import { GAME_CONFIG } from '../data/constants';
import { logger } from '../utils/logger';

interface DungeonStore {
    currentFloor: number;
    playerPosition: Position;
    playerFacing: Direction;
    exploredMap: Set<string>;
    stepCount: number;
    currentDungeonMap: DungeonMap | null;

    // Actions
    setPlayerPosition: (position: Position) => void;
    setPlayerFacing: (direction: Direction) => void;
    addExploredTile: (x: number, y: number) => void;
    incrementStepCount: () => void;
    generateFloor: (floorNumber: number) => void;
    changeFloor: (direction: 'up' | 'down') => void;
    resetDungeon: () => void;
}

export const useDungeonStore = create<DungeonStore>()(
    persist(
        (set, get) => ({
            currentFloor: 1,
            playerPosition: { x: 1, y: 1 },
            playerFacing: 0,
            exploredMap: new Set(['1,1']),
            stepCount: 0,
            currentDungeonMap: null,

            setPlayerPosition: (position) => set({ playerPosition: position }),
            setPlayerFacing: (direction) => set({ playerFacing: direction }),

            addExploredTile: (x, y) => set((state) => {
                const newExplored = new Set(state.exploredMap);
                newExplored.add(`${x},${y}`);
                return { exploredMap: newExplored };
            }),

            incrementStepCount: () => set((state) => ({ stepCount: state.stepCount + 1 })),

            generateFloor: (floorNumber) => {
                logger.info('🏗️ generateFloor called with floor:', floorNumber);
                try {
                    const { DEFAULT_WIDTH, DEFAULT_HEIGHT } = GAME_CONFIG.DUNGEON;
                    const dungeonData = generateDungeon(DEFAULT_WIDTH, DEFAULT_HEIGHT, floorNumber);

                    set({
                        currentDungeonMap: {
                            width: DEFAULT_WIDTH,
                            height: DEFAULT_HEIGHT,
                            floor: floorNumber,
                            layout: dungeonData.layout,
                            playerStart: dungeonData.playerStart,
                            stairsUp: dungeonData.stairsUp,
                            stairsDown: dungeonData.stairsDown,
                            treasureLocations: dungeonData.treasureLocations
                        },
                        currentFloor: floorNumber,
                        playerPosition: dungeonData.playerStart,
                        playerFacing: 0,
                        exploredMap: new Set([`${dungeonData.playerStart.x},${dungeonData.playerStart.y}`])
                    });
                    logger.info('✅ State updated with new dungeon');
                } catch (error) {
                    logger.error('❌ Error in generateFloor:', error);
                }
            },

            changeFloor: (direction) => {
                const state = get();
                const newFloor = direction === 'up' ? state.currentFloor - 1 : state.currentFloor + 1;

                if (newFloor < 1) return;

                const { generateFloor } = get();
                generateFloor(newFloor);
            },

            resetDungeon: () => set({
                currentFloor: 1,
                playerPosition: { x: 1, y: 1 },
                playerFacing: 0,
                exploredMap: new Set(['1,1']),
                stepCount: 0,
                currentDungeonMap: null
            })
        }),
        {
            name: 'dungeon-crawler-dungeon',
            partialize: (state) => ({
                currentFloor: state.currentFloor,
                playerPosition: state.playerPosition,
                playerFacing: state.playerFacing,
                exploredMap: Array.from(state.exploredMap),
                stepCount: state.stepCount
            }),
            merge: (persistedState: unknown, currentState) => {
                const state = persistedState as Partial<DungeonStore> | null;
                return {
                    ...currentState,
                    ...(state || {}),
                    exploredMap: new Set(state?.exploredMap || ['1,1'])
                };
            }
        }
    )
);
