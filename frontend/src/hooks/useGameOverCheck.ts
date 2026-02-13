
import { useEffect } from 'react';
import { usePartyStore } from '../stores/usePartyStore';
import { useGameStateStore } from '../stores/useGameStateStore';
import type { Character } from '../types';

export const useGameOverCheck = () => {
  const { party } = usePartyStore();
  const { gameState, setGameState } = useGameStateStore();

  useEffect(() => {
    // Only check during gameplay states
    if (gameState !== 'exploring' && gameState !== 'combat') return;

    const partyMembers = party.filter((c): c is Character => c !== null);

    // If party is empty, we might be in initialization, so ignore
    if (partyMembers.length === 0) return;

    const allDead = partyMembers.every(
      c => !c.alive || !c.derivedStats || c.derivedStats.HP.current <= 0
    );

    if (allDead) {
      console.log('💀 Global Game Over Check: All party members are dead.');
      setGameState('game-over');
    }
  }, [party, gameState, setGameState]);
};

