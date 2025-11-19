import { useGameStateStore } from './stores/useGameStateStore';
import { PartyCreation } from './components/party/PartyCreation';
import { GameScreen } from './components/game/GameScreen';
import { CombatInterface } from './components/combat/CombatInterface';
import { MessageModal } from './components/ui/MessageModal';
import { GameOverScreen } from './components/game/GameOverScreen';
import { DebugPanel } from './components/debug/DebugPanel';

function App() {
  const { gameState } = useGameStateStore();

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-700">
      {gameState === 'party-creation' && <PartyCreation />}
      {gameState === 'exploring' && <GameScreen />}
      {gameState === 'combat' && <GameScreen />}
      {gameState === 'game-over' && <GameOverScreen />}

      <CombatInterface />
      <MessageModal />
      <DebugPanel />
    </div>
  );
}

export default App;