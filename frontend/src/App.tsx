import { useGameStore } from './stores/gameStore';
import { PartyCreation } from './components/party/PartyCreation';
import { GameScreen } from './components/game/GameScreen';
import { CombatInterface } from './components/combat/CombatInterface';
import { MessageModal } from './components/ui/MessageModal';

function App() {
  const { gameState } = useGameStore();

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-700">
      {gameState === 'party-creation' && <PartyCreation />}
      {gameState === 'exploring' && <GameScreen />}
      {gameState === 'combat' && <GameScreen />}
      
      <CombatInterface />
      <MessageModal />
    </div>
  );
}

export default App;