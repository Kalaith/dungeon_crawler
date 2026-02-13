import React, { useState, useEffect } from 'react';
import { useCombatStore } from '../../../stores/useCombatStore';

interface EnemyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnemyEditorModal: React.FC<EnemyEditorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentEnemy, updateEnemyHP } = useCombatStore();
  const [hp, setHp] = useState(0);

  useEffect(() => {
    if (currentEnemy) {
      setHp(currentEnemy.hp);
    }
  }, [currentEnemy, isOpen]);

  if (!isOpen) return null;

  if (!currentEnemy) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110]">
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-xl w-96 max-w-full text-center">
          <h3 className="text-xl font-bold text-white mb-2">No Active Enemy</h3>
          <p className="text-gray-400 mb-4">
            You must be in combat to edit enemy stats.
          </p>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateEnemyHP(hp);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110]">
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            Edit Enemy: {currentEnemy.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Current HP (Max: {currentEnemy.maxHp})
            </label>
            <input
              type="number"
              value={hp}
              onChange={e => setHp(parseInt(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
