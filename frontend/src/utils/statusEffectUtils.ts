
import type {
  Character,
  Enemy,
  ActiveStatusEffect,
  StatusEffect,
} from '../types';

/**
 * Applies a status effect to a character or enemy
 */
/**
 * Checks if a target is immune to a specific status effect
 */
export const checkImmunity = (
  target: Character | Enemy,
  effectType: StatusEffect['type']
): boolean => {
  // Check race-based immunities for Characters
  if ('race' in target) {
    const raceId = target.race.id;

    // Constructed/Android/Automaton immunities
    if (['android', 'automaton', 'constructed'].includes(raceId)) {
      if (['poison', 'disease', 'sleep', 'exhaustion'].includes(effectType)) {
        return true;
      }
    }

    // Undead/Dhampir immunities (partial)
    if (['dhampir', 'undead'].includes(raceId)) {
      if (['poison', 'disease'].includes(effectType)) {
        return true;
      }
    }

    // Specific trait checks could go here if we parsed abilities more deeply
    // For now, ID-based checks cover the reported "Constructed" gap
  }

  return false;
};

/**
 * Applies a status effect to a character or enemy
 */
export const applyStatusEffect = (
  target: Character | Enemy,
  effect: StatusEffect
): ActiveStatusEffect[] => {
  // Check for immunity first
  if (checkImmunity(target, effect.type)) {
    console.log(`${target.name} is immune to ${effect.type}!`);
    return target.statusEffects;
  }

  const newEffect: ActiveStatusEffect = {
    ...effect,
    remainingTurns: effect.duration,
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
  const healing = 0;
  const messages: string[] = [];

  target.statusEffects.forEach(effect => {
    switch (effect.type) {
      case 'poison': {
        const poisonDamage = effect.value || 5;
        damage += poisonDamage;
        messages.push(`${target.name} takes ${poisonDamage} poison damage!`);
        break;
      }
    }
  });

  return {
    damage,
    healing,
    message: messages.join(' '),
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
      remainingTurns: effect.remainingTurns - 1,
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
export const getStatusEffectName = (
  type: ActiveStatusEffect['type']
): string => {
  const names: Partial<Record<ActiveStatusEffect['type'], string>> = {
    poison: 'Poisoned',
    disease: 'Diseased',
    exhaustion: 'Exhausted',
    sleep: 'Asleep',
    stun: 'Stunned',
    buff: 'Buffed',
    debuff: 'Debuffed',
    buff_str: 'STR+',
    buff_def: 'DEF+',
    buff_agi: 'AGI+',
    buff_int: 'INT+',
    buff_wis: 'WIS+',
    buff_cha: 'CHA+',
  };

  return names[type] || type;
};
