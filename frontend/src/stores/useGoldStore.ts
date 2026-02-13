import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GoldStore {
  gold: number;
  addGold: (amount: number) => void;
  subtractGold: (amount: number) => boolean;
  canAfford: (amount: number) => boolean;
  setGold: (amount: number) => void;
}

export const useGoldStore = create<GoldStore>()(
  persist(
    (set, get) => ({
      gold: 100, // Starting gold

      addGold: (amount: number) => {
        if (amount < 0) return;
        set(state => ({ gold: state.gold + amount }));
      },

      subtractGold: (amount: number): boolean => {
        const { gold } = get();
        if (amount < 0 || amount > gold) {
          return false;
        }
        set({ gold: gold - amount });
        return true;
      },

      canAfford: (amount: number): boolean => {
        return get().gold >= amount;
      },

      setGold: (amount: number) => {
        if (amount < 0) return;
        set({ gold: amount });
      },
    }),
    {
      name: 'gold-storage',
    }
  )
);
