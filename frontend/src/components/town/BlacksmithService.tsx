import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useGoldStore } from '../../stores/useGoldStore';

interface BlacksmithServiceProps {
  onClose: () => void;
}

type ServiceType = 'repair' | 'upgrade' | 'forge';

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  condition: number; // 0-100
  level: number;
  icon: string;
}

// Mock equipment data - will be replaced with actual inventory system
const mockEquipment: EquipmentItem[] = [
  {
    id: 'sword1',
    name: 'Iron Sword',
    type: 'Weapon',
    condition: 65,
    level: 1,
    icon: '⚔️',
  },
  {
    id: 'armor1',
    name: 'Leather Armor',
    type: 'Armor',
    condition: 80,
    level: 1,
    icon: '🛡️',
  },
  {
    id: 'bow1',
    name: 'Short Bow',
    type: 'Weapon',
    condition: 45,
    level: 1,
    icon: '🏹',
  },
  {
    id: 'helmet1',
    name: 'Iron Helmet',
    type: 'Armor',
    condition: 90,
    level: 1,
    icon: '⛑️',
  },
];

export const BlacksmithService: React.FC<BlacksmithServiceProps> = ({ onClose }) => {
  const { gold, subtractGold, canAfford } = useGoldStore();
  const [selectedService, setSelectedService] = useState<ServiceType>('repair');

  const getRepairCost = (item: EquipmentItem): number => {
    const damagePercent = 100 - item.condition;
    return Math.ceil((damagePercent / 10) * item.level * 10);
  };

  const getUpgradeCost = (item: EquipmentItem): number => {
    return item.level * 100;
  };

  const handleRepair = (item: EquipmentItem) => {
    const cost = getRepairCost(item);

    if (!canAfford(cost)) {
      alert(`Insufficient funds! You need ${cost} gold but only have ${gold} gold.`);
      return;
    }

    const success = subtractGold(cost);
    if (!success) {
      alert('Transaction failed!');
      return;
    }

    alert(`Repair complete! Spent ${cost} gold\n\n${item.name} restored to 100% condition.`);
  };

  const handleUpgrade = (item: EquipmentItem) => {
    const cost = getUpgradeCost(item);

    if (!canAfford(cost)) {
      alert(`Insufficient funds! You need ${cost} gold but only have ${gold} gold.`);
      return;
    }

    const success = subtractGold(cost);
    if (!success) {
      alert('Transaction failed!');
      return;
    }

    alert(
      `Upgrade complete! Spent ${cost} gold\n\n${item.name} upgraded to Level ${item.level + 1}!`
    );
  };

  const getConditionColor = (condition: number): string => {
    if (condition >= 80) return 'text-green-600 dark:text-green-400';
    if (condition >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConditionLabel = (condition: number): string => {
    if (condition >= 80) return 'Good';
    if (condition >= 50) return 'Fair';
    if (condition >= 25) return 'Poor';
    return 'Broken';
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-etrian-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚒️</div>
          <h1 className="text-4xl font-bold text-gold-500 mb-2">Blacksmith's Forge</h1>
          <p className="text-lg text-cyan-100">Repair, upgrade, and forge equipment</p>
          <div className="mt-4 p-3 bg-etrian-800 border border-gold-500/30 rounded-lg inline-block">
            <p className="text-sm font-semibold text-gold-500">💰 Your Gold: {gold}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Selection */}
          <div className="lg:col-span-1">
            <div className="bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50 sticky top-8">
              <h2 className="text-xl font-semibold text-gold-500 mb-4">Services</h2>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedService('repair')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedService === 'repair'
                      ? 'bg-cyan-700 text-white border-cyan-400 shadow-lg'
                      : 'bg-etrian-900 text-cyan-400 border-cyan-900/30 hover:border-cyan-400'
                  }`}
                >
                  <div className="text-2xl mb-1">🔧</div>
                  <div className="font-bold">Repair</div>
                  <div className="text-xs opacity-80">Restore equipment condition</div>
                </button>

                <button
                  onClick={() => setSelectedService('upgrade')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedService === 'upgrade'
                      ? 'bg-cyan-700 text-white border-cyan-400 shadow-lg'
                      : 'bg-etrian-900 text-cyan-400 border-cyan-900/30 hover:border-cyan-400'
                  }`}
                >
                  <div className="text-2xl mb-1">⬆️</div>
                  <div className="font-bold">Upgrade</div>
                  <div className="text-xs opacity-80">Enhance equipment power</div>
                </button>

                <button
                  onClick={() => setSelectedService('forge')}
                  disabled
                  className="w-full p-4 rounded-lg border-2 transition-all text-left bg-etrian-900/50 text-cyan-600 border-cyan-900/10 opacity-50 cursor-not-allowed"
                >
                  <div className="text-2xl mb-1">🔨</div>
                  <div className="font-bold">Forge</div>
                  <div className="text-xs opacity-80">Create new equipment</div>
                  <div className="text-xs text-cyan-600 mt-1">Coming Soon</div>
                </button>
              </div>

              <div className="mt-6 p-3 bg-etrian-900 border border-gold-500/30 rounded-lg">
                <p className="text-xs text-gold-500">
                  💡 <strong>Tip:</strong> Keep your equipment in good condition for maximum
                  effectiveness!
                </p>
              </div>
            </div>
          </div>

          {/* Equipment List */}
          <div className="lg:col-span-2">
            <div className="bg-etrian-800 rounded-xl p-6 shadow-lg border border-cyan-900/50">
              <h2 className="text-xl font-semibold text-gold-500 mb-4">
                {selectedService === 'repair' && 'Equipment Repair'}
                {selectedService === 'upgrade' && 'Equipment Upgrade'}
                {selectedService === 'forge' && 'Forge New Equipment'}
              </h2>

              {selectedService === 'forge' ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔨</div>
                  <p className="text-lg text-cyan-100 mb-2">Forge System Coming Soon</p>
                  <p className="text-sm text-cyan-400">
                    Craft powerful equipment from raw materials
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockEquipment.map(item => (
                    <div
                      key={item.id}
                      className="bg-etrian-700 rounded-lg p-4 border border-cyan-900/30"
                    >
                      <div className="flex items-start justify-between">
                        {/* Item Info */}
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-4xl">{item.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gold-500">{item.name}</h3>
                            <p className="text-sm text-cyan-400">
                              {item.type} • Level {item.level}
                            </p>

                            {selectedService === 'repair' && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-cyan-400">Condition:</span>
                                  <span
                                    className={`text-sm font-bold ${getConditionColor(item.condition)}`}
                                  >
                                    {item.condition}% ({getConditionLabel(item.condition)})
                                  </span>
                                </div>
                                <div className="w-full bg-etrian-900 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      item.condition >= 80
                                        ? 'bg-green-500'
                                        : item.condition >= 50
                                          ? 'bg-yellow-500'
                                          : 'bg-red-500'
                                    }`}
                                    style={{ width: `${item.condition}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="text-right ml-4">
                          {selectedService === 'repair' && (
                            <>
                              <p className="text-sm text-cyan-400 mb-2">Repair Cost</p>
                              <p className="text-xl font-bold text-gold-500 mb-3">
                                {getRepairCost(item)} 💰
                              </p>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleRepair(item)}
                                disabled={item.condition === 100}
                              >
                                {item.condition === 100 ? 'Fully Repaired' : 'Repair'}
                              </Button>
                            </>
                          )}
                          {selectedService === 'upgrade' && (
                            <>
                              <p className="text-sm text-cyan-400 mb-2">Upgrade Cost</p>
                              <p className="text-xl font-bold text-gold-500 mb-3">
                                {getUpgradeCost(item)} 💰
                              </p>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleUpgrade(item)}
                              >
                                Upgrade to Lv.{item.level + 1}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedService !== 'forge' && (
                <div className="mt-6 p-4 bg-etrian-900 border border-gold-500/30 rounded-lg">
                  <p className="text-xs text-gold-500">
                    🛠️ <strong>Note:</strong> Mock equipment shown for demonstration. Real inventory
                    integration coming soon!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" size="lg" onClick={onClose}>
            ← Back to Town
          </Button>
        </div>
      </div>
    </div>
  );
};
