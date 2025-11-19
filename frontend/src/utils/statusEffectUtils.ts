import type { Character, Enemy, ActiveStatusEffect, StatusEffect } from '../types';

/**
 * Applies a status effect to a character or enemy
 */
export const applyStatusEffect = (
    target: Character | Enemy,
    effect: StatusEffect
): ActiveStatusEffect[] => {
    const newEffect: ActiveStatusEffect = {
        ...effect,
        remainingTurns: effect.duration
    };

    return [...target.statusEffects, newEffect];
};

/**
 * Processes status effects at the start of a turn
 * Returns damage dealt (for poison) or healing done
 */
export const processStatusEffects = (
    target: Character | Enemy
): { damage: number; healing: number; message: string } => {
    let damage = 0;
    let healing = 0;
    const messages: string[] = [];

    target.statusEffects.forEach(effect => {
        switch (effect.type) {
            case 'poison':
                const poisonDamage = effect.value || 5;
                damage += poisonDamage;
                messages.push(`${target.name} takes ${poisonDamage} poison damage!`);
                break;
        }
    });

    return {
        damage,
        healing,
        message: messages.join(' ')
    };
};

/**
 * Decrements status effect durations and removes expired effects
 */
export const updateStatusEffects = (
    target: Character | Enemy
): ActiveStatusEffect[] => {
    return target.statusEffects
        .map(effect => ({
            ...effect,
            remainingTurns: effect.remainingTurns - 1
        }))
        .filter(effect => effect.remainingTurns > 0);
};

/**
 * Checks if a target has a specific status effect
 */
export const hasStatusEffect = (
    target: Character | Enemy,
    effectType: ActiveStatusEffect['type']
): boolean => {
    return target.statusEffects.some(effect => effect.type === effectType);
};

/**
 * Gets the total stat modification from buffs
 */
export const getStatModifier = (
    target: Character | Enemy,
    stat: 'str' | 'def' | 'agi'
): number => {
    let modifier = 0;

    target.statusEffects.forEach(effect => {
        if (effect.type === `buff_${stat}` && effect.value) {
            modifier += effect.value;
        }
    });

    return modifier;
};

/**
 * Gets a display-friendly name for a status effect
 */
export const getStatusEffectName = (type: ActiveStatusEffect['type']): string => {
    const names: Record<ActiveStatusEffect['type'], string> = {
        poison: 'Poisoned',
        sleep: 'Asleep',
        buff_str: 'STR+',
        buff_def: 'DEF+',
        buff_agi: 'AGI+'
    };

    return names[type] || type;
};
