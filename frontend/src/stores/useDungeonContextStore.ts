import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Dungeon Context Store
 * Tracks which dungeon the player is currently in and manages entry/exit
 */
interface DungeonContextStore {
  currentDungeonId: string | null; // ID of the dungeon from world map
  enteredFromLocationId: string | null; // Where the player entered from

  // Actions
  enterDungeon: (dungeonId: string, fromLocationId: string) => void;
  exitDungeon: () => { returnToLocationId: string | null };
  getCurrentDungeonId: () => string | null;
  isInDungeon: () => boolean;
}

export const useDungeonContextStore = create<DungeonContextStore>()(
  persist(
    (set, get) => ({
      currentDungeonId: null,
      enteredFromLocationId: null,

      enterDungeon: (dungeonId, fromLocationId) => {
        set({
          currentDungeonId: dungeonId,
          enteredFromLocationId: fromLocationId,
        });
      },

      exitDungeon: () => {
        const { enteredFromLocationId } = get();
        set({
          currentDungeonId: null,
          enteredFromLocationId: null,
        });
        return { returnToLocationId: enteredFromLocationId };
      },

      getCurrentDungeonId: () => {
        return get().currentDungeonId;
      },

      isInDungeon: () => {
        return get().currentDungeonId !== null;
      },
    }),
    {
      name: 'dungeon-crawler-dungeon-context',
    }
  )
);
