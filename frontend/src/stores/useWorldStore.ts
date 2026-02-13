import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorldMap, WorldLocation, TravelState } from '../types/world';
import { startingWorldMap } from '../data/worldMap';

interface WorldStore {
  worldMap: WorldMap;
  currentLocationId: string | null;
  travelState: TravelState | null;

  // Getters
  getCurrentLocation: () => WorldLocation | null;
  getLocation: (locationId: string) => WorldLocation | undefined;
  getConnectedLocations: (locationId: string) => WorldLocation[];
  isLocationDiscovered: (locationId: string) => boolean;
  isLocationAccessible: (locationId: string) => boolean;

  // Actions
  setCurrentLocation: (locationId: string) => void;
  discoverLocation: (locationId: string) => void;
  unlockLocation: (locationId: string) => void;
  completeDungeon: (dungeonId: string) => void;
  startTravel: (fromId: string, toId: string) => void;
  updateTravelProgress: (progress: number) => void;
  completeTravel: () => void;
  cancelTravel: () => void;
  resetWorld: () => void;
}

export const useWorldStore = create<WorldStore>()(
  persist(
    (set, get) => ({
      worldMap: startingWorldMap,
      currentLocationId: 'millhaven', // Start in Millhaven
      travelState: null,

      // Getters
      getCurrentLocation: () => {
        const { worldMap, currentLocationId } = get();
        if (!currentLocationId) return null;
        return (
          worldMap.locations.find(loc => loc.id === currentLocationId) || null
        );
      },

      getLocation: (locationId: string) => {
        const { worldMap } = get();
        return worldMap.locations.find(loc => loc.id === locationId);
      },

      getConnectedLocations: (locationId: string) => {
        const { worldMap } = get();
        const connections = worldMap.connections.filter(
          conn => conn.from === locationId || conn.to === locationId
        );

        const connectedIds = connections.map(conn =>
          conn.from === locationId ? conn.to : conn.from
        );

        return worldMap.locations.filter(loc => connectedIds.includes(loc.id));
      },

      isLocationDiscovered: (locationId: string) => {
        const { worldMap } = get();
        return worldMap.discoveredLocations.includes(locationId);
      },

      isLocationAccessible: (locationId: string) => {
        const location = get().getLocation(locationId);
        return location?.accessible || false;
      },

      // Actions
      setCurrentLocation: (locationId: string) =>
        set(state => {
          const location = state.worldMap.locations.find(
            loc => loc.id === locationId
          );
          if (!location) {
            console.error(`Location ${locationId} not found`);
            return state;
          }

          // Auto-discover location when visiting
          if (!state.worldMap.discoveredLocations.includes(locationId)) {
            return {
              currentLocationId: locationId,
              worldMap: {
                ...state.worldMap,
                discoveredLocations: [
                  ...state.worldMap.discoveredLocations,
                  locationId,
                ],
              },
            };
          }

          return { currentLocationId: locationId };
        }),

      discoverLocation: (locationId: string) =>
        set(state => {
          if (state.worldMap.discoveredLocations.includes(locationId)) {
            return state;
          }

          return {
            worldMap: {
              ...state.worldMap,
              discoveredLocations: [
                ...state.worldMap.discoveredLocations,
                locationId,
              ],
            },
          };
        }),

      unlockLocation: (locationId: string) =>
        set(state => {
          const updatedLocations = state.worldMap.locations.map(loc =>
            loc.id === locationId ? { ...loc, accessible: true } : loc
          );

          return {
            worldMap: {
              ...state.worldMap,
              locations: updatedLocations,
            },
          };
        }),

      completeDungeon: (dungeonId: string) =>
        set(state => {
          const updatedLocations = state.worldMap.locations.map(loc => {
            if (loc.id === dungeonId && loc.dungeonData) {
              return {
                ...loc,
                dungeonData: {
                  ...loc.dungeonData,
                  completed: true,
                },
              };
            }
            return loc;
          });

          return {
            worldMap: {
              ...state.worldMap,
              locations: updatedLocations,
            },
          };
        }),

      startTravel: (fromId: string, toId: string) =>
        set(state => {
          const connection = state.worldMap.connections.find(
            conn =>
              (conn.from === fromId && conn.to === toId) ||
              (conn.from === toId && conn.to === fromId)
          );

          if (!connection) {
            console.error(`No connection found between ${fromId} and ${toId}`);
            return state;
          }

          return {
            travelState: {
              inProgress: true,
              from: fromId,
              to: toId,
              progress: 0,
              timeElapsed: 0,
              encountersRemaining: Math.floor(
                Math.random() * connection.dangerLevel
              ),
            },
          };
        }),

      updateTravelProgress: (progress: number) =>
        set(state => {
          if (!state.travelState) return state;

          return {
            travelState: {
              ...state.travelState,
              progress: Math.min(1, Math.max(0, progress)),
            },
          };
        }),

      completeTravel: () =>
        set(state => {
          if (!state.travelState) return state;

          return {
            currentLocationId: state.travelState.to,
            travelState: null,
          };
        }),

      cancelTravel: () =>
        set({
          travelState: null,
        }),

      resetWorld: () =>
        set({
          worldMap: startingWorldMap,
          currentLocationId: 'millhaven',
          travelState: null,
        }),
    }),
    {
      name: 'dungeon-crawler-world',
    }
  )
);
