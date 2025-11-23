import type { Character } from '../types';
import { calculateDerivedStats } from './characterCreation';

/**
 * Migrates legacy character data to the current schema.
 * This function ensures that all required properties exist on a character object.
 */
export function migrateCharacter(character: any): Character {
    // If derivedStats is missing, calculate it from existing data
    if (!character.derivedStats && character.class && character.attributes) {
        console.log(`Migrating character ${character.name} - adding derivedStats`);

        const movementRate = character.race?.movementRate || 30;
        character.derivedStats = calculateDerivedStats(
            character.attributes,
            character.class.baseStats,
            movementRate
        );
    }

    // Ensure other required properties exist
    if (!character.statusEffects) {
        character.statusEffects = [];
    }

    if (!character.position) {
        character.position = { row: 'front', index: 0 };
    }

    if (character.alive === undefined) {
        character.alive = true;
    }

    if (!character.equipment) {
        character.equipment = {};
    }

    if (!character.inventory) {
        character.inventory = [];
    }

    if (!character.spells) {
        character.spells = [];
    }

    if (!character.skills) {
        character.skills = [];
    }

    if (!character.feats) {
        character.feats = [];
    }

    if (character.gold === undefined) {
        character.gold = 0;
    }

    if (character.pendingFeatSelections === undefined) {
        character.pendingFeatSelections = 0;
    }

    return character as Character;
}

/**
 * Migrates an array of characters (including null values)
 */
export function migrateParty(party: (any | null)[]): (Character | null)[] {
    return party.map(character => {
        if (character === null) return null;
        return migrateCharacter(character);
    });
}
