import { generateDungeon } from '../../utils/dungeonGenerator';
import type { GameSliceCreator, DungeonSlice } from './types';

export const createDungeonSlice: GameSliceCreator<DungeonSlice> = (set, get) => ({
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
        console.log('🏗️ generateFloor called with floor:', floorNumber);
        try {
            const dungeonData = generateDungeon(20, 20, floorNumber);
            console.log('✅ Dungeon data generated:', dungeonData);

            set({
                currentDungeonMap: {
                    width: 20,
                    height: 20,
                    floor: floorNumber,
                    layout: dungeonData.layout,
                    playerStart: dungeonData.playerStart,
                    stairsUp: dungeonData.stairsUp,
                    stairsDown: dungeonData.stairsDown,
                    treasureLocations: dungeonData.treasureLocations,
                    explored: Array(20).fill(false).map(() => Array(20).fill(false)) // Initialize explored map
                },
                currentFloor: floorNumber,
                playerPosition: dungeonData.playerStart,
                playerFacing: 0,
                exploredMap: new Set([`${dungeonData.playerStart.x},${dungeonData.playerStart.y}`])
            });
            console.log('✅ State updated with new dungeon');
        } catch (error) {
            console.error('❌ Error in generateFloor:', error);
        }
    },

    changeFloor: (direction) => {
        const state = get();
        const newFloor = direction === 'up' ? state.currentFloor - 1 : state.currentFloor + 1;

        if (newFloor < 1) return; // Can't go above floor 1

        const { generateFloor } = get();
        generateFloor(newFloor);
    }
});
