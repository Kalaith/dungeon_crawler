import type { Character } from '../types';
import { calculateDerivedStats } from './characterCreation';
import { initializeCharacterSkills } from './skillChecks';

// Helper to get class skill proficiencies (duplicated to avoid circular dependency)
function getClassSkillProficiencies(classId: string): string[] {
    const proficiencyMap: Record<string, string[]> = {
        'warrior': ['swords', 'axes', 'cutting_weapons', 'self_control', 'tactics'],
        'rogue': ['stealth', 'hide', 'locks', 'pickpocket', 'perception', 'pointed_weapons'],
        'wizard': ['arcane_lore', 'read_write', 'ancient_tongues', 'history'],
        'cleric': ['ritual', 'treat_wounds', 'treat_disease', 'convert', 'history'],
        'ranger': ['track', 'survival', 'animal_lore', 'herb_lore', 'missile_weapons'],
        'paladin': ['swords', 'ritual', 'convert', 'self_control', 'ride'],
        'barbarian': ['axes', 'two_handed_swords', 'survival', 'track', 'swim'],
        'bard': ['instrument', 'convert', 'seduce', 'human_nature', 'tongues'],
        'druid': ['herb_lore', 'animal_lore', 'survival', 'ritual', 'treat_wounds'],
        'monk': ['unarmed', 'acrobatics', 'physical_control', 'self_control'],
        'sorcerer': ['arcane_lore', 'convert', 'seduce'],
        'warlock': ['arcane_lore', 'lie', 'human_nature', 'ritual'],
        'jester': ['instrument', 'dance', 'lie', 'seduce', 'cheat', 'human_nature'],
        'hunter': ['track', 'survival', 'animal_lore', 'stealth', 'missile_weapons', 'perception'],
        'magician': ['arcane_lore', 'alchemy', 'herb_lore', 'read_write']
    };

    return proficiencyMap[classId] || [];
}

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

    // Migrate skills to new format (all 51 skills)
    if (!character.skills || character.skills.length === 0 || !character.skills[0]?.skillId) {
        console.log(`Migrating character ${character.name} - initializing all 51 skills`);

        const proficientSkills = character.class?.id
            ? getClassSkillProficiencies(character.class.id)
            : [];

        character.skills = initializeCharacterSkills(proficientSkills);
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
