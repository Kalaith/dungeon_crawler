import type { Character, DerivedStats, Attribute, Skill } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Define the store interface needed for character creation
interface CharacterCreationStoreData {
    name: string;
    selectedRace: any;
    selectedClass: any;
    attributes: Record<Attribute, number>;
    negativeAttributes: any;
    selectedSkills: Skill[];
    selectedFeats: any[];
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
        skills: store.selectedSkills.map((s: Skill) => ({ ...s, value: 1 })),
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
