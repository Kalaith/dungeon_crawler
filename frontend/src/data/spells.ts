import spellsData from './spells.json';
import type { Spell } from '../types';

// Import the comprehensive spell database (900+ spells)
const slugifySpellName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

export const allSpells: Spell[] = (spellsData as Omit<Spell, 'id'>[]).map(
  spell => ({
    ...spell,
    id: slugifySpellName(spell.name),
    apCost: spell.ap_cost,
    castingTime: spell.casting_time,
    damageType: spell.damage_type,
    savingThrow: spell.save_type,
    attackRoll: spell.attack_type === 'melee' || spell.attack_type === 'ranged',
  })
);
export const spells = allSpells;

// AP Cost by spell level (for reference)
export const apCosts: Record<number, number> = {
  0: 0, // Cantrips
  1: 3, // Updated to match manual
  2: 6,
  3: 10,
  4: 14,
  5: 18,
  6: 23,
  7: 28,
  8: 33,
  9: 40,
};

// Class name mapping (our class names -> spell database class names)
const classNameMap: Record<string, string> = {
  wizard: 'Magician',
  magician: 'Magician',
  cleric: 'Cleric',
  druid: 'Druid',
  sorcerer: 'Sorcerer',
  warlock: 'Warlock',
  bard: 'Bard',
  paladin: 'Paladin',
  ranger: 'Ranger',
  hunter: 'Ranger', // Map Hunter to Ranger for spells
};

/**
 * Get spells available to a specific class
 */
export function getSpellsByClass(className: string): Spell[] {
  const mappedName = classNameMap[className.toLowerCase()] || className;
  return allSpells.filter(spell => spell.classes.includes(mappedName));
}

/**
 * Get spells by level
 */
export function getSpellsByLevel(level: number, className?: string): Spell[] {
  let spells = allSpells.filter(spell => spell.level === level);
  if (className) {
    const mappedName = classNameMap[className.toLowerCase()] || className;
    spells = spells.filter(spell => spell.classes.includes(mappedName));
  }
  return spells;
}

/**
 * Get cantrips (level 0 spells)
 */
export function getCantrips(className?: string): Spell[] {
  return getSpellsByLevel(0, className);
}

/**
 * Get combat-usable spells
 */
export function getCombatSpells(className?: string): Spell[] {
  let spells = allSpells.filter(spell => spell.combat_usable);
  if (className) {
    const mappedName = classNameMap[className.toLowerCase()] || className;
    spells = spells.filter(spell => spell.classes.includes(mappedName));
  }
  return spells;
}

/**
 * Get spells a character can currently cast (has enough AP)
 */
export function getCastableSpells(
  availableSpells: Spell[],
  currentAP: number
): Spell[] {
  return availableSpells.filter(spell => spell.ap_cost <= currentAP);
}

/**
 * Search spells by name or description
 */
export function searchSpells(query: string): Spell[] {
  const lowerQuery = query.toLowerCase();
  return allSpells.filter(
    spell =>
      spell.name.toLowerCase().includes(lowerQuery) ||
      spell.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter spells by school of magic
 */
export function getSpellsBySchool(school: string): Spell[] {
  return allSpells.filter(spell => spell.school === school);
}

/**
 * Get all unique schools of magic
 */
export function getAllSchools(): string[] {
  const schools = new Set(allSpells.map(spell => spell.school));
  return Array.from(schools).sort();
}

/**
 * Get spell count by level
 */
export function getSpellCountByLevel(): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) {
    counts[i] = allSpells.filter(spell => spell.level === i).length;
  }
  return counts;
}

/**
 * Calculate spell damage for a given cast level
 */
export function getSpellDamage(
  spell: Spell,
  castAtLevel: number
): string | null {
  if (!spell.damage_dice) return null;

  // Find the appropriate damage for the cast level
  const levels = Object.keys(spell.damage_dice)
    .map(Number)
    .sort((a, b) => a - b);
  let damageLevel = spell.level;

  for (const level of levels) {
    if (castAtLevel >= level) {
      damageLevel = level;
    }
  }

  return spell.damage_dice[damageLevel.toString()] || null;
}

/**
 * Calculate spell healing for a given cast level
 */
export function getSpellHealing(
  spell: Spell,
  castAtLevel: number
): string | null {
  if (!spell.heal_dice) return null;

  const levels = Object.keys(spell.heal_dice)
    .map(Number)
    .sort((a, b) => a - b);
  let healLevel = spell.level;

  for (const level of levels) {
    if (castAtLevel >= level) {
      healLevel = level;
    }
  }

  return spell.heal_dice[healLevel.toString()] || null;
}

/**
 * Get spells available to a character based on class and level
 */
export function getAvailableSpells(
  className: string,
  characterLevel: number
): Spell[] {
  const classSpells = getSpellsByClass(className);
  const maxSpellLevel = Math.min(Math.ceil(characterLevel / 2), 9);
  return classSpells.filter(spell => spell.level <= maxSpellLevel);
}

/**
 * Check if a spell requires concentration
 */
export function requiresConcentration(spell: Spell): boolean {
  return spell.concentration;
}

/**
 * Get spell statistics
 */
export function getSpellStats() {
  return {
    total: allSpells.length,
    byLevel: getSpellCountByLevel(),
    schools: getAllSchools(),
    combatSpells: allSpells.filter(s => s.combat_usable).length,
    concentrationSpells: allSpells.filter(s => s.concentration).length,
    ritualSpells: allSpells.filter(s => s.ritual).length,
  };
}
