import { describe, it, expect, beforeEach } from 'vitest';
import { useInventoryStore } from '../useInventoryStore';
import type { Item } from '../../types';

describe('useInventoryStore', () => {
    beforeEach(() => {
        // Reset store to initial state before each test
        const store = useInventoryStore.getState();
        store.clearInventory();
    });

    const createMockItem = (id: string, stackable: boolean = true): Item => ({
        id,
        name: `Test Item ${id}`,
        type: stackable ? 'consumable' : 'weapon',
        category: stackable ? 'potions' : 'weapons',
        rarity: 'common',
        value: 10,
        description: 'Test item',
        stackable,
        icon: '🧪',
    });

    describe('Initial State', () => {
        it('should start with empty inventory', () => {
            const { items } = useInventoryStore.getState();
            expect(items).toEqual([]);
            expect(items.length).toBe(0);
        });
    });

    describe('Add Item', () => {
        it('should add new item to inventory', () => {
            const { addItem } = useInventoryStore.getState();
            const item = createMockItem('potion1');

            addItem(item, 1);

            const { items } = useInventoryStore.getState();
            expect(items.length).toBe(1);
            expect(items[0].id).toBe('potion1');
            expect(items[0].quantity).toBe(1);
        });

        it('should add multiple items with quantity', () => {
            const { addItem } = useInventoryStore.getState();
            const item = createMockItem('potion1');

            addItem(item, 5);

            const { items } = useInventoryStore.getState();
            expect(items[0].quantity).toBe(5);
        });
    });

    describe('Stack Items', () => {
        it('should stack stackable items correctly', () => {
            const { addItem } = useInventoryStore.getState();
            const item = createMockItem('potion1', true);

            addItem(item, 3);
            addItem(item, 2);

            const { items } = useInventoryStore.getState();
            expect(items.length).toBe(1);
            expect(items[0].quantity).toBe(5);
        });

        it('should not stack non-stackable items', () => {
            const { addItem } = useInventoryStore.getState();
            const item = createMockItem('sword1', false);

            addItem(item, 1);
            addItem(item, 1);

            const { items } = useInventoryStore.getState();
            expect(items.length).toBe(2);
            expect(items[0].quantity).toBe(1);
            expect(items[1].quantity).toBe(1);
        });
    });

    describe('Remove Item', () => {
        it('should remove item and decrease quantity', () => {
            const { addItem, removeItem } = useInventoryStore.getState();
            const item = createMockItem('potion1');

            addItem(item, 5);
            removeItem('potion1', 2);

            const { items } = useInventoryStore.getState();
            expect(items[0].quantity).toBe(3);
        });

        it('should not remove more than available', () => {
            const { addItem, removeItem } = useInventoryStore.getState();
            const item = createMockItem('potion1');

            addItem(item, 3);
            removeItem('potion1', 5);

            const { items } = useInventoryStore.getState();
            expect(items.length).toBe(0);
        });
    });

    describe('Remove Last', () => {
        it('should remove item from inventory when quantity reaches 0', () => {
            const { addItem, removeItem } = useInventoryStore.getState();
            const item = createMockItem('potion1');

            addItem(item, 3);
            removeItem('potion1', 3);

            const { items } = useInventoryStore.getState();
            expect(items.length).toBe(0);
        });

        it('should remove item when removing more than available', () => {
            const { addItem, removeItem } = useInventoryStore.getState();
            const item = createMockItem('potion1');

            addItem(item, 2);
            removeItem('potion1', 5);

            const { items } = useInventoryStore.getState();
            expect(items.length).toBe(0);
        });
    });

    describe('Find Item', () => {
        it('should return item by ID', () => {
            const { addItem, getItem } = useInventoryStore.getState();
            const item = createMockItem('potion1');

            addItem(item, 3);
            const found = getItem('potion1');

            expect(found).toBeDefined();
            expect(found?.id).toBe('potion1');
            expect(found?.quantity).toBe(3);
        });

        it('should return undefined for non-existent item', () => {
            const { getItem } = useInventoryStore.getState();
            const found = getItem('nonexistent');

            expect(found).toBeUndefined();
        });
    });

    describe('Category Filter', () => {
        it('should return items by category', () => {
            const { addItem, getItemsByCategory } = useInventoryStore.getState();
            const potion = createMockItem('potion1', true);
            const weapon = createMockItem('sword1', false);

            addItem(potion, 1);
            addItem(weapon, 1);

            const consumables = getItemsByCategory('consumable');
            const weapons = getItemsByCategory('weapon');

            expect(consumables.length).toBe(1);
            expect(weapons.length).toBe(1);
            expect(consumables[0].id).toBe('potion1');
            expect(weapons[0].id).toBe('sword1');
        });

        it('should return empty array for category with no items', () => {
            const { getItemsByCategory } = useInventoryStore.getState();
            const items = getItemsByCategory('armor');

            expect(items).toEqual([]);
        });
    });

    describe('Has Item', () => {
        it('should return true when item exists with sufficient quantity', () => {
            const { addItem, hasItem } = useInventoryStore.getState();
            const item = createMockItem('potion1');

            addItem(item, 5);

            expect(hasItem('potion1', 3)).toBe(true);
            expect(hasItem('potion1', 5)).toBe(true);
        });

        it('should return false when item does not exist', () => {
            const { hasItem } = useInventoryStore.getState();
            expect(hasItem('nonexistent', 1)).toBe(false);
        });

        it('should return false when quantity is insufficient', () => {
            const { addItem, hasItem } = useInventoryStore.getState();
            const item = createMockItem('potion1');

            addItem(item, 3);

            expect(hasItem('potion1', 5)).toBe(false);
        });
    });

    describe('Clear Inventory', () => {
        it('should clear all items from inventory', () => {
            const { addItem, clearInventory } = useInventoryStore.getState();
            const item1 = createMockItem('potion1');
            const item2 = createMockItem('potion2');

            addItem(item1, 3);
            addItem(item2, 5);
            clearInventory();

            const { items } = useInventoryStore.getState();
            expect(items.length).toBe(0);
        });
    });
});
