import React, { useState } from 'react';
import { useCombatStore } from '../../stores/useCombatStore';
import { usePartyStore } from '../../stores/usePartyStore';
import { useGoldStore } from '../../stores/useGoldStore';
import { enemies } from '../../data/gameData';
import { races } from '../../data/races';
import { characterClasses } from '../../data/classes';
import { createCharacterFromWizardData } from '../../utils/characterCreation';
import type { CombatParticipant } from '../../types';

export const DebugPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        startCombat,
        currentEnemy,
        updateEnemyHP,
        inCombat
    } = useCombatStore();

    const {
        party,
        updatePartyMemberHP,
        restParty,
        equipItem,
        addCharacterToParty
    } = usePartyStore();

    const { setGold } = useGoldStore();

    const handleTriggerCombat = () => {
        if (inCombat) return;
        const goblin = enemies[0];
        const partyParticipants = party
            .map((c, i) => c ? { type: 'party', character: c, index: i, agi: c.agi } as CombatParticipant : null)
            .filter((p): p is CombatParticipant => p !== null);
        startCombat(goblin, partyParticipants);
    };

    const handleTriggerRandomEncounter = () => {
        if (inCombat) return;
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        const partyParticipants = party
            .map((c, i) => c ? { type: 'party', character: c, index: i, agi: c.agi } as CombatParticipant : null)
            .filter((p): p is CombatParticipant => p !== null);
        startCombat(randomEnemy, partyParticipants);
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
        const opSword = {
            id: 'op_sword',
            name: 'God Slayer',
            type: 'weapon' as const,
            rarity: 'legendary' as const,
            stats: { str: 50 },
            value: 9999,
            description: 'A legendary sword of immense power.'
        };

        if (party[0]) {
            equipItem(0, opSword);
        }
    };

    const handleClearAllData = () => {
        if (confirm('⚠️ This will clear ALL game data and reload the page. Are you sure?')) {
            // Clear all localStorage
            localStorage.removeItem('dungeon-crawler-game');
            localStorage.removeItem('dungeon-crawler-party');
            localStorage.removeItem('gold-storage');
            localStorage.removeItem('dungeon-crawler-game-state');

            // Reload the page to reinitialize all stores
            window.location.reload();
        }
    };

    const handleCreateFullParty = () => {
        // Get player-available races (not NPC-only)
        const playerRaces = races.filter(r => !r.isNpcOnly);

        // Define 6 character configurations
        const partyConfigs = [
            { name: 'Warrior', race: playerRaces.find(r => r.id === 'human'), class: characterClasses.find(c => c.id === 'warrior') },
            { name: 'Wizard', race: playerRaces.find(r => r.id === 'elf'), class: characterClasses.find(c => c.id === 'wizard') },
            { name: 'Cleric', race: playerRaces.find(r => r.id === 'dwarf'), class: characterClasses.find(c => c.id === 'cleric') },
            { name: 'Rogue', race: playerRaces.find(r => r.id === 'halfling'), class: characterClasses.find(c => c.id === 'rogue') },
            { name: 'Ranger', race: playerRaces.find(r => r.id === 'half_elf'), class: characterClasses.find(c => c.id === 'ranger') },
            { name: 'Paladin', race: playerRaces.find(r => r.id === 'human'), class: characterClasses.find(c => c.id === 'paladin') }
        ];

        // Create and add characters to party
        partyConfigs.forEach((config, index) => {
            if (config.race && config.class) {
                const character = createCharacterFromWizardData({
                    name: config.name,
                    selectedRace: config.race,
                    selectedClass: config.class,
                    attributes: { ST: 12, CO: 12, DX: 12, AG: 12, IT: 12, IN: 12, WD: 12, CH: 12 },
                    negativeAttributes: { SN: 2, AC: 2, CL: 2, AV: 2, NE: 2, CU: 2, VT: 2 },
                    selectedSkills: [],
                    selectedFeats: [],
                    portrait: '',
                    selectedDeity: null,
                    selectedBackground: null
                });
                addCharacterToParty(character, index);
            }
        });
    };

    const handleGrant9999Gold = () => {
        setGold(9999);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-1 rounded shadow-lg z-[100] text-xs font-mono opacity-50 hover:opacity-100"
            >
                DEBUG
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black/90 border border-red-500 p-4 rounded shadow-2xl z-[100] w-48">
            <div className="flex justify-between items-center mb-4 border-b border-red-500/30 pb-2">
                <h3 className="text-red-500 font-mono font-bold text-sm">DEBUG TOOLS</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white text-xs"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-2">
                <button
                    onClick={handleTriggerCombat}
                    disabled={inCombat}
                    className="w-full bg-stone-700 text-white text-xs py-2 px-3 rounded hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                    ⚔️ Spawn Goblin
                </button>

                <button
                    onClick={handleTriggerRandomEncounter}
                    disabled={inCombat}
                    className="w-full bg-purple-900/50 text-purple-200 text-xs py-2 px-3 rounded hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                    🎲 Random Encounter
                </button>

                <button
                    onClick={handleKillParty}
                    className="w-full bg-red-900/50 text-red-200 text-xs py-2 px-3 rounded hover:bg-red-900 text-left"
                >
                    💀 Kill Party
                </button>

                <button
                    onClick={handleHealParty}
                    className="w-full bg-green-900/50 text-green-200 text-xs py-2 px-3 rounded hover:bg-green-900 text-left"
                >
                    ❤️ Heal Party
                </button>

                <button
                    onClick={handleKillEnemy}
                    disabled={!inCombat}
                    className="w-full bg-orange-900/50 text-orange-200 text-xs py-2 px-3 rounded hover:bg-orange-900 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                    🎯 Kill Enemy
                </button>

                <button
                    onClick={handleGiveOPSword}
                    className="w-full bg-blue-900/50 text-blue-200 text-xs py-2 px-3 rounded hover:bg-blue-900 text-left"
                >
                    🗡️ Give OP Sword
                </button>

                <div className="border-t border-red-500/30 my-2"></div>

                <button
                    onClick={handleCreateFullParty}
                    className="w-full bg-cyan-900/50 text-cyan-200 text-xs py-2 px-3 rounded hover:bg-cyan-900 text-left"
                >
                    👥 Create Full Party
                </button>

                <button
                    onClick={handleGrant9999Gold}
                    className="w-full bg-yellow-900/50 text-yellow-200 text-xs py-2 px-3 rounded hover:bg-yellow-900 text-left"
                >
                    💰 Grant 9999 Gold
                </button>

                <button
                    onClick={handleClearAllData}
                    className="w-full bg-red-900/50 text-red-200 text-xs py-2 px-3 rounded hover:bg-red-900 text-left"
                >
                    🗑️ Clear All Data
                </button>
            </div>
        </div>
    );
};
