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

function App() {
  const { gameState } = useGameStateStore();

  return (
    <div className="min-h-screen bg-etrian-900 text-cyan-100 font-sans selection:bg-cyan-500 selection:text-white">
      <MainLayout
        statusPanel={<PartyStatus />}
        messageLog={<CombatLog />}
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
    </div>
  );
}

export default App;