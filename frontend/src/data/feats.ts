import type { Feat } from '../types';

export const feats: Feat[] = [
  {
    id: 'alert',
    name: 'Alert',
    description:
      'Add your proficiency bonus to Initiative rolls. After rolling Initiative, you may swap your Initiative with a willing ally.',
    effects: {
      type: 'passive',
      initiativeBonus: 'proficiency',
    },
  },
  {
    id: 'crafter',
    name: 'Crafter',
    description:
      "You gain proficiency with 3 Artisan's Tools. You receive a 20% discount when you buy a nonmagical item. During a Long Rest you may craft a piece of gear given you are proficient in and have the appropriate tool.",
    effects: {
      type: 'passive',
      discount: 0.2,
    },
  },
  {
    id: 'healer',
    name: 'Healer',
    description:
      "With a Utilize action, you can expend 1 use of a Healer's Kit on a creature within 5 ft. That creature can expend a hit die to heal by the roll of the hit die plus your proficiency bonus. You can reroll 1's you roll from healing someone with this feat or from a spell.",
    effects: {
      type: 'active',
      action: 'heal',
    },
  },
  {
    id: 'lucky',
    name: 'Lucky',
    description:
      'You have a number of Luck Points equal to your proficiency bonus. You can expend 1 to give yourself advantage on a d20 test or give someone else disadvantage on an attack roll against you. You regain your Luck Points with a Long Rest.',
    effects: {
      type: 'resource',
      resourceName: 'Luck Points',
      amount: 'proficiency',
    },
  },
  {
    id: 'magic_initiate',
    name: 'Magic Initiate',
    description:
      'You learn two cantrips and a Level 1 Spell of your choice from either the Cleric, Druid, or Wizard spell lists. You can cast the spell once per Long Rest without expending a spell slot.',
    effects: {
      type: 'passive',
      spells: ['choice', 'choice', 'choice'],
    },
  },
  {
    id: 'musician',
    name: 'Musician',
    description:
      'You gain proficiency with 3 Musical Instruments. When finishing a Short or Long Rest, you can give a number of allies equal to your proficiency bonus Heroic Inspiration.',
    effects: {
      type: 'passive',
      inspiration: true,
    },
  },
  {
    id: 'savage_attacker',
    name: 'Savage Attacker',
    description:
      'Once per turn when you deal damage with a weapon, you can roll damage twice and take the higher result.',
    effects: {
      type: 'passive',
      damageReroll: true,
    },
  },
  {
    id: 'skilled',
    name: 'Skilled',
    description: 'You gain proficiency with 3 skills or tools.',
    effects: {
      type: 'passive',
      skillChoice: 3,
    },
  },
  {
    id: 'tavern_brawler',
    name: 'Tavern Brawler',
    description:
      "Your Unarmed Strikes deal 1d4+STR damage and you can reroll 1's from damage rolls. You can also push a target 5 ft once per turn with an Unarmed Strike. You also gain proficiency with improvised weapons.",
    effects: {
      type: 'passive',
      unarmedDamage: '1d4',
    },
  },
  {
    id: 'tough',
    name: 'Tough',
    description:
      'Your HP max increases by 2 times your character level when you gain this feat. Every time you level up you gain an extra 2 max HP.',
    effects: {
      type: 'stat_boost',
      stat: 'HP',
      valuePerLevel: 2,
    },
  },
  {
    id: 'ability_score_improvement',
    name: 'Ability Score Improvement',
    description: 'You increase one ability score by 2 or two ability scores by 1.',
    prerequisites: { level: 4 },
    effects: {
      type: 'asi',
    },
  },
  {
    id: 'actor',
    name: 'Actor',
    description:
      '+1 CHA. You have advantage on Deception and Performance checks to maintain your disguise. You can mimic creature sounds and speech.',
    prerequisites: { level: 4, attributes: { CH: 13 } },
    effects: {
      type: 'stat_boost',
      stat: 'CH',
      value: 1,
    },
  },
  {
    id: 'athlete',
    name: 'Athlete',
    description:
      '+1 STR or DEX. You gain a Climb speed and can stand up from Prone with 5 ft of movement. You can make a running jump with only 5 ft of prior movement.',
    prerequisites: { level: 4, attributes: { ST: 13 } },
    effects: {
      type: 'stat_boost',
      stat: 'ST_or_DX',
      value: 1,
    },
  },
  {
    id: 'charger',
    name: 'Charger',
    description:
      '+1 STR or DEX. You gain +10 ft when Dashing. If you move at least 10 ft towards a target before hitting them, you can deal 1d8 extra damage or push them 10 ft.',
    prerequisites: { level: 4, attributes: { ST: 13 } },
    effects: {
      type: 'passive',
      dashBonus: 10,
    },
  },
  {
    id: 'crossbow_expert',
    name: 'Crossbow Expert',
    description:
      '+1 DEX. You ignore the Loading property of Crossbows. Being in melee does not impose disadvantage on ranged attacks.',
    prerequisites: { level: 4, attributes: { DX: 13 } },
    effects: {
      type: 'stat_boost',
      stat: 'DX',
      value: 1,
    },
  },
  {
    id: 'defensive_duelist',
    name: 'Defensive Duelist',
    description:
      '+1 DEX. While holding a finesse weapon, you can use your Reaction to add your proficiency bonus to your AC when hit by a melee attack.',
    prerequisites: { level: 4, attributes: { DX: 13 } },
    effects: {
      type: 'stat_boost',
      stat: 'DX',
      value: 1,
    },
  },
  {
    id: 'dual_wielder',
    name: 'Dual Wielder',
    description:
      '+1 STR or DEX. When you attack with a Light weapon, you can make an offhand attack with your Bonus Action with a melee weapon.',
    prerequisites: { level: 4, attributes: { ST: 13 } },
    effects: {
      type: 'stat_boost',
      stat: 'ST_or_DX',
      value: 1,
    },
  },
  {
    id: 'durable',
    name: 'Durable',
    description:
      '+1 CON. You have advantage on Death Saves. You can use your Bonus Action to expend and heal with a Hit Die.',
    prerequisites: { level: 4 },
    effects: {
      type: 'stat_boost',
      stat: 'CO',
      value: 1,
    },
  },
  {
    id: 'great_weapon_master',
    name: 'Great Weapon Master',
    description:
      '+1 STR. When you hit with a Heavy weapon, you deal extra damage equal to your proficiency bonus. When you crit or reduce a target to 0 HP, you can make another attack with your Bonus Action.',
    prerequisites: { level: 4, attributes: { ST: 13 } },
    effects: {
      type: 'stat_boost',
      stat: 'ST',
      value: 1,
    },
  },
  {
    id: 'heavily_armored',
    name: 'Heavily Armored',
    description: '+1 STR. You gain proficiency in Heavy Armor.',
    prerequisites: { level: 4 }, // Simplified prerequisite
    effects: {
      type: 'stat_boost',
      stat: 'ST',
      value: 1,
    },
  },
  {
    id: 'polearm_master',
    name: 'Polearm Master',
    description:
      '+1 STR or DEX. You can use your Bonus Action to make another attack after attacking with a Quarterstaff, Spear, or Heavy + Reach weapon. You can use your Reaction to attack when an enemy moves into your range.',
    prerequisites: { level: 4, attributes: { ST: 13 } },
    effects: {
      type: 'stat_boost',
      stat: 'ST_or_DX',
      value: 1,
    },
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description:
      "+1 STR or DEX. You can make an opportunity attack against a target that tries to Disengage or hits someone other than you. These attacks reduce the target's speed to 0 for the rest of that turn.",
    prerequisites: { level: 4, attributes: { ST: 13 } },
    effects: {
      type: 'stat_boost',
      stat: 'ST_or_DX',
      value: 1,
    },
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description:
      "+1 DEX. Your ranged weapon attacks ignore half and 3/4 cover. Being in melee doesn't impose disadvantage and your long range isn't at disadvantage.",
    prerequisites: { level: 4, attributes: { DX: 13 } },
    effects: {
      type: 'stat_boost',
      stat: 'DX',
      value: 1,
    },
  },
  {
    id: 'war_caster',
    name: 'War Caster',
    description:
      '+1 INT, WIS, or CHA. You have advantage on Constitution saves to maintain concentration. You can perform somatic components even with weapons or shields in hand. You can use a spell as an opportunity attack.',
    prerequisites: { level: 4 },
    effects: {
      type: 'stat_boost',
      stat: 'INT_WIS_CHA',
      value: 1,
    },
  },
];
