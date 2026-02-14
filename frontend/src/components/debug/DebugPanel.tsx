import React, { useState } from 'react';
import { useCombatStore } from '../../stores/useCombatStore';
import { usePartyStore } from '../../stores/usePartyStore';
import { useGoldStore } from '../../stores/useGoldStore';
import { enemies } from '../../data/gameData';
import { races } from '../../data/races';
import { characterClasses } from '../../data/classes';
import { createCharacterFromWizardData } from '../../utils/characterCreation';
import type { CombatParticipant, Item } from '../../types';

import { useGameStateStore } from '../../stores/useGameStateStore';
import { useInventoryStore } from '../../stores/useInventoryStore';
import { useDungeonStore } from '../../stores/useDungeonStore';
import { lootTables } from '../../data/loot';

import { GameStateModal } from './modals/GameStateModal';
import { ItemSpawnerModal } from './modals/ItemSpawnerModal';
import { EnemyEditorModal } from './modals/EnemyEditorModal';
import { PartyEditorModal } from './modals/PartyEditorModal';

export const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Modal states
  const [showGameState, setShowGameState] = useState(false);
  const [showItemSpawner, setShowItemSpawner] = useState(false);
  const [showEnemyEditor, setShowEnemyEditor] = useState(false);
  const [showPartyEditor, setShowPartyEditor] = useState(false);

  const { startCombat, endCombat, currentEnemy, updateEnemyHP, inCombat } = useCombatStore();

  const {
    party,
    updatePartyMemberHP,
    updatePartyMemberAP,
    restParty,
    equipItem,
    addCharacterToParty,
    levelUpCharacter,
    updatePartyMember,
  } = usePartyStore();

  const { setGold } = useGoldStore();
  const { setGameState, godMode, toggleGodMode } = useGameStateStore();
  const { addItem } = useInventoryStore();

  const handleTriggerCombat = () => {
    if (inCombat) return;
    const goblin = enemies.find(e => e.id === 'goblin') || enemies[0];
    if (!goblin) return;

    const partyParticipants = party
      .map((c): CombatParticipant | null =>
        c
          ? {
              id: c.id,
              type: 'party' as const,
              character: c,
              initiative: c.derivedStats.Initiative + Math.floor(Math.random() * 20) + 1,
              status: 'active' as const,
            }
          : null
      )
      .filter((p): p is CombatParticipant => p !== null);

    startCombat(goblin, partyParticipants);
  };

  const handleTriggerRandomEncounter = () => {
    if (inCombat) return;
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    if (!randomEnemy) return;

    const partyParticipants = party
      .map((c): CombatParticipant | null =>
        c
          ? {
              id: c.id,
              type: 'party' as const,
              character: c,
              initiative: c.derivedStats.Initiative + Math.floor(Math.random() * 20) + 1,
              status: 'active' as const,
            }
          : null
      )
      .filter((p): p is CombatParticipant => p !== null);

    startCombat(randomEnemy, partyParticipants);
  };

  const handleForceEndCombat = () => {
    endCombat();
  };

  const handleKillParty = () => {
    party.forEach((member, index) => {
      if (member) {
        updatePartyMemberHP(index, 0);
      }
    });
  };

  const handleHealParty = () => {
    restParty();
  };

  const handleKillEnemy = () => {
    if (currentEnemy) {
      updateEnemyHP(0);
    }
  };

  const handleGiveOPSword = () => {
    const opSword: Item = {
      id: 'op_sword',
      name: 'God Slayer',
      type: 'weapon',
      rarity: 'legendary',
      stats: { ST: 50, HP: 0, AP: 0, AC: 0 },
      value: 9999,
      description: 'A legendary sword of immense power.',
    };

    if (party[0]) {
      equipItem(0, opSword, 'mainHand');
    }
  };

  const handleClearAllData = () => {
    if (confirm('⚠️ This will clear ALL game data and reload the page. Are you sure?')) {
      // Clear all localStorage
      localStorage.removeItem('dungeon-crawler-game');
      localStorage.removeItem('dungeon-crawler-party');
      localStorage.removeItem('gold-storage');
      localStorage.removeItem('dungeon-crawler-game-state');
      localStorage.removeItem('dungeon-crawler-inventory');

      // Reload the page to reinitialize all stores
      window.location.reload();
    }
  };

  const handleCreateFullParty = () => {
    // Get player-available races (not NPC-only)
    const playerRaces = races.filter(r => !r.isNpcOnly);

    // Define 6 character configurations
    const partyConfigs = [
      {
        name: 'Warrior',
        race: playerRaces.find(r => r.id === 'human'),
        class: characterClasses.find(c => c.id === 'warrior'),
      },
      {
        name: 'Wizard',
        race: playerRaces.find(r => r.id === 'elf'),
        class: characterClasses.find(c => c.id === 'wizard'),
      },
      {
        name: 'Cleric',
        race: playerRaces.find(r => r.id === 'dwarf'),
        class: characterClasses.find(c => c.id === 'cleric'),
      },
      {
        name: 'Rogue',
        race: playerRaces.find(r => r.id === 'halfling'),
        class: characterClasses.find(c => c.id === 'rogue'),
      },
      {
        name: 'Ranger',
        race: playerRaces.find(r => r.id === 'half_elf'),
        class: characterClasses.find(c => c.id === 'ranger'),
      },
      {
        name: 'Paladin',
        race: playerRaces.find(r => r.id === 'human'),
        class: characterClasses.find(c => c.id === 'paladin'),
      },
    ];

    // Create and add characters to party
    partyConfigs.forEach((config, index) => {
      if (config.race && config.class) {
        const character = createCharacterFromWizardData({
          name: config.name,
          selectedRace: config.race,
          selectedClass: config.class,
          attributes: {
            ST: 12,
            CO: 12,
            DX: 12,
            AG: 12,
            IT: 12,
            IN: 12,
            WD: 12,
            CH: 12,
          },
          negativeAttributes: {
            SN: 2,
            AC: 2,
            CL: 2,
            AV: 2,
            NE: 2,
            CU: 2,
            VT: 2,
          },
          selectedSkills: [],
          selectedFeats: [],
          portrait: '',
          selectedDeity: null,
          selectedBackground: null,
        });
        addCharacterToParty(character, index);
      }
    });
  };

  const handleGrant9999Gold = () => {
    setGold(9999);
  };

  const handleLevelUpParty = () => {
    party.forEach((member, index) => {
      if (member) {
        levelUpCharacter(index);
      }
    });
  };

  const handleMaxStatsParty = () => {
    party.forEach((member, index) => {
      if (member) {
        // Max HP/AP
        updatePartyMemberHP(index, member.derivedStats.HP.max);
        updatePartyMemberAP(index, member.derivedStats.AP.max);

        // Max Attributes
        updatePartyMember(index, {
          attributes: {
            ST: 18,
            CO: 18,
            DX: 18,
            AG: 18,
            IT: 18,
            IN: 18,
            WD: 18,
            CH: 18,
          },
        });
      }
    });
  };

  const handleTeleport = (target: 'town' | 'dungeon' | 'overworld') => {
    setGameState(target);
  };

  const handleAddRandomItems = () => {
    const commonItems = lootTables['common'] || [];
    const rareItems = lootTables['rare'] || [];
    const allItems = [...commonItems, ...rareItems];

    if (allItems.length === 0) return;

    for (let i = 0; i < 5; i++) {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
      if (randomItem) {
        addItem(randomItem);
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 z-50"
      >
        🐛
      </button>
    );
  }

  return (
    <>
      <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 text-white shadow-xl overflow-y-auto z-50 border-l border-gray-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Debug Panel</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Combat Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Combat
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleTriggerCombat}
                className="w-full bg-red-900/50 hover:bg-red-800 text-red-200 py-1 px-2 rounded text-sm border border-red-800"
              >
                Trigger Goblin Fight
              </button>
              <button
                onClick={handleTriggerRandomEncounter}
                className="w-full bg-red-900/50 hover:bg-red-800 text-red-200 py-1 px-2 rounded text-sm border border-red-800"
              >
                Trigger Random Encounter
              </button>
              <button
                onClick={handleKillEnemy}
                className="w-full bg-red-900/50 hover:bg-red-800 text-red-200 py-1 px-2 rounded text-sm border border-red-800"
              >
                Kill Enemy
              </button>
              <button
                onClick={handleForceEndCombat}
                className="w-full bg-orange-900/50 hover:bg-orange-800 text-orange-200 py-1 px-2 rounded text-sm border border-orange-800"
              >
                ⚠️ Force End Combat
              </button>
            </div>
          </section>

          {/* Party Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Party
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleHealParty}
                className="w-full bg-green-900/50 hover:bg-green-800 text-green-200 py-1 px-2 rounded text-sm border border-green-800"
              >
                Full Heal Party
              </button>
              <button
                onClick={handleLevelUpParty}
                className="w-full bg-green-900/50 hover:bg-green-800 text-green-200 py-1 px-2 rounded text-sm border border-green-800"
              >
                Level Up Party (+1)
              </button>
              <button
                onClick={handleMaxStatsParty}
                className="w-full bg-green-900/50 hover:bg-green-800 text-green-200 py-1 px-2 rounded text-sm border border-green-800"
              >
                Max Stats (Heal + Attrs)
              </button>
              <button
                onClick={handleKillParty}
                className="w-full bg-red-900/50 hover:bg-red-800 text-red-200 py-1 px-2 rounded text-sm border border-red-800"
              >
                Kill Party
              </button>
              <button
                onClick={handleCreateFullParty}
                className="w-full bg-blue-900/50 hover:bg-blue-800 text-blue-200 py-1 px-2 rounded text-sm border border-blue-800"
              >
                Create Full Party
              </button>
            </div>
          </section>

          {/* Items Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Items
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleGiveOPSword}
                className="w-full bg-yellow-900/50 hover:bg-yellow-800 text-yellow-200 py-1 px-2 rounded text-sm border border-yellow-800"
              >
                Give God Slayer Sword
              </button>
              <button
                onClick={handleAddRandomItems}
                className="w-full bg-yellow-900/50 hover:bg-yellow-800 text-yellow-200 py-1 px-2 rounded text-sm border border-yellow-800"
              >
                Add Random Items (5)
              </button>
              <button
                onClick={handleGrant9999Gold}
                className="w-full bg-yellow-900/50 hover:bg-yellow-800 text-yellow-200 py-1 px-2 rounded text-sm border border-yellow-800"
              >
                Grant 9999 Gold
              </button>
            </div>
          </section>

          {/* Navigation Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Navigation
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleTeleport('town')}
                className="bg-purple-900/50 hover:bg-purple-800 text-purple-200 py-1 px-2 rounded text-sm border border-purple-800"
              >
                Town
              </button>
              <button
                onClick={() => handleTeleport('dungeon')}
                className="bg-purple-900/50 hover:bg-purple-800 text-purple-200 py-1 px-2 rounded text-sm border border-purple-800"
              >
                Dungeon
              </button>
              <button
                onClick={() => handleTeleport('overworld')}
                className="bg-purple-900/50 hover:bg-purple-800 text-purple-200 py-1 px-2 rounded text-sm border border-purple-800"
              >
                Overworld
              </button>
            </div>
          </section>

          {/* Dungeon Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Dungeon
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => useDungeonStore.getState().revealMap()}
                className="w-full bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 py-1 px-2 rounded text-sm border border-indigo-800"
              >
                Reveal Map
              </button>
              <button
                onClick={() => useDungeonStore.getState().openAllDoors()}
                className="w-full bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 py-1 px-2 rounded text-sm border border-indigo-800"
              >
                Open All Doors
              </button>
              <div className="text-xs text-gray-400 mt-2">
                Steps until encounter: {useDungeonStore.getState().stepsUntilEncounter}
              </div>
            </div>
          </section>

          {/* Editors Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Editors & Tools
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowPartyEditor(true)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm border border-gray-600"
              >
                ✏️ Edit Party Member
              </button>
              <button
                onClick={() => setShowEnemyEditor(true)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm border border-gray-600"
              >
                👹 Edit Enemy Stats
              </button>
              <button
                onClick={() => setShowItemSpawner(true)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm border border-gray-600"
              >
                📦 Spawn Specific Item
              </button>
              <button
                onClick={() => setShowGameState(true)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm border border-gray-600"
              >
                📊 View Game State
              </button>
            </div>
          </section>

          {/* Cheats Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Cheats
            </h3>
            <div className="space-y-2">
              <button
                onClick={toggleGodMode}
                className={`w-full py-1 px-2 rounded text-sm border ${godMode ? 'bg-yellow-600 text-white border-yellow-400' : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'}`}
              >
                {godMode ? 'God Mode: ON' : 'God Mode: OFF'}
              </button>
            </div>
          </section>

          {/* System Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              System
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleClearAllData}
                className="w-full bg-red-900 hover:bg-red-700 text-white py-1 px-2 rounded text-sm border border-red-700"
              >
                ⚠️ Clear All Data
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      <GameStateModal isOpen={showGameState} onClose={() => setShowGameState(false)} />
      <ItemSpawnerModal isOpen={showItemSpawner} onClose={() => setShowItemSpawner(false)} />
      <EnemyEditorModal isOpen={showEnemyEditor} onClose={() => setShowEnemyEditor(false)} />
      <PartyEditorModal isOpen={showPartyEditor} onClose={() => setShowPartyEditor(false)} />
    </>
  );
};
