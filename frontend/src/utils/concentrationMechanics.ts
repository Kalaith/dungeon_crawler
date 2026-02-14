import type { Character } from '../types';
import { performSavingThrow } from './combatMechanics';

/**
 * Check if a character breaks concentration when taking damage
 */
export function checkConcentration(character: Character, damage: number): boolean {
  if (!character.concentratingOn) {
    return true; // Not concentrating, so no check needed
  }

  // DC = 10 or half the damage taken, whichever is higher
  const dc = Math.max(10, Math.floor(damage / 2));

  // Constitution saving throw
  const result = performSavingThrow(character, 'CO', dc);

  return result.success;
}

/**
 * Break concentration for a character
 */
export function breakConcentration(character: Character): Character {
  return {
    ...character,
    concentratingOn: undefined,
  };
}

/**
 * Start concentrating on a spell
 */
export function startConcentration(character: Character, spellId: string): Character {
  return {
    ...character,
    concentratingOn: spellId,
  };
}

/**
 * Check if character is concentrating
 */
export function isConcentrating(character: Character): boolean {
  return character.concentratingOn !== undefined;
}
