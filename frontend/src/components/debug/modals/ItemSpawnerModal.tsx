import React, { useState } from 'react';
import { useInventoryStore } from '../../../stores/useInventoryStore';
import { lootTables } from '../../../data/loot';
import type { Item } from '../../../types';

interface ItemSpawnerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ItemSpawnerModal: React.FC<ItemSpawnerModalProps> = ({ isOpen, onClose }) => {
    const { addItem } = useInventoryStore();
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    if (!isOpen) return null;

    const allItems = [...(lootTables['common'] || []), ...(lootTables['rare'] || [])];

    const handleSpawn = () => {
        const item = allItems.find(i => i.id === selectedItemId);
        if (item) {
            for (let i = 0; i < quantity; i++) {
                addItem(item);
            }
            // Optional: visual feedback or toast
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110]">
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-xl w-96 max-w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Spawn Item</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Select Item</label>
                        <select
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
                            value={selectedItemId}
                            onChange={(e) => setSelectedItemId(e.target.value)}
                        >
                            <option value="">-- Select Item --</option>
                            {allItems.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} ({item.rarity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            max="99"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
                        />
                    </div>

                    <button
                        onClick={handleSpawn}
                        disabled={!selectedItemId}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Spawn Item
                    </button>
                </div>

                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
