import type { Enemy } from '../types';

/**
 * Basic monsters for MVP - converted from D&D to RoA scale
 */
export const monsters: Enemy[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    level: 1,
    maxHp: 7,
    hp: 7,
    attributes: {
      ST: 8,
      CO: 10,
      DX: 14,
      AG: 14,
      IT: 10,
      IN: 8,
      WD: 8,
      CH: 8,
    },
    negativeAttributes: {
      SN: 3,
      AC: 5,
      CL: 4,
      AV: 6,
      NE: 4,
      CU: 5,
      VT: 3,
    },
    derivedStats: {
      HP: { current: 7, max: 7 },
      AP: { current: 0, max: 0 },
      Initiative: 2,
      AC: 15, // Leather armor + shield
      Proficiency: 2,
      Movement: 30,
    },
    abilities: [
      {
        id: 'nimble_escape',
        name: 'Nimble Escape',
        description: 'Can disengage or hide as a bonus action.',
        level: 1,
        type: 'passive',
      },
    ],
    statusEffects: [],
    expReward: 50,
    goldReward: 5,
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    level: 1,
    maxHp: 13,
    hp: 13,
    attributes: {
      ST: 10,
      CO: 15,
      DX: 14,
      AG: 14,
      IT: 6,
      IN: 8,
      WD: 5,
      CH: 5,
    },
    negativeAttributes: {
      SN: 2,
      AC: 2,
      CL: 2,
      AV: 2,
      NE: 2,
      CU: 2,
      VT: 2,
    },
    derivedStats: {
      HP: { current: 13, max: 13 },
      AP: { current: 0, max: 0 },
      Initiative: 2,
      AC: 13,
      Proficiency: 2,
      Movement: 30,
    },
    abilities: [],
    statusEffects: [],
    expReward: 50,
    goldReward: 0,
  },
  {
    id: 'orc',
    name: 'Orc',
    level: 2,
    maxHp: 15,
    hp: 15,
    attributes: {
      ST: 16,
      CO: 16,
      DX: 12,
      AG: 12,
      IT: 7,
      IN: 11,
      WD: 10,
      CH: 10,
    },
    negativeAttributes: {
      SN: 4,
      AC: 6,
      CL: 3,
      AV: 5,
      NE: 7,
      CU: 4,
      VT: 6,
    },
    derivedStats: {
      HP: { current: 15, max: 15 },
      AP: { current: 0, max: 0 },
      Initiative: 1,
      AC: 13, // Hide armor
      Proficiency: 2,
      Movement: 30,
    },
    abilities: [
      {
        id: 'aggressive',
        name: 'Aggressive',
        description: 'Can move up to its speed toward a hostile creature as a bonus action.',
        level: 1,
        type: 'passive',
      },
    ],
    statusEffects: [],
    expReward: 100,
    goldReward: 10,
  },
  {
    id: 'ogre',
    name: 'Ogre',
    level: 4,
    maxHp: 59,
    hp: 59,
    attributes: {
      ST: 19,
      CO: 16,
      DX: 8,
      AG: 8,
      IT: 5,
      IN: 7,
      WD: 7,
      CH: 7,
    },
    negativeAttributes: {
      SN: 6,
      AC: 7,
      CL: 2,
      AV: 4,
      NE: 5,
      CU: 3,
      VT: 7,
    },
    derivedStats: {
      HP: { current: 59, max: 59 },
      AP: { current: 0, max: 0 },
      Initiative: -1,
      AC: 11, // Hide armor
      Proficiency: 2,
      Movement: 40,
    },
    abilities: [],
    statusEffects: [],
    expReward: 450,
    goldReward: 25,
  },
  {
    id: 'troll',
    name: 'Troll',
    level: 5,
    maxHp: 84,
    hp: 84,
    attributes: {
      ST: 18,
      CO: 20,
      DX: 13,
      AG: 13,
      IT: 7,
      IN: 9,
      WD: 9,
      CH: 7,
    },
    negativeAttributes: {
      SN: 5,
      AC: 6,
      CL: 3,
      AV: 6,
      NE: 7,
      CU: 4,
      VT: 8,
    },
    derivedStats: {
      HP: { current: 84, max: 84 },
      AP: { current: 0, max: 0 },
      Initiative: 1,
      AC: 15,
      Proficiency: 3,
      Movement: 30,
    },
    abilities: [
      {
        id: 'regeneration',
        name: 'Regeneration',
        description:
          "Regains 10 HP at the start of its turn. Dies only if it starts turn with 0 HP and doesn't regenerate.",
        level: 1,
        type: 'passive',
      },
    ],
    statusEffects: [],
    expReward: 1800,
    goldReward: 50,
  },
  {
    id: 'young_dragon',
    name: 'Young Red Dragon',
    level: 10,
    maxHp: 178,
    hp: 178,
    attributes: {
      ST: 23,
      CO: 21,
      DX: 10,
      AG: 10,
      IT: 14,
      IN: 11,
      WD: 13,
      CH: 19,
    },
    negativeAttributes: {
      SN: 6,
      AC: 3,
      CL: 4,
      AV: 8,
      NE: 7,
      CU: 5,
      VT: 7,
    },
    derivedStats: {
      HP: { current: 178, max: 178 },
      AP: { current: 0, max: 0 },
      Initiative: 0,
      AC: 18,
      Proficiency: 4,
      Movement: 40,
    },
    abilities: [
      {
        id: 'fire_breath',
        name: 'Fire Breath',
        description:
          'Exhales fire in a 30-foot cone. Each creature must make a DC 17 Dexterity save, taking 56 (16d6) fire damage on failed save, or half on success.',
        level: 1,
        type: 'active',
        cost: { AP: 0 },
      },
    ],
    statusEffects: [],
    expReward: 5900,
    goldReward: 500,
  },
];

/**
 * Get monsters by level range
 */
export function getMonstersByLevel(minLevel: number, maxLevel: number): Enemy[] {
  return monsters.filter(m => m.level >= minLevel && m.level <= maxLevel);
}

/**
 * Get a random monster for a given party level
 */
export function getRandomMonster(partyLevel: number): Enemy {
  const levelRange = Math.max(1, partyLevel - 1);
  const suitable = monsters.filter(
    m => m.level >= partyLevel - levelRange && m.level <= partyLevel + 1
  );

  if (suitable.length === 0) {
    return monsters[0]; // Default to goblin
  }

  const monster = suitable[Math.floor(Math.random() * suitable.length)];
  // Return a copy with full HP
  return { ...monster, hp: monster.maxHp };
}
