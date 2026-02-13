import type { Character, CharacterSkill } from '../types';
import { SKILLS, getSkillById } from '../data/skills';

/**
 * Calculate the attribute modifier for a given attribute value
 * D&D 5e style: (value - 10) / 2, rounded down
 */
export function getAttributeModifier(attributeValue: number): number {
  return Math.floor((attributeValue - 10) / 2);
}

/**
 * Get proficiency bonus based on character level
 * Matches the table from the manual
 */
export function getProficiencyBonus(level: number): number {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2; // Levels 1-4
}

/**
 * Calculate the total modifier for a skill check
 * Returns: attribute modifier + proficiency bonus (if proficient) + skill value
 */
export function calculateSkillModifier(
  character: Character,
  skillId: string
): number {
  const skillDef = getSkillById(skillId);
  if (!skillDef) return 0;

  const characterSkill = character.skills.find(s => s.skillId === skillId);
  if (!characterSkill) return 0;

  // Get primary attribute modifier
  const primaryAttrValue = character.attributes[skillDef.primaryAttribute];
  const attributeMod = getAttributeModifier(primaryAttrValue);

  // Get proficiency bonus if proficient
  const proficiencyBonus = characterSkill.proficient
    ? getProficiencyBonus(character.level)
    : 0;

  // Total = attribute modifier + proficiency + skill value
  return attributeMod + proficiencyBonus + characterSkill.value;
}

/**
 * Check if character has advantage on this skill check
 * Advantage is granted if ANY secondary attribute has a modifier of +2 or higher
 */
export function hasAdvantage(character: Character, skillId: string): boolean {
  const skillDef = getSkillById(skillId);
  if (!skillDef || !skillDef.secondaryAttributes.length) return false;

  // Check if any secondary attribute has +2 or higher modifier
  return skillDef.secondaryAttributes.some(attr => {
    const attrValue = character.attributes[attr];
    const modifier = getAttributeModifier(attrValue);
    return modifier >= 2;
  });
}

/**
 * Roll a d20 (or 2d20 with advantage, taking the higher)
 */
function rollD20(advantage: boolean = false): number {
  const roll1 = Math.floor(Math.random() * 20) + 1;

  if (!advantage) return roll1;

  const roll2 = Math.floor(Math.random() * 20) + 1;
  return Math.max(roll1, roll2);
}

/**
 * Perform a skill check
 * Returns an object with the result and details
 */
export interface SkillCheckResult {
  success: boolean;
  total: number;
  roll: number;
  modifier: number;
  dc: number;
  advantage: boolean;
  skillName: string;
}

export function performSkillCheck(
  character: Character,
  skillId: string,
  dc: number,
  forceAdvantage?: boolean
): SkillCheckResult {
  const skillDef = getSkillById(skillId);
  if (!skillDef) {
    throw new Error(`Skill ${skillId} not found`);
  }

  const modifier = calculateSkillModifier(character, skillId);
  const advantage =
    forceAdvantage !== undefined
      ? forceAdvantage
      : hasAdvantage(character, skillId);
  const roll = rollD20(advantage);
  const total = roll + modifier;

  return {
    success: total >= dc,
    total,
    roll,
    modifier,
    dc,
    advantage,
    skillName: skillDef.name,
  };
}

/**
 * Get difficulty class name for a given DC value
 */
export function getDifficultyName(dc: number): string {
  if (dc <= 5) return 'Very Easy';
  if (dc <= 10) return 'Easy';
  if (dc <= 15) return 'Medium';
  if (dc <= 20) return 'Hard';
  if (dc <= 25) return 'Very Hard';
  return 'Nearly Impossible';
}

/**
 * Standard DC values from the manual
 */
export const difficultyClasses = {
  VERY_EASY: 5,
  EASY: 10,
  MEDIUM: 15,
  HARD: 20,
  VERY_HARD: 25,
  NEARLY_IMPOSSIBLE: 30,
} as const;

/**
 * Initialize all skills for a new character
 * Returns an array of CharacterSkill objects with base values
 */
export function initializeCharacterSkills(
  proficientSkillIds: string[] = []
): CharacterSkill[] {
  return SKILLS.map(skill => ({
    skillId: skill.id,
    value: 0, // Base value, can be modified during character creation
    proficient: proficientSkillIds.includes(skill.id),
  }));
}

/**
 * Check if a skill can be increased based on level-up limits
 */
export function canIncreaseSkill(
  currentValue: number,
  skillId: string,
  increaseAmount: number
): boolean {
  const skillDef = getSkillById(skillId);
  if (!skillDef) return false;

  // Check if increase would exceed max for this level
  if (increaseAmount > skillDef.maxIncreasePerLevel) return false;

  // Check if skill would exceed maximum value (+18)
  if (currentValue + increaseAmount > 18) return false;

  // Check if skill would go below minimum value (-20)
  if (currentValue + increaseAmount < -20) return false;

  return true;
}
