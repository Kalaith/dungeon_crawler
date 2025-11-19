import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Item } from '../types';

interface InventoryStore {
    inventory: Item[];
    gold: number; // Shared party gold could be here, but currently it's on characters. Let's keep it simple.
    // Actually, the previous implementation had gold on characters.
    // But for crafting, we simulated a shared pool.
    // Let's stick to the previous design: gold is on characters, inventory is shared.

    addItemToInventory: (item: Item) => void;
    addItemsToInventory: (items: Item[]) => void;
    removeItemFromInventory: (itemId: string, count?: number) => void;
    hasItem: (itemId: string, count?: number) => boolean;
    resetInventory: () => void;
}

export const useInventoryStore = create<InventoryStore>()(
    persist(
        (set, get) => ({
            inventory: [],
            gold: 0, // Unused for now if we keep gold on characters

            addItemToInventory: (item) => set((state) => ({
                inventory: [...state.inventory, item]
            })),

            addItemsToInventory: (items) => set((state) => ({
                inventory: [...state.inventory, ...items]
            })),

            removeItemFromInventory: (itemId, count = 1) => set((state) => {
                const newInventory = [...state.inventory];
                let removed = 0;
                for (let i = newInventory.length - 1; i >= 0; i--) {
                    if (newInventory[i].id === itemId) {
                        newInventory.splice(i, 1);
                        removed++;
                        if (removed >= count) break;
                    }
                }
                return { inventory: newInventory };
            }),

            hasItem: (itemId, count = 1) => {
                const state = get();
                const found = state.inventory.filter(i => i.id === itemId).length;
                return found >= count;
            },

            resetInventory: () => set({ inventory: [] })
        }),
        {
            name: 'dungeon-crawler-inventory',
        }
    )
);
