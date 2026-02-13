import React from 'react';
import { useGameStateStore } from '../../../stores/useGameStateStore';
import { usePartyStore } from '../../../stores/usePartyStore';
import { useGoldStore } from '../../../stores/useGoldStore';
import { useInventoryStore } from '../../../stores/useInventoryStore';

interface GameStateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameStateModal: React.FC<GameStateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { gameState, godMode } = useGameStateStore();
  const { party } = usePartyStore();
  const { gold } = useGoldStore();
  const { items } = useInventoryStore();

  if (!isOpen) return null;

  const stateSummary = {
    gameState,
    godMode,
    partySize: party.filter(p => p !== null).length,
    gold,
    inventoryCount: items.length,
    partyLevels: party
      .map(p => (p ? `${p.name} (Lvl ${p.level})` : null))
      .filter(Boolean),
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110]">
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Game State Info</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="bg-gray-800 p-4 rounded overflow-auto max-h-96">
          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
            {JSON.stringify(stateSummary, null, 2)}
          </pre>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
