import React from 'react';
import { useDungeon } from '../../hooks/useDungeon';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { useGameStateStore } from '../../stores/useGameStateStore';
import { usePartyStore } from '../../stores/usePartyStore';
import { Button } from '../ui/Button';

export const GameControls: React.FC = () => {
  const { moveForward, moveBackward, turnLeft, turnRight } = useDungeon();
  const { gameState } = useGameStateStore();
  const { restParty } = usePartyStore();

  // Use custom hook for keyboard controls
  useKeyboardControls({
    onMoveForward: moveForward,
    onMoveBackward: moveBackward,
    onTurnLeft: turnLeft,
    onTurnRight: turnRight,
    enabled: gameState === 'exploring'
  });

  return (
    <div className="flex flex-col gap-4 p-4 bg-cream-100 dark:bg-charcoal-800 rounded-lg border border-gray-400/20">
      <h4 className="text-base font-medium text-slate-900 dark:text-gray-200 text-center mb-0">
        Actions
      </h4>

      <div className="flex flex-col gap-4">
        {/* Movement Controls */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="secondary"
            className="w-12 h-12 text-xl font-bold p-0"
            onClick={moveForward}
            title="Move Forward (↑ or W)"
          >
            ↑
          </Button>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="w-12 h-12 text-xl font-bold p-0"
              onClick={turnLeft}
              title="Turn Left (← or A)"
            >
              ←
            </Button>
            <Button
              variant="secondary"
              className="w-12 h-12 text-xl font-bold p-0"
              onClick={turnRight}
              title="Turn Right (→ or D)"
            >
              →
            </Button>
          </div>
          <Button
            variant="secondary"
            className="w-12 h-12 text-xl font-bold p-0"
            onClick={moveBackward}
            title="Move Backward (↓ or S)"
          >
            ↓
          </Button>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={restParty}>
            Rest
          </Button>
          <Button variant="outline" disabled>
            Party
          </Button>
        </div>
      </div>
    </div>
  );
};