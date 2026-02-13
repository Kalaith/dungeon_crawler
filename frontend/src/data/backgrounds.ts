export interface Background {
  id: string;
  name: string;
  description: string;
  skillProficiencies: string[];
  startingGold: number;
  equipment: string[];
}

export const backgrounds: Background[] = [
  {
    id: 'soldier',
    name: 'Soldier',
    description:
      'You served in an army, militia, or mercenary company. You are trained in combat and military tactics.',
    skillProficiencies: ['Athletics', 'Intimidation'],
    startingGold: 10,
    equipment: ['Uniform', 'Insignia of rank', 'Trophy from fallen enemy'],
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description:
      'You spent years learning the lore of the multiverse. You are well-read and knowledgeable.',
    skillProficiencies: ['Arcana', 'History'],
    startingGold: 10,
    equipment: [
      'Bottle of ink',
      'Quill',
      'Small knife',
      'Letter from dead colleague',
    ],
  },
  {
    id: 'criminal',
    name: 'Criminal',
    description:
      'You are an experienced criminal with a history of breaking the law.',
    skillProficiencies: ['Deception', 'Stealth'],
    startingGold: 15,
    equipment: ['Crowbar', 'Dark common clothes', 'Belt pouch'],
  },
  {
    id: 'acolyte',
    name: 'Acolyte',
    description:
      'You have spent your life in service to a temple. You are well-versed in religious traditions.',
    skillProficiencies: ['Insight', 'Religion'],
    startingGold: 15,
    equipment: ['Holy symbol', 'Prayer book', 'Incense', 'Vestments'],
  },
  {
    id: 'folk_hero',
    name: 'Folk Hero',
    description:
      'You come from humble origins but are destined for greatness. The common folk see you as their champion.',
    skillProficiencies: ['Animal Handling', 'Survival'],
    startingGold: 10,
    equipment: ['Artisan tools', 'Shovel', 'Iron pot', 'Common clothes'],
  },
  {
    id: 'noble',
    name: 'Noble',
    description:
      'You were born into privilege and wealth. You understand the ways of high society.',
    skillProficiencies: ['History', 'Persuasion'],
    startingGold: 25,
    equipment: ['Fine clothes', 'Signet ring', 'Scroll of pedigree'],
  },
  {
    id: 'sage',
    name: 'Sage',
    description:
      'You are a seeker of knowledge, dedicated to scholarly pursuits.',
    skillProficiencies: ['Arcana', 'History'],
    startingGold: 10,
    equipment: [
      'Bottle of ink',
      'Quill',
      'Small knife',
      'Letter from dead colleague',
    ],
  },
  {
    id: 'outlander',
    name: 'Outlander',
    description:
      'You grew up in the wilds, far from civilization. You are at home in the wilderness.',
    skillProficiencies: ['Athletics', 'Survival'],
    startingGold: 10,
    equipment: [
      'Staff',
      'Hunting trap',
      'Trophy from animal',
      'Travelers clothes',
    ],
  },
];
