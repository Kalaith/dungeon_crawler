import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Item } from '../types';

export interface InventoryItem extends Item {
    quantity: number;
}

interface InventoryStore {
    items: InventoryItem[];
    addItem: (item: Item, quantity?: number) => void;
    removeItem: (itemId: string, quantity?: number) => void;
    getItem: (itemId: string) => InventoryItem | undefined;
    getItemsByCategory: (category: string) => InventoryItem[];
    hasItem: (itemId: string, quantity?: number) => boolean;
    clearInventory: () => void;

    // Legacy methods for compatibility
    inventory: Item[];
    addItemToInventory: (item: Item) => void;
    addItemsToInventory: (items: Item[]) => void;
    removeItemFromInventory: (itemId: string, count?: number) => void;
    resetInventory: () => void;
}

export const useInventoryStore = create<InventoryStore>()(
    persist(
        (set, get) => ({
            items: [],
            inventory: [], // Legacy

            addItem: (item: Item, quantity = 1) => {
                if (quantity <= 0) return;

                set((state) => {
                    const existingIndex = state.items.findIndex((i) => i.id === item.id);

                    if (existingIndex >= 0) {
                        // Item exists - check if stackable
                        if (item.stackable) {
                            const updatedItems = [...state.items];
                            updatedItems[existingIndex] = {
                                ...updatedItems[existingIndex],
                                quantity: updatedItems[existingIndex].quantity + quantity,
                            };
                            return { items: updatedItems, inventory: updatedItems as Item[] };
                        } else {
                            // Non-stackable items (weapons/armor) - add as separate entry
                            const newItem: InventoryItem = { ...item, quantity: 1 };
                            const newItems = [...state.items, newItem];
                            return { items: newItems, inventory: newItems as Item[] };
                        }
                    } else {
                        // New item
                        const newItem: InventoryItem = { ...item, quantity };
                        const newItems = [...state.items, newItem];
                        return { items: newItems, inventory: newItems as Item[] };
                    }
                });
            },

            removeItem: (itemId: string, quantity = 1) => {
                if (quantity <= 0) return;

                set((state) => {
                    const existingIndex = state.items.findIndex((i) => i.id === itemId);

                    if (existingIndex < 0) return state;

                    const item = state.items[existingIndex];
                    if (!item) return state;

                    const newQuantity = item.quantity - quantity;

                    if (newQuantity <= 0) {
                        // Remove item completely
                        const newItems = state.items.filter((i) => i.id !== itemId);
                        return { items: newItems, inventory: newItems as Item[] };
                    } else {
                        // Decrease quantity
                        const updatedItems = [...state.items];
                        updatedItems[existingIndex] = {
                            ...item,
                            quantity: newQuantity,
                        };
                        return { items: updatedItems, inventory: updatedItems as Item[] };
                    }
                });
            },

            getItem: (itemId: string) => {
                return get().items.find((i) => i.id === itemId);
            },

            getItemsByCategory: (category: string) => {
                return get().items.filter((i) => i.type === category);
            },

            hasItem: (itemId: string, quantity = 1) => {
                const item = get().getItem(itemId);
                return item ? item.quantity >= quantity : false;
            },

            clearInventory: () => {
                set({ items: [], inventory: [] });
            },

            // Legacy methods for compatibility
            addItemToInventory: (item) => {
                get().addItem(item, 1);
            },

            addItemsToInventory: (items) => {
                items.forEach((item) => get().addItem(item, 1));
            },

            removeItemFromInventory: (itemId, count = 1) => {
                get().removeItem(itemId, count);
            },

            resetInventory: () => {
                get().clearInventory();
            },
        }),
        {
            name: 'dungeon-crawler-inventory',
        }
    )
);
