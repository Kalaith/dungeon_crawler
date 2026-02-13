import React, { useState, useEffect } from 'react';
import { usePartyStore } from '../../../stores/usePartyStore';

interface PartyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartyEditorModal: React.FC<PartyEditorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { party, updatePartyMember, updatePartyMemberHP, updatePartyMemberAP } =
    usePartyStore();
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number>(-1);
  const [editValues, setEditValues] = useState<{
    hp: number;
    ap: number;
    level: number;
    gold: number;
  }>({ hp: 0, ap: 0, level: 1, gold: 0 });

  const activeMembers = party
    .map((c, i) => ({ c, i }))
    .filter(m => m.c !== null);

  useEffect(() => {
    if (isOpen) {
      if (selectedMemberIndex === -1 && activeMembers.length > 0) {
        setSelectedMemberIndex(activeMembers[0].i);
      }
    }
  }, [isOpen, activeMembers, selectedMemberIndex]);

  useEffect(() => {
    const char = party[selectedMemberIndex];
    if (selectedMemberIndex !== -1 && char) {
      setEditValues({
        hp: char.derivedStats.HP.current,
        ap: char.derivedStats.AP.current,
        level: char.level,
        gold: char.gold,
      });
    }
  }, [selectedMemberIndex, party]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (selectedMemberIndex === -1) return;

    updatePartyMemberHP(selectedMemberIndex, editValues.hp);
    updatePartyMemberAP(selectedMemberIndex, editValues.ap);
    updatePartyMember(selectedMemberIndex, {
      level: editValues.level,
      gold: editValues.gold,
    });

    // Optional: toast or alert
    // alert('Character updated!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110]">
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Edit Party Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Select Character
            </label>
            <select
              className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
              value={selectedMemberIndex}
              onChange={e => setSelectedMemberIndex(parseInt(e.target.value))}
            >
              {activeMembers.map(({ c, i }) => (
                <option key={i} value={i}>
                  {c!.name} (Lvl {c!.level} {c!.class.name})
                </option>
              ))}
            </select>
          </div>

          {selectedMemberIndex !== -1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Current HP
                  </label>
                  <input
                    type="number"
                    value={editValues.hp}
                    onChange={e =>
                      setEditValues({
                        ...editValues,
                        hp: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Current AP
                  </label>
                  <input
                    type="number"
                    value={editValues.ap}
                    onChange={e =>
                      setEditValues({
                        ...editValues,
                        ap: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Level
                  </label>
                  <input
                    type="number"
                    value={editValues.level}
                    onChange={e =>
                      setEditValues({
                        ...editValues,
                        level: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Gold
                  </label>
                  <input
                    type="number"
                    value={editValues.gold}
                    onChange={e =>
                      setEditValues({
                        ...editValues,
                        gold: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
