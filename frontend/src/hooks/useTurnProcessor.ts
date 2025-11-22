import { useEffect, useRef } from 'react';
import { useCombatStore } from '../stores/useCombatStore';
import { useGameStateStore } from '../stores/useGameStateStore';
import type { Character } from '../types';

/**
 * Custom hook to handle automatic combat turn processing.
 * Extracted from CombatInterface to separate business logic from presentation.
 * 
 * Responsibilities:
 * - Automatically process enemy turns
 * - Skip unconscious party members' turns
 * - Prevent duplicate turn processing
 * - Check for game over conditions
 */
export const useTurnProcessor = (processTurn: () => void) => {
    const { inCombat, combatTurnOrder, currentTurn, nextTurn, endCombat: endCombatStore, addCombatLog } = useCombatStore();
    const { setGameState } = useGameStateStore();
    const lastProcessedTurn = useRef<number | null>(null);
    const gameOverTriggered = useRef<boolean>(false);

    useEffect(() => {
        if (!inCombat || combatTurnOrder.length === 0) return;

        const currentParticipant = combatTurnOrder[currentTurn];
        if (!currentParticipant) return;

        // Handle enemy turns
        if (currentParticipant.type === 'enemy') {
            // Prevent multiple processTurn calls for the same turn
            if (lastProcessedTurn.current === currentTurn) return;

            lastProcessedTurn.current = currentTurn;
            processTurn();
            return;
        }

        // Handle party member turns
        const character = currentParticipant.character as Character;

        // Skip unconscious party members
        if (!character.alive || !character.derivedStats || character.derivedStats.HP.current <= 0) {
            // Check if all party members are unconscious before skipping
            const alivePartyMembers = combatTurnOrder.filter(p => {
                if (p.type === 'party') {
                    const char = p.character as Character;
                    return char.alive && char.derivedStats && char.derivedStats.HP.current > 0;
                }
                return false;
            });

            // If no alive party members, trigger game over
            if (alivePartyMembers.length === 0 && !gameOverTriggered.current) {
                console.log('💀 All party members unconscious - GAME OVER');
                gameOverTriggered.current = true;
                addCombatLog('All party members are defeated!');
                endCombatStore();
                setGameState('game-over');
                return;
            }

            // Skip this unconscious character's turn
            setTimeout(() => nextTurn(), 100);
        } else {
            // Reset the last processed turn when it's a conscious player's turn
            if (lastProcessedTurn.current !== null) {
                lastProcessedTurn.current = null;
            }
        }
    }, [inCombat, combatTurnOrder, currentTurn, processTurn, nextTurn, endCombatStore, setGameState, addCombatLog]);

    // Reset game over flag when combat ends
    useEffect(() => {
        if (!inCombat) {
            gameOverTriggered.current = false;
        }
    }, [inCombat]);
};
