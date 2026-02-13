import type { Attribute, Character, CharacterClass, CharacterSkill, DerivedStats, Feat, NegativeAttributes, Race } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { initializeCharacterSkills } from './skillChecks';

// Define the store interface needed for character creation
interface CharacterCreationStoreData {
    name: string;
    selectedRace: Race | null;
    selectedClass: CharacterClass | null;
    attributes: Record<Attribute, number>;
    negativeAttributes: NegativeAttributes;
    selectedSkills: string[]; // Legacy, not used anymore
    selectedFeats: Feat[];
    portrait: string;
    selectedDeity: string | null;
    selectedBackground: string | null;
}

/**
 * Utility functions for character creation.
 * Extracted from CharacterCreationWizard to separate business logic from presentation.
 */

/**
 * Calculate derived stats based on character attributes and class
 */
export function calculateDerivedStats(
    attributes: Record<Attribute, number>,
    baseStats: { HP: number; AP: number },
    movementRate: number
): DerivedStats {
    const coModifier = Math.floor((attributes.CO - 10) / 2);
    const itModifier = Math.floor((attributes.IT - 10) / 2);
    const agModifier = Math.floor((attributes.AG - 10) / 2);
    const inModifier = Math.floor((attributes.IN - 10) / 2);

    return {
        HP: {
            current: baseStats.HP + coModifier,
            max: baseStats.HP + coModifier
        },
        AP: {
            current: baseStats.AP + itModifier,
            max: baseStats.AP + itModifier
        },
        Initiative: agModifier + inModifier,
        AC: 10 + agModifier,
        Proficiency: 2,
        Movement: movementRate
    };
}

/**
 * Apply racial modifiers to base attributes
 */
export function applyRacialModifiers(
    baseAttributes: Record<Attribute, number>,
    racialModifiers: Partial<Record<Attribute, number>>
): Record<Attribute, number> {
    const finalAttributes = { ...baseAttributes };

    (Object.keys(racialModifiers) as Attribute[]).forEach(attr => {
        if (racialModifiers[attr]) {
            finalAttributes[attr] += racialModifiers[attr]!;
        }
    });

    return finalAttributes;
}

/**
 * Get class-specific skill proficiencies
 * Maps character classes to their proficient skills
 */
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
 * Create a complete character object from wizard store data
 */
export function createCharacterFromWizardData(store: CharacterCreationStoreData): Character {
    if (!store.selectedRace || !store.selectedClass) {
        throw new Error('Race and class must be selected before creating character');
    }

    // Calculate final attributes including racial modifiers
    const finalAttributes = applyRacialModifiers(
        store.attributes,
        store.selectedRace.attributeModifiers
    );

    // Calculate derived stats
    const derivedStats = calculateDerivedStats(
        finalAttributes,
        store.selectedClass.baseStats,
        store.selectedRace.movementRate
    );

    // Get class-specific skill proficiencies
    const proficientSkills = getClassSkillProficiencies(store.selectedClass.id);

    // Initialize all 51 skills with proficiencies
    const characterSkills: CharacterSkill[] = initializeCharacterSkills(proficientSkills);

    const newCharacter: Character = {
        id: uuidv4(),
        name: store.name,
        race: store.selectedRace,
        class: store.selectedClass,
        level: 1,
        exp: 0,
        expToNext: 1000,
        attributes: finalAttributes,
        negativeAttributes: store.negativeAttributes,
        derivedStats: derivedStats,
        skills: characterSkills, // All 51 skills initialized
        feats: store.selectedFeats,
        equipment: {},
        inventory: [],
        spells: [],
        gold: 10, // Starting gold
        alive: true,
        statusEffects: [],
        position: { row: 'front', index: 0 },
        portrait: store.portrait,
        deity: store.selectedDeity || undefined,
        background: store.selectedBackground || undefined,
        pendingFeatSelections: 0
    };

    return newCharacter;
}
