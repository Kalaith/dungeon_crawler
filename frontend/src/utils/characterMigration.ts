import type { Attributes, Character, CharacterClass, Race } from '../types';
import { calculateDerivedStats } from './characterCreation';
import { initializeCharacterSkills } from './skillChecks';

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

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
export function migrateCharacter(character: unknown): Character {
    if (!isRecord(character)) {
        throw new Error('Invalid character payload');
    }

    const c = character as Partial<Character> & Record<string, unknown>;

    // If derivedStats is missing, calculate it from existing data
    if (!c.derivedStats && c.class && c.attributes) {
        console.log(`Migrating character ${c.name} - adding derivedStats`);

        const race = c.race as Race | undefined;
        const klass = c.class as CharacterClass | undefined;
        const attributes = c.attributes as Attributes | undefined;

        const movementRate = race?.movementRate ?? 30;

        if (klass && attributes) {
            c.derivedStats = calculateDerivedStats(
                attributes,
                klass.baseStats,
                movementRate
            );
        }
    }

    // Ensure other required properties exist
    if (!c.statusEffects) {
        c.statusEffects = [];
    }

    if (!c.position) {
        c.position = { row: 'front', index: 0 };
    }

    if (c.alive === undefined) {
        c.alive = true;
    }

    if (!c.equipment) {
        c.equipment = {};
    }

    if (!c.inventory) {
        c.inventory = [];
    }

    if (!c.spells) {
        c.spells = [];
    }

    // Migrate skills to new format (all 51 skills)
    if (!c.skills || c.skills.length === 0 || !(c.skills[0] && 'skillId' in (c.skills[0] as object))) {
        console.log(`Migrating character ${c.name} - initializing all 51 skills`);

        const klass = c.class as CharacterClass | undefined;
        const proficientSkills = klass?.id
            ? getClassSkillProficiencies(klass.id)
            : [];

        c.skills = initializeCharacterSkills(proficientSkills);
    }

    if (!c.feats) {
        c.feats = [];
    }

    if (c.gold === undefined) {
        c.gold = 0;
    }

    if (c.pendingFeatSelections === undefined) {
        c.pendingFeatSelections = 0;
    }

    return c as Character;
}

/**
 * Migrates an array of characters (including null values)
 */
export function migrateParty(party: Array<unknown | null>): Array<Character | null> {
    return party.map(character => {
        if (character === null) return null;
        return migrateCharacter(character);
    });
}
