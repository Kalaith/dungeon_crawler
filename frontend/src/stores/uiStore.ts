import { create } from 'zustand';

interface UIStore {
  // Modal states
  isCharacterModalOpen: boolean;
  currentSlot: number;
  isMessageModalOpen: boolean;
  messageText: string;

  // UI actions
  openCharacterModal: (slot: number) => void;
  closeCharacterModal: () => void;
  showMessage: (text: string) => void;
  hideMessage: () => void;
}

export const useUIStore = create<UIStore>(set => ({
  // Initial state
  isCharacterModalOpen: false,
  currentSlot: -1,
  isMessageModalOpen: false,
  messageText: '',

  // Actions
  openCharacterModal: slot =>
    set({
      isCharacterModalOpen: true,
      currentSlot: slot,
    }),

  closeCharacterModal: () =>
    set({
      isCharacterModalOpen: false,
      currentSlot: -1,
    }),

  showMessage: text =>
    set({
      isMessageModalOpen: true,
      messageText: text,
    }),

  hideMessage: () =>
    set({
      isMessageModalOpen: false,
      messageText: '',
    }),
}));
