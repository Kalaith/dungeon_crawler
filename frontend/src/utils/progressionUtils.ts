import type { Character, CharacterClass } from '../types';
import { GAME_CONFIG } from '../data/constants';

/**
 * Calculates the experience required to reach a specific level
 * Formula: BASE * GROWTH_RATE^(level - 1)
 */
export const calculateExpRequirement = (level: number): number => {
    const { BASE_EXP_REQUIREMENT, EXP_GROWTH_RATE } = GAME_CONFIG.PROGRESSION;
    return Math.floor(BASE_EXP_REQUIREMENT * Math.pow(EXP_GROWTH_RATE, level - 1));
};

/**
 * Applies level-up stat bonuses to a character
 * Returns a new character object with increased stats
 */
const applyLevelUpBonuses = (
    character: Character,
    newLevel: number,
    growth: CharacterClass['stat_growth']
): Character => {
    return {
        ...character,
        level: newLevel,
        maxHp: character.maxHp + growth.hp,
        hp: character.maxHp + growth.hp, // Full heal on level up
        maxMp: character.maxMp + growth.mp,
        mp: character.maxMp + growth.mp, // Full MP restore on level up
        str: character.str + growth.str,
        def: character.def + growth.def,
        agi: character.agi + growth.agi,
        luc: character.luc + growth.luc,
        abilities: character.class.abilities.filter(a => a.unlockLevel <= newLevel),
    };
};

/**
 * Calculates level-up for a character after gaining experience
 * Handles multiple level-ups if enough XP is gained
 * Returns a new character object with updated stats
 */
export const calculateLevelUp = (
    character: Character,
    expGained: number
): { character: Character; leveledUp: boolean; levelsGained: number } => {
    let updatedCharacter = { ...character };
    let newExp = updatedCharacter.exp + expGained;
    let newExpToNext = updatedCharacter.expToNext - expGained;
    let levelsGained = 0;

    // Handle multiple level-ups
    while (newExpToNext <= 0) {
        const newLevel = updatedCharacter.level + 1;

        // Check max level
        if (newLevel > GAME_CONFIG.PROGRESSION.MAX_LEVEL) {
            return {
                character: {
                    ...updatedCharacter,
                    level: GAME_CONFIG.PROGRESSION.MAX_LEVEL,
                    exp: newExp,
                    expToNext: 0,
                },
                leveledUp: levelsGained > 0,
                levelsGained
            };
        }

        const growth = updatedCharacter.class.stat_growth;
        const nextLevelExp = calculateExpRequirement(newLevel);

        // Apply level-up bonuses
        updatedCharacter = applyLevelUpBonuses(updatedCharacter, newLevel, growth);

        // Update XP values
        updatedCharacter.exp = newExp;
        updatedCharacter.expToNext = nextLevelExp + newExpToNext; // Carry over excess XP

        // Prepare for next iteration (in case of multiple level-ups)
        newExpToNext = updatedCharacter.expToNext;
        levelsGained++;
    }

    // No level-up occurred, just update XP
    if (updatedCharacter.level === character.level) {
        return {
            character: {
                ...character,
                exp: newExp,
                expToNext: newExpToNext,
            },
            leveledUp: false,
            levelsGained: 0
        };
    }

    return {
        character: updatedCharacter,
        leveledUp: true,
        levelsGained
    };
};

/**
 * Distributes experience to multiple characters
 * Each character may level up independently
 */
export const distributeExperience = (
    characters: (Character | null)[],
    expAmount: number
): (Character | null)[] => {
    return characters.map(character => {
        if (!character || !character.alive) {
            return character;
        }
        const result = calculateLevelUp(character, expAmount);
        return result.character;
    });
};
