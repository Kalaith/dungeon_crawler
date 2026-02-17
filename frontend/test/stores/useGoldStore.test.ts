import { describe, it, expect, beforeEach } from 'vitest';
import { useGoldStore } from '../../src/stores/useGoldStore';

describe('useGoldStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const store = useGoldStore.getState();
    store.setGold(100);
  });

  describe('Initial State', () => {
    it('should start with default gold amount of 100', () => {
      const { gold } = useGoldStore.getState();
      expect(gold).toBe(100);
    });
  });

  describe('Add Gold', () => {
    it('should add gold correctly', () => {
      const { addGold } = useGoldStore.getState();
      addGold(50);
      expect(useGoldStore.getState().gold).toBe(150);
    });

    it('should not add negative gold', () => {
      const { addGold } = useGoldStore.getState();
      addGold(-50);
      expect(useGoldStore.getState().gold).toBe(100);
    });

    it('should not add zero gold', () => {
      const { addGold } = useGoldStore.getState();
      addGold(0);
      expect(useGoldStore.getState().gold).toBe(100);
    });
  });

  describe('Subtract Gold', () => {
    it('should subtract gold correctly', () => {
      const { subtractGold } = useGoldStore.getState();
      const success = subtractGold(30);
      expect(success).toBe(true);
      expect(useGoldStore.getState().gold).toBe(70);
    });

    it('should fail when amount exceeds balance', () => {
      const { subtractGold } = useGoldStore.getState();
      const success = subtractGold(150);
      expect(success).toBe(false);
      expect(useGoldStore.getState().gold).toBe(100);
    });

    it('should fail with negative amount', () => {
      const { subtractGold } = useGoldStore.getState();
      const success = subtractGold(-50);
      expect(success).toBe(false);
      expect(useGoldStore.getState().gold).toBe(100);
    });

    it('should allow subtracting exact balance', () => {
      const { subtractGold } = useGoldStore.getState();
      const success = subtractGold(100);
      expect(success).toBe(true);
      expect(useGoldStore.getState().gold).toBe(0);
    });
  });

  describe('Negative Prevention', () => {
    it('should never allow gold to go below 0', () => {
      const { subtractGold } = useGoldStore.getState();
      subtractGold(50);
      subtractGold(60); // This should fail
      expect(useGoldStore.getState().gold).toBe(50);
    });
  });

  describe('Transaction Validation', () => {
    it('should return true when player can afford amount', () => {
      const { canAfford } = useGoldStore.getState();
      expect(canAfford(50)).toBe(true);
      expect(canAfford(100)).toBe(true);
    });

    it('should return false when player cannot afford amount', () => {
      const { canAfford } = useGoldStore.getState();
      expect(canAfford(150)).toBe(false);
    });

    it('should return true for zero amount', () => {
      const { canAfford } = useGoldStore.getState();
      expect(canAfford(0)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const { setGold, addGold, canAfford } = useGoldStore.getState();
      setGold(1000000);
      addGold(500000);
      expect(useGoldStore.getState().gold).toBe(1500000);
      expect(canAfford(1500000)).toBe(true);
    });

    it('should handle zero gold correctly', () => {
      const { setGold, canAfford, subtractGold } = useGoldStore.getState();
      setGold(0);
      expect(useGoldStore.getState().gold).toBe(0);
      expect(canAfford(1)).toBe(false);
      expect(subtractGold(1)).toBe(false);
    });

    it('should handle setGold with negative value', () => {
      const { setGold } = useGoldStore.getState();
      setGold(-100);
      expect(useGoldStore.getState().gold).toBe(100); // Should not change
    });
  });
});


