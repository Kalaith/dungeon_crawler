import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { enemies } from '../../data/gameData';

export const DebugPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        startCombat,
        party,
        updatePartyMemberHP,
        restParty,
        currentEnemy,
        updateEnemyHP,
        inCombat,
        equipItem
    } = useGameStore();

    const handleTriggerCombat = () => {
        if (inCombat) return;
        const goblin = enemies[0];
        startCombat(goblin);
    };

    const handleTriggerRandomEncounter = () => {
        if (inCombat) return;
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        startCombat(randomEnemy);
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
            </div>
        </div>
    );
};
