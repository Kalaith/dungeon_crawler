import { useGameStateStore } from './stores/useGameStateStore';
import { PartyCreation } from './components/party/PartyCreation';
import { GameScreen } from './components/game/GameScreen';
import { CombatInterface } from './components/combat/CombatInterface';
import { MessageModal } from './components/ui/MessageModal';
import { GameOverScreen } from './components/game/GameOverScreen';
import { DebugPanel } from './components/debug/DebugPanel';
import { OverworldMap } from './components/overworld/OverworldMap';
import { TownHub } from './components/town/TownHub';

function App() {
  const { gameState } = useGameStateStore();

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-700">
      {gameState === 'party-creation' && <PartyCreation />}
      {gameState === 'overworld' && <OverworldMap />}
      {gameState === 'town' && <TownHub />}
      {gameState === 'dungeon' && <GameScreen />}
      {gameState === 'combat' && <GameScreen />}
      {gameState === 'game-over' && <GameOverScreen />}

      <CombatInterface />
      <MessageModal />
      <DebugPanel />
    </div>
  );
}

export default App;