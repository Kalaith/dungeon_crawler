export interface Deity {
  id: string;
  name: string;
  alignment:
    | 'Lawful Good'
    | 'Neutral Good'
    | 'Chaotic Good'
    | 'Lawful Neutral'
    | 'True Neutral'
    | 'Chaotic Neutral'
    | 'Lawful Evil'
    | 'Neutral Evil'
    | 'Chaotic Evil';
  domains: string[];
  description: string;
  favoredWeapon?: string;
  symbol: string;
}

export const deities: Deity[] = [
  {
    id: 'none',
    name: 'None',
    alignment: 'True Neutral',
    domains: [],
    description: 'No deity worship',
    symbol: '-',
  },
  {
    id: 'phex',
    name: 'Phex',
    alignment: 'Neutral Good',
    domains: ['Trickery', 'Knowledge'],
    description:
      'God of thieves, merchants, and trade. Patron of rogues and those who value cunning and wit.',
    favoredWeapon: 'Dagger',
    symbol: 'Silver coin',
  },
  {
    id: 'rondra',
    name: 'Rondra',
    alignment: 'Lawful Good',
    domains: ['War', 'Strength'],
    description:
      'Goddess of battle, honor, and courage. Patron of warriors and paladins.',
    favoredWeapon: 'Longsword',
    symbol: 'Flaming sword',
  },
  {
    id: 'hesinde',
    name: 'Hesinde',
    alignment: 'Lawful Neutral',
    domains: ['Knowledge', 'Magic'],
    description:
      'Goddess of wisdom, magic, and knowledge. Patron of wizards and scholars.',
    favoredWeapon: 'Staff',
    symbol: 'Open book',
  },
  {
    id: 'peraine',
    name: 'Peraine',
    alignment: 'Neutral Good',
    domains: ['Life', 'Nature'],
    description:
      'Goddess of agriculture, healing, and nature. Patron of druids and healers.',
    favoredWeapon: 'Sickle',
    symbol: 'Sheaf of wheat',
  },
  {
    id: 'travia',
    name: 'Travia',
    alignment: 'Lawful Good',
    domains: ['Life', 'Light'],
    description:
      'Goddess of home, hearth, and hospitality. Patron of clerics and those who value family.',
    favoredWeapon: 'Mace',
    symbol: 'Flame',
  },
  {
    id: 'boron',
    name: 'Boron',
    alignment: 'Lawful Neutral',
    domains: ['Death', 'Grave'],
    description:
      'God of death, sleep, and dreams. Patron of those who guide souls to the afterlife.',
    favoredWeapon: 'Scythe',
    symbol: 'Raven',
  },
  {
    id: 'firun',
    name: 'Firun',
    alignment: 'Neutral Good',
    domains: ['Nature', 'Tempest'],
    description:
      'God of winter, hunting, and the wilderness. Patron of rangers and hunters.',
    favoredWeapon: 'Spear',
    symbol: 'Snowflake',
  },
  {
    id: 'tsa',
    name: 'Tsa',
    alignment: 'Chaotic Good',
    domains: ['Life', 'Nature'],
    description:
      'Goddess of renewal, rebirth, and new beginnings. Patron of druids and those who value change.',
    favoredWeapon: 'Quarterstaff',
    symbol: 'Blooming flower',
  },
];
