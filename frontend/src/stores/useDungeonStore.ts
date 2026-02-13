import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Position, Direction, DungeonMap, FOEInstance, InteractiveTile } from '../types';
import { generateDungeon } from '../utils/dungeonGenerator';
import { gameConfig } from '../data/constants';
import { logger } from '../utils/logger';

interface DungeonStore {
    currentFloor: number;
    playerPosition: Position;
    playerFacing: Direction;
    exploredMap: Set<string>;
    stepCount: number;
    stepsUntilEncounter: number;
    currentDungeonMap: DungeonMap | null;
    foes: FOEInstance[];
    interactiveTiles: Record<string, InteractiveTile>;

    // Actions
    setPlayerPosition: (position: Position) => void;
    setPlayerFacing: (direction: Direction) => void;
    addExploredTile: (x: number, y: number) => void;
    incrementStepCount: () => void;
    decrementEncounterCounter: () => void;
    resetEncounterCounter: () => void;
    generateFloor: (floorNumber: number) => void;
    changeFloor: (direction: 'up' | 'down') => void;
    resetDungeon: () => void;
    revealMap: () => void;
    openAllDoors: () => void;

    // FOE Actions
    setFoes: (foes: FOEInstance[]) => void;
    updateFoe: (foeId: string, updates: Partial<FOEInstance>) => void;
    removeFoe: (foeId: string) => void;

    // Interactive Tile Actions
    setInteractiveTiles: (tiles: Record<string, InteractiveTile>) => void;
    updateInteractiveTile: (tileId: string, updates: Partial<InteractiveTile>) => void;
}

export const useDungeonStore = create<DungeonStore>()(
    persist(
        (set, get) => ({
            currentFloor: 1,
            playerPosition: { x: 1, y: 1 },
            playerFacing: 0,
            exploredMap: new Set(),
            stepCount: 0,
            stepsUntilEncounter: 30, // Initial safe buffer
            currentDungeonMap: null,
            foes: [],
            interactiveTiles: {},

            setPlayerPosition: (position) => set({ playerPosition: position }),
            setPlayerFacing: (direction) => set({ playerFacing: direction }),

            addExploredTile: (x, y) => set((state) => {
                const newExplored = new Set(state.exploredMap);
                newExplored.add(`${x},${y}`);
                return { exploredMap: newExplored };
            }),

            incrementStepCount: () => set((state) => ({ stepCount: state.stepCount + 1 })),

            decrementEncounterCounter: () => set((state) => ({
                stepsUntilEncounter: Math.max(0, state.stepsUntilEncounter - 1)
            })),

            resetEncounterCounter: () => set(() => ({
                // Random steps between 20 and 45
                stepsUntilEncounter: Math.floor(Math.random() * 26) + 20
            })),

            generateFloor: (floorNumber) => {
                logger.info('🏗️ generateFloor called with floor:', floorNumber);
                try {
                    const { DEFAULT_WIDTH: defaultWidth, DEFAULT_HEIGHT: defaultHeight } = gameConfig.DUNGEON;
                    const dungeonData = generateDungeon(defaultWidth, defaultHeight, floorNumber);

                    set({
                        currentDungeonMap: {
                            width: defaultWidth,
                            height: defaultHeight,
                            floor: floorNumber,
                            layout: dungeonData.layout,
                            playerStart: dungeonData.playerStart,
                            stairsUp: dungeonData.stairsUp,
                            stairsDown: dungeonData.stairsDown,
                            treasureLocations: dungeonData.treasureLocations,
                            explored: [] // Placeholder, not used in store state directly but in map object
                        },
                        currentFloor: floorNumber,
                        playerPosition: dungeonData.playerStart,
                        playerFacing: 0,
                        exploredMap: new Set([`${dungeonData.playerStart.x},${dungeonData.playerStart.y}`]),
                        foes: dungeonData.foes || [],
                        interactiveTiles: dungeonData.interactiveTiles || {}
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

                const { generateFloor, resetEncounterCounter } = get();
                generateFloor(newFloor);
                resetEncounterCounter();
            },

            resetDungeon: () => set({
                currentFloor: 1,
                playerPosition: { x: 1, y: 1 },
                playerFacing: 0,
                exploredMap: new Set(),
                stepCount: 0,
                stepsUntilEncounter: 30,
                currentDungeonMap: null,
                foes: [],
                interactiveTiles: {}
            }),

            revealMap: () => set((state) => {
                if (!state.currentDungeonMap) return {};
                const newExplored = new Set<string>();
                for (let y = 0; y < state.currentDungeonMap.height; y++) {
                    for (let x = 0; x < state.currentDungeonMap.width; x++) {
                        newExplored.add(`${x},${y}`);
                    }
                }
                return { exploredMap: newExplored };
            }),

            openAllDoors: () => set((state) => {
                const newTiles: Record<string, InteractiveTile> = { ...state.interactiveTiles };
                Object.keys(newTiles).forEach(key => {
                    const tile = newTiles[key];
                    if (tile && tile.type === 'door') {
                        newTiles[key] = { ...tile, state: 'open' };
                    }
                });
                return { interactiveTiles: newTiles };
            }),

            setFoes: (foes) => set({ foes }),

            updateFoe: (foeId, updates) => set((state) => ({
                foes: state.foes.map(f => f.id === foeId ? { ...f, ...updates } : f)
            })),

            removeFoe: (foeId) => set((state) => ({
                foes: state.foes.filter(f => f.id !== foeId)
            })),

            setInteractiveTiles: (tiles) => set({ interactiveTiles: tiles }),

            updateInteractiveTile: (tileId, updates) => set((state) => ({
                interactiveTiles: {
                    ...state.interactiveTiles,
                    [tileId]: { ...state.interactiveTiles[tileId], ...updates }
                }
            }))
        }),
        {
            name: 'dungeon-crawler-dungeon',
            partialize: (state) => ({
                currentFloor: state.currentFloor,
                playerPosition: state.playerPosition,
                playerFacing: state.playerFacing,
                exploredMap: Array.from(state.exploredMap),
                stepCount: state.stepCount,
                stepsUntilEncounter: state.stepsUntilEncounter,
                foes: state.foes,
                interactiveTiles: state.interactiveTiles
            }),
            merge: (persistedState: unknown, currentState) => {
                const state = persistedState as Partial<DungeonStore> | null;
                return {
                    ...currentState,
                    ...(state || {}),
                    exploredMap: new Set(state?.exploredMap || [])
                };
            }
        }
    )
);
