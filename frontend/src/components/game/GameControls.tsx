import React, { useEffect } from 'react';
import { useDungeon } from '../../hooks/useDungeon';
import { useGameStateStore } from '../../stores/useGameStateStore';
import { usePartyStore } from '../../stores/usePartyStore';
import { Button } from '../ui/Button';

export const GameControls: React.FC = () => {
  const { moveForward, moveBackward, turnLeft, turnRight } = useDungeon();
  const { gameState } = useGameStateStore();
  const { restParty } = usePartyStore();

  useEffect(() => {
    if (gameState !== 'exploring') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          moveForward();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveBackward();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          turnLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          turnRight();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, moveForward, moveBackward, turnLeft, turnRight]);

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