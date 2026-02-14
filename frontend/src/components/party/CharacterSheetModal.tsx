import React, { useState } from 'react';
import type { Character, Item } from '../../types';
import { StatBar } from '../ui/StatBar';

interface CharacterSheetModalProps {
  character: Character;
  onClose: () => void;
}

type Tab = 'stats' | 'equipment' | 'inventory' | 'abilities';

export const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({ character, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('stats');

  const renderTabs = () => (
    <div className="flex border-b border-gray-700 mb-4">
      {(['stats', 'equipment', 'inventory', 'abilities'] as Tab[]).map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
            activeTab === tab
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Attributes */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-bold text-cyan-300 mb-3">Attributes</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {Object.entries(character.attributes).map(([attr, val]) => (
            <div
              key={attr}
              className="flex justify-between items-center border-b border-gray-700 pb-1"
            >
              <span className="text-gray-400">{attr}</span>
              <span className="font-mono font-bold text-white">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Derived Stats */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-bold text-cyan-300 mb-3">Combat Stats</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Health Points</span>
              <span className="text-white">
                {character.derivedStats.HP.current} / {character.derivedStats.HP.max}
              </span>
            </div>
            <StatBar
              current={character.derivedStats.HP.current}
              max={character.derivedStats.HP.max}
              color="health"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Astral Points</span>
              <span className="text-white">
                {character.derivedStats.AP.current} / {character.derivedStats.AP.max}
              </span>
            </div>
            <StatBar
              current={character.derivedStats.AP.current}
              max={character.derivedStats.AP.max}
              color="mana"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-900 p-2 rounded text-center">
              <div className="text-xs text-gray-500 uppercase">Initiative</div>
              <div className="text-xl font-bold text-yellow-400">
                {character.derivedStats.Initiative}
              </div>
            </div>
            <div className="bg-gray-900 p-2 rounded text-center">
              <div className="text-xs text-gray-500 uppercase">Armor Class</div>
              <div className="text-xl font-bold text-blue-400">{character.derivedStats.AC}</div>
            </div>
            <div className="bg-gray-900 p-2 rounded text-center">
              <div className="text-xs text-gray-500 uppercase">Proficiency</div>
              <div className="text-xl font-bold text-green-400">
                +{character.derivedStats.Proficiency}
              </div>
            </div>
            <div className="bg-gray-900 p-2 rounded text-center">
              <div className="text-xs text-gray-500 uppercase">Movement</div>
              <div className="text-xl font-bold text-white">
                {character.derivedStats.Movement} ft
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Negative Attributes */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 md:col-span-2">
        <h3 className="text-lg font-bold text-red-400 mb-3">Flaws</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(character.negativeAttributes).map(([attr, val]) => (
            <div key={attr} className="flex justify-between items-center bg-gray-900 p-2 rounded">
              <span className="text-xs text-gray-400">{attr}</span>
              <span className="font-mono font-bold text-red-300">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Weapons & Armor */}
        <div className="space-y-4">
          <EquipmentSlot label="Main Hand" item={character.equipment.mainHand} />
          <EquipmentSlot label="Off Hand" item={character.equipment.offHand} />
          <EquipmentSlot label="Armor" item={character.equipment.armor} />
          <EquipmentSlot label="Head" item={character.equipment.head} />
        </div>
        {/* Right Column: Accessories */}
        <div className="space-y-4">
          <EquipmentSlot label="Accessory 1" item={character.equipment.accessory1} />
          <EquipmentSlot label="Accessory 2" item={character.equipment.accessory2} />
        </div>
      </div>
    </div>
  );

  const EquipmentSlot = ({ label, item }: { label: string; item?: Item }) => (
    <div className="bg-gray-800 p-3 rounded border border-gray-700 flex items-center justify-between">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      {item ? (
        <div className="flex items-center gap-2">
          <span className={`font-bold ${getRarityColor(item.rarity)}`}>{item.name}</span>
          {/* Tooltip or details could go here */}
        </div>
      ) : (
        <span className="text-gray-600 italic">Empty</span>
      )}
    </div>
  );

  const renderInventory = () => (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3 text-right">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {character.inventory.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-gray-500 italic">
                Inventory is empty
              </td>
            </tr>
          ) : (
            character.inventory.map((item, idx) => (
              <tr key={`${item.id}-${idx}`} className="hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium text-white">
                  <span className={getRarityColor(item.rarity)}>{item.name}</span>
                  {item.quantity && item.quantity > 1 && (
                    <span className="text-gray-400 ml-2">x{item.quantity}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 capitalize">{item.type}</td>
                <td className="px-4 py-3 text-right text-yellow-500">{item.value} G</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderAbilities = () => (
    <div className="space-y-6">
      {/* Skills */}
      <div>
        <h3 className="text-lg font-bold text-cyan-300 mb-3">Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {character.skills.map(skill => (
            <div
              key={skill.id}
              className="bg-gray-800 p-2 rounded border border-gray-700 flex justify-between items-center"
            >
              <span className="text-sm text-gray-300">{skill.name}</span>
              <span className="text-xs font-bold bg-gray-900 px-2 py-0.5 rounded text-cyan-400">
                {skill.value}
              </span>
            </div>
          ))}
          {character.skills.length === 0 && (
            <p className="text-gray-500 italic">No skills learned.</p>
          )}
        </div>
      </div>

      {/* Feats */}
      <div>
        <h3 className="text-lg font-bold text-cyan-300 mb-3">Feats</h3>
        <div className="space-y-2">
          {character.feats.map((feat, idx) => (
            <div
              key={`${feat.id}-${idx}`}
              className="bg-gray-800 p-3 rounded border border-gray-700"
            >
              <div className="font-bold text-white mb-1">{feat.name}</div>
              <p className="text-sm text-gray-400">{feat.description}</p>
            </div>
          ))}
          {character.feats.length === 0 && (
            <p className="text-gray-500 italic">No feats acquired.</p>
          )}
        </div>
      </div>

      {/* Spells (if applicable) */}
      {character.class.spellcasting && (
        <div>
          <h3 className="text-lg font-bold text-purple-300 mb-3">Spells</h3>
          <div className="space-y-2">
            {character.spells.map((spell, idx) => (
              <div
                key={`${spell.name}-${idx}`}
                className="bg-gray-800 p-3 rounded border border-gray-700"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-purple-200">{spell.name}</span>
                  <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded">
                    {spell.ap_cost} AP
                  </span>
                </div>
                <p className="text-sm text-gray-400">{spell.description}</p>
              </div>
            ))}
            {character.spells.length === 0 && (
              <p className="text-gray-500 italic">No spells known.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-orange-400';
      case 'epic':
        return 'text-purple-400';
      case 'rare':
        return 'text-blue-400';
      default:
        return 'text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
      <div className="bg-gray-900 text-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gray-800 border-b border-gray-700 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gray-700 rounded-full border-2 border-cyan-500 flex items-center justify-center overflow-hidden">
              {character.portrait ? (
                <img
                  src={character.portrait}
                  alt={character.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{character.name}</h2>
              <div className="text-cyan-400 flex items-center gap-2">
                <span>
                  Level {character.level} {character.race.name} {character.class.name}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-yellow-500">{character.gold} Gold</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                EXP: {character.exp} / {character.expToNext}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabs()}
          <div className="animate-fadeIn">
            {activeTab === 'stats' && renderStats()}
            {activeTab === 'equipment' && renderEquipment()}
            {activeTab === 'inventory' && renderInventory()}
            {activeTab === 'abilities' && renderAbilities()}
          </div>
        </div>
      </div>
    </div>
  );
};
