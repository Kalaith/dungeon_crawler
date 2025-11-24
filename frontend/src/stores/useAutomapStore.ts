import { create } from 'zustand';

interface AutomapStore {
    isOpen: boolean;
    zoom: number; // 1.0 = 100%, 0.5 = 50%, 2.0 = 200%
    panOffset: { x: number; y: number };

    // Actions
    toggleAutomap: () => void;
    openAutomap: () => void;
    closeAutomap: () => void;
    setZoom: (zoom: number) => void;
    setPan: (x: number, y: number) => void;
    centerOnPlayer: () => void;
    reset: () => void;
}

export const useAutomapStore = create<AutomapStore>((set) => ({
    isOpen: false,
    zoom: 1.0,
    panOffset: { x: 0, y: 0 },

    toggleAutomap: () => set((state) => ({ isOpen: !state.isOpen })),

    openAutomap: () => set({ isOpen: true }),

    closeAutomap: () => set({ isOpen: false }),

    setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(3.0, zoom)) }), // Clamp between 0.5x and 3.0x

    setPan: (x, y) => set({ panOffset: { x, y } }),

    centerOnPlayer: () => set({ panOffset: { x: 0, y: 0 } }),

    reset: () => set({
        isOpen: false,
        zoom: 1.0,
        panOffset: { x: 0, y: 0 }
    })
}));
