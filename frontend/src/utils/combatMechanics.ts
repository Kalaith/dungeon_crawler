import type { Character, Enemy, Attribute } from '../types';

/**
 * Roll a d20 die
 */
export function rollD20(): number {
    return Math.floor(Math.random() * 20) + 1;
}

/**
 * Roll dice (e.g., "2d6" = 2 six-sided dice)
 */
export function rollDice(count: number, sides: number): number {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
}

/**
 * Calculate attribute modifier (D&D 5e style)
 */
export function getAttributeModifier(attributeValue: number): number {
    return Math.floor((attributeValue - 10) / 2);
}

/**
 * Roll with advantage (roll twice, take higher)
 */
export function rollWithAdvantage(): number {
    const roll1 = rollD20();
    const roll2 = rollD20();
    return Math.max(roll1, roll2);
}

/**
 * Roll with disadvantage (roll twice, take lower)
 */
export function rollWithDisadvantage(): number {
    const roll1 = rollD20();
    const roll2 = rollD20();
    return Math.min(roll1, roll2);
}

export interface AttackRollResult {
    roll: number;
    total: number;
    isCritical: boolean;
    isCriticalMiss: boolean;
    hit: boolean;
}

/**
 * Perform an attack roll
 */
export function performAttackRoll(
    attacker: Character,
    targetAC: number,
    advantage: boolean = false,
    disadvantage: boolean = false
): AttackRollResult {
    let roll: number;

    if (advantage && !disadvantage) {
        roll = rollWithAdvantage();
    } else if (disadvantage && !advantage) {
        roll = rollWithDisadvantage();
    } else {
        roll = rollD20();
    }

    const isCritical = roll === 20;
    const isCriticalMiss = roll === 1;

    // Calculate attack bonus (ST modifier + proficiency)
    const strModifier = getAttributeModifier(attacker.attributes.ST);
    const proficiency = attacker.derivedStats.Proficiency;
    const total = roll + strModifier + proficiency;

    const hit = isCritical || (!isCriticalMiss && total >= targetAC);

    return {
        roll,
        total,
        isCritical,
        isCriticalMiss,
        hit
    };
}

export interface DamageResult {
    damage: number;
    damageType: string;
    isCritical: boolean;
}

/**
 * Calculate weapon damage
 */
export function calculateWeaponDamage(
    attacker: Character,
    weaponDice: { count: number; sides: number },
    isCritical: boolean = false
): DamageResult {
    const strModifier = getAttributeModifier(attacker.attributes.ST);

    // Roll weapon dice
    let damage = rollDice(weaponDice.count, weaponDice.sides);

    // Critical hit: double the weapon dice (not the modifier)
    if (isCritical) {
        damage += rollDice(weaponDice.count, weaponDice.sides);
    }

    // Add strength modifier
    damage += strModifier;

    // Minimum 1 damage
    damage = Math.max(1, damage);

    return {
        damage,
        damageType: 'physical',
        isCritical
    };
}

/**
 * Calculate spell save DC
 */
export function calculateSpellSaveDC(caster: Character): number {
    const spellcastingAbility = caster.class.spellcasting?.ability || 'IT';
    const abilityModifier = getAttributeModifier(caster.attributes[spellcastingAbility]);
    const proficiency = caster.derivedStats.Proficiency;

    return 8 + proficiency + abilityModifier;
}

/**
 * Calculate spell attack bonus
 */
export function calculateSpellAttackBonus(caster: Character): number {
    const spellcastingAbility = caster.class.spellcasting?.ability || 'IT';
    const abilityModifier = getAttributeModifier(caster.attributes[spellcastingAbility]);
    const proficiency = caster.derivedStats.Proficiency;

    return proficiency + abilityModifier;
}

/**
 * Perform a saving throw
 */
export function performSavingThrow(
    character: Character | Enemy,
    attribute: Attribute,
    dc: number,
    advantage: boolean = false,
    disadvantage: boolean = false
): { roll: number; total: number; success: boolean } {
    let roll: number;

    if (advantage && !disadvantage) {
        roll = rollWithAdvantage();
    } else if (disadvantage && !advantage) {
        roll = rollWithDisadvantage();
    } else {
        roll = rollD20();
    }

    const attributeValue = character.attributes[attribute];
    const modifier = getAttributeModifier(attributeValue);

    // Check if proficient in this saving throw
    let proficiency = 0;
    if ('class' in character && character.class.proficiencies.savingThrows.includes(attribute)) {
        proficiency = character.derivedStats.Proficiency;
    }

    const total = roll + modifier + proficiency;
    const success = total >= dc;

    return { roll, total, success };
}

/**
 * Calculate AC for a character
 */
export function calculateAC(character: Character): number {
    const agModifier = getAttributeModifier(character.attributes.AG);
    let baseAC = 10 + agModifier;

    // Add armor bonus if equipped
    if (character.equipment.armor) {
        // This would need to be expanded based on actual armor data
        baseAC += 2; // Placeholder
    }

    // Add shield bonus if equipped
    if (character.equipment.offHand?.type === 'shield') {
        baseAC += 2;
    }

    return baseAC;
}

/**
 * Check if attack has advantage due to positioning
 */
export function hasPositionalAdvantage(
    attackerRow: 'front' | 'back',
    targetRow: 'front' | 'back',
    isRangedAttack: boolean
): { advantage: boolean; disadvantage: boolean } {
    // Melee attacks from back row have disadvantage
    if (!isRangedAttack && attackerRow === 'back') {
        return { advantage: false, disadvantage: true };
    }

    // Ranged attacks against front row targets have no penalty
    // Ranged attacks from back row are normal
    return { advantage: false, disadvantage: false };
}
