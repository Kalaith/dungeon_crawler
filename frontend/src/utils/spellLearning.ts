import type { Character, Spell } from '../types';
import { spells } from '../data/spells';

/**
 * Determine maximum spell level a character can cast
 */
export function getMaxSpellLevel(characterLevel: number): number {
    if (characterLevel >= 17) return 9;
    if (characterLevel >= 15) return 8;
    if (characterLevel >= 13) return 7;
    if (characterLevel >= 11) return 6;
    if (characterLevel >= 9) return 5;
    if (characterLevel >= 7) return 4;
    if (characterLevel >= 5) return 3;
    if (characterLevel >= 3) return 2;
    if (characterLevel >= 1) return 1;
    return 0;
}

/**
 * Get spell list for a specific class
 */
export function getClassSpellList(className: string): Spell[] {
    // Simplified spell lists for MVP - in full game, each class would have specific lists
    const spellLists: Record<string, string[]> = {
        wizard: ['fire_bolt', 'mage_hand', 'magic_missile', 'shield', 'burning_hands', 'scorching_ray', 'fireball', 'lightning_bolt', 'ice_storm', 'cone_of_cold'],
        cleric: ['sacred_flame', 'cure_wounds', 'bless', 'spiritual_weapon', 'revivify', 'mass_cure_wounds'],
        druid: ['sacred_flame', 'cure_wounds', 'burning_hands', 'revivify'],
        sorcerer: ['fire_bolt', 'mage_hand', 'magic_missile', 'shield', 'scorching_ray', 'fireball', 'greater_invisibility', 'cone_of_cold'],
        warlock: ['eldritch_blast', 'mage_hand', 'magic_missile', 'burning_hands', 'scorching_ray', 'hold_person'],
        bard: ['mage_hand', 'cure_wounds', 'hold_person', 'mass_cure_wounds'],
        paladin: ['cure_wounds', 'bless'],
        ranger: ['cure_wounds']
    };

    const classKey = className.toLowerCase();
    const spellIds = spellLists[classKey] || [];

    return spells.filter(spell => spellIds.includes(spell.id));
}

/**
 * Get spells available to learn for a character
 */
export function getAvailableSpellsToLearn(character: Character): Spell[] {
    if (!character.class.spellcasting) {
        return [];
    }

    const maxLevel = getMaxSpellLevel(character.level);
    const classSpells = getClassSpellList(character.class.name);

    // Filter by max spell level and exclude already known spells
    const knownSpellIds = character.spells.map(s => s.id);
    return classSpells.filter(spell =>
        spell.level <= maxLevel &&
        !knownSpellIds.includes(spell.id)
    );
}

/**
 * Calculate number of spells a character can know (for Known casters)
 */
export function getMaxKnownSpells(character: Character): number {
    if (!character.class.spellcasting || character.class.spellcasting.type !== 'known') {
        return 0;
    }

    // Simplified formula: level + spellcasting modifier
    const spellcastingAbility = character.class.spellcasting.ability;
    const abilityMod = Math.floor((character.attributes[spellcastingAbility] - 10) / 2);

    return Math.max(1, character.level + abilityMod);
}

/**
 * Calculate number of spells a character can prepare (for Prepared casters)
 */
export function getMaxPreparedSpells(character: Character): number {
    if (!character.class.spellcasting || character.class.spellcasting.type !== 'prepared') {
        return 0;
    }

    // Simplified formula: level + spellcasting modifier (minimum 1)
    const spellcastingAbility = character.class.spellcasting.ability;
    const abilityMod = Math.floor((character.attributes[spellcastingAbility] - 10) / 2);

    return Math.max(1, character.level + abilityMod);
}

/**
 * Check if character can learn a new spell
 */
export function canLearnSpell(character: Character, spell: Spell): boolean {
    if (!character.class.spellcasting) {
        return false;
    }

    // Check if spell level is available
    const maxLevel = getMaxSpellLevel(character.level);
    if (spell.level > maxLevel) {
        return false;
    }

    // Check if already known
    if (character.spells.some(s => s.id === spell.id)) {
        return false;
    }

    // For known casters, check if at capacity
    if (character.class.spellcasting.type === 'known') {
        const maxKnown = getMaxKnownSpells(character);
        if (character.spells.length >= maxKnown) {
            return false;
        }
    }

    return true;
}

/**
 * Learn a spell (for Known casters or adding to spellbook)
 */
export function learnSpell(character: Character, spell: Spell): Character {
    if (!canLearnSpell(character, spell)) {
        return character;
    }

    return {
        ...character,
        spells: [...character.spells, spell]
    };
}

/**
 * Prepare spells for the day (for Prepared casters)
 */
export function prepareSpells(character: Character, spellIds: string[]): Character {
    if (!character.class.spellcasting || character.class.spellcasting.type !== 'prepared') {
        return character;
    }

    const maxPrepared = getMaxPreparedSpells(character);
    if (spellIds.length > maxPrepared) {
        return character; // Can't prepare more than allowed
    }

    // Get the actual spell objects
    const preparedSpells = spells.filter(spell => spellIds.includes(spell.id));

    return {
        ...character,
        spells: preparedSpells
    };
}

/**
 * Get cantrips for a character (always available)
 */
export function getCantrips(character: Character): Spell[] {
    const classSpells = getClassSpellList(character.class.name);
    return classSpells.filter(spell => spell.level === 0);
}

/**
 * Initialize spells for a new character
 */
export function initializeCharacterSpells(character: Character): Character {
    if (!character.class.spellcasting) {
        return character;
    }

    const cantrips = getCantrips(character);
    const classSpells = getClassSpellList(character.class.name);

    if (character.class.spellcasting.type === 'known') {
        // Known casters start with cantrips + a few level 1 spells
        const maxKnown = getMaxKnownSpells(character);
        const level1Spells = classSpells.filter(s => s.level === 1).slice(0, Math.max(0, maxKnown - cantrips.length));

        return {
            ...character,
            spells: [...cantrips, ...level1Spells]
        };
    } else {
        // Prepared casters know all cantrips and can prepare spells
        return {
            ...character,
            spells: cantrips
        };
    }
}
