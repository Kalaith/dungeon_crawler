import { useGameStateStore } from './stores/useGameStateStore';
import { PartyCreation } from './components/party/PartyCreation';
import { GameScreen } from './components/game/GameScreen';
import { CombatInterface } from './components/combat/CombatInterface';
import { MessageModal } from './components/ui/MessageModal';
import { GameOverScreen } from './components/game/GameOverScreen';
import { DebugPanel } from './components/debug/DebugPanel';
import { OverworldMap } from './components/overworld/OverworldMap';
import { TownHub } from './components/town/TownHub';
import { MainLayout } from './components/layout/MainLayout';
import { PartyStatus } from './components/game/PartyStatus';
import { CombatLog } from './components/combat/CombatLog';

import { useState } from 'react';
import { usePartyStore } from './stores/usePartyStore';
import { FeatSelectionModal } from './components/party/FeatSelectionModal';

function App() {
  const { gameState } = useGameStateStore();
  const { party } = usePartyStore();
  const [ignoredFeatCharIds, setIgnoredFeatCharIds] = useState<string[]>([]);

  // Check for characters with pending feats
  const characterWithPendingFeatIndex = party.findIndex(c => c && c.pendingFeatSelections > 0 && !ignoredFeatCharIds.includes(c.id));
  const characterWithPendingFeat = characterWithPendingFeatIndex !== -1 ? party[characterWithPendingFeatIndex] : null;

  const handleCloseFeatModal = () => {
    if (characterWithPendingFeat) {
      setIgnoredFeatCharIds(prev => [...prev, characterWithPendingFeat.id]);
    }
  };

  return (
    <div className="min-h-screen bg-etrian-900 text-cyan-100 font-sans selection:bg-cyan-500 selection:text-white">
      <MainLayout
        statusPanel={gameState !== 'party-creation' ? <PartyStatus /> : null}
        messageLog={gameState !== 'party-creation' ? <CombatLog /> : null}
      >
        {gameState === 'party-creation' && <PartyCreation />}

        {gameState === 'overworld' && <OverworldMap />}

        {gameState === 'town' && <TownHub />}

        {(gameState === 'dungeon' || gameState === 'combat') && (
          <div className="relative h-full w-full">
            <GameScreen />
            {gameState === 'combat' && (
              <div className="absolute inset-0 z-10 bg-etrian-900/80 backdrop-blur-sm">
                <CombatInterface />
              </div>
            )}
          </div>
        )}

        {gameState === 'game-over' && <GameOverScreen />}
      </MainLayout>

      <MessageModal />
      <DebugPanel />

      {characterWithPendingFeat && (
        <FeatSelectionModal
          characterIndex={characterWithPendingFeatIndex}
          character={characterWithPendingFeat}
          onClose={handleCloseFeatModal}
        />
      )}
    </div>
  );
}

export default App;