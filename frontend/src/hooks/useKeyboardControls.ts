import { useEffect } from 'react';

interface KeyboardControlsConfig {
  onMoveForward: () => void;
  onMoveBackward: () => void;
  onTurnLeft: () => void;
  onTurnRight: () => void;
  enabled?: boolean;
}

/**
 * Custom hook for handling keyboard controls in the game.
 * Extracted from GameControls to separate input handling from UI.
 *
 * Supports WASD and arrow keys for movement.
 */
export const useKeyboardControls = ({
  onMoveForward,
  onMoveBackward,
  onTurnLeft,
  onTurnRight,
  enabled = true,
}: KeyboardControlsConfig) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          onMoveForward();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          onMoveBackward();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          onTurnLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          onTurnRight();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onMoveForward, onMoveBackward, onTurnLeft, onTurnRight]);
};
