import type { CharacterClass } from '../types';

export const characterClasses: CharacterClass[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description:
      'A master of martial combat, skilled with a variety of weapons and armor.',
    baseStats: { HP: 10, AP: 0 },
    growthRates: { HP: 10, AP: 0 },
    primaryAttributes: ['ST', 'CO'],
    proficiencies: {
      armor: ['light', 'medium', 'heavy', 'shields'],
      weapons: ['simple', 'martial'],
      savingThrows: ['ST', 'CO'],
    },
    abilities: [
      {
        id: 'second_wind',
        name: 'Second Wind',
        description: 'Regain hit points equal to 1d10 + level.',
        level: 1,
        type: 'active',
        cost: { AP: 0 },
      },
    ],
    startingEquipment: ['Chain mail', 'Shield', 'Longsword', "Explorer's pack"],
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description:
      'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
    baseStats: { HP: 8, AP: 0 },
    growthRates: { HP: 8, AP: 0 },
    primaryAttributes: ['DX', 'IT'],
    proficiencies: {
      armor: ['light'],
      weapons: ['simple', 'hand_crossbow', 'longsword', 'rapier', 'shortsword'],
      savingThrows: ['DX', 'IT'],
    },
    abilities: [
      {
        id: 'sneak_attack',
        name: 'Sneak Attack',
        description: 'Deal extra damage to distracted enemies.',
        level: 1,
        type: 'passive',
      },
    ],
    startingEquipment: [
      'Leather armor',
      'Shortsword',
      'Shortsword',
      "Thieves' tools",
      "Burglar's pack",
    ],
  },
  {
    id: 'wizard',
    name: 'Wizard',
    description:
      'A scholarly magic-user capable of manipulating the structures of reality.',
    baseStats: { HP: 6, AP: 10 },
    growthRates: { HP: 6, AP: 4 }, // AP growth needs to be balanced
    primaryAttributes: ['IT', 'WD'],
    proficiencies: {
      armor: [],
      weapons: ['dagger', 'dart', 'sling', 'quarterstaff', 'light_crossbow'],
      savingThrows: ['IT', 'WD'],
    },
    abilities: [
      {
        id: 'arcane_recovery',
        name: 'Arcane Recovery',
        description: 'Regain some AP on short rest.',
        level: 1,
        type: 'active',
      },
    ],
    spellcasting: {
      ability: 'IT',
      type: 'prepared',
    },
    startingEquipment: [
      'Quarterstaff',
      'Component pouch',
      "Scholar's pack",
      'Spellbook',
    ],
  },
  {
    id: 'cleric',
    name: 'Cleric',
    description:
      'A priestly champion who wields divine magic in service of a higher power.',
    baseStats: { HP: 8, AP: 8 },
    growthRates: { HP: 8, AP: 3 },
    primaryAttributes: ['WD', 'CH'],
    proficiencies: {
      armor: ['light', 'medium', 'shields'],
      weapons: ['simple'],
      savingThrows: ['WD', 'CH'],
    },
    abilities: [
      {
        id: 'divine_domain',
        name: 'Divine Domain',
        description: 'Choose a domain related to your deity.',
        level: 1,
        type: 'passive',
      },
    ],
    spellcasting: {
      ability: 'WD',
      type: 'prepared',
    },
    startingEquipment: [
      'Scale mail',
      'Shield',
      'Mace',
      'Holy symbol',
      "Priest's pack",
    ],
  },
  {
    id: 'ranger',
    name: 'Ranger',
    description:
      'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.',
    baseStats: { HP: 10, AP: 4 },
    growthRates: { HP: 10, AP: 2 },
    primaryAttributes: ['DX', 'WD'],
    proficiencies: {
      armor: ['light', 'medium', 'shields'],
      weapons: ['simple', 'martial'],
      savingThrows: ['ST', 'DX'],
    },
    abilities: [
      {
        id: 'favored_enemy',
        name: 'Favored Enemy',
        description:
          'Advantage on tracking and recalling info about certain enemies.',
        level: 1,
        type: 'passive',
      },
    ],
    spellcasting: {
      ability: 'WD',
      type: 'known',
    },
    startingEquipment: [
      'Scale mail',
      'Longbow',
      '20 arrows',
      'Longsword',
      "Explorer's pack",
    ],
  },
  {
    id: 'paladin',
    name: 'Paladin',
    description: 'A holy warrior bound to a sacred oath.',
    baseStats: { HP: 10, AP: 4 },
    growthRates: { HP: 10, AP: 2 },
    primaryAttributes: ['ST', 'CH'],
    proficiencies: {
      armor: ['light', 'medium', 'heavy', 'shields'],
      weapons: ['simple', 'martial'],
      savingThrows: ['WD', 'CH'],
    },
    abilities: [
      {
        id: 'divine_sense',
        name: 'Divine Sense',
        description: 'Detect celestial, fiends, or undead.',
        level: 1,
        type: 'active',
      },
    ],
    spellcasting: {
      ability: 'CH',
      type: 'prepared',
    },
    startingEquipment: [
      'Chain mail',
      'Shield',
      'Longsword',
      'Holy symbol',
      "Explorer's pack",
    ],
  },
  {
    id: 'barbarian',
    name: 'Barbarian',
    description:
      'A fierce warrior of primitive background who can enter a battle rage.',
    baseStats: { HP: 12, AP: 0 },
    growthRates: { HP: 12, AP: 0 },
    primaryAttributes: ['ST', 'CO'],
    proficiencies: {
      armor: ['light', 'medium', 'shields'],
      weapons: ['simple', 'martial'],
      savingThrows: ['ST', 'CO'],
    },
    abilities: [
      {
        id: 'rage',
        name: 'Rage',
        description:
          'Advantage on ST checks, bonus damage, resistance to bludgeoning/piercing/slashing.',
        level: 1,
        type: 'active',
      },
    ],
    startingEquipment: [
      'Greataxe',
      'Handaxe',
      'Handaxe',
      'Javelin (4)',
      "Explorer's pack",
    ],
  },
  {
    id: 'bard',
    name: 'Bard',
    description:
      'An inspiring magician whose power echoes the music of creation.',
    baseStats: { HP: 8, AP: 8 },
    growthRates: { HP: 8, AP: 4 },
    primaryAttributes: ['CH', 'DX'],
    proficiencies: {
      armor: ['light'],
      weapons: ['simple', 'hand_crossbow', 'longsword', 'rapier', 'shortsword'],
      savingThrows: ['DX', 'CH'],
    },
    abilities: [
      {
        id: 'bardic_inspiration',
        name: 'Bardic Inspiration',
        description: 'Inspire others to succeed on checks.',
        level: 1,
        type: 'active',
      },
    ],
    spellcasting: {
      ability: 'CH',
      type: 'known',
    },
    startingEquipment: [
      'Leather armor',
      'Rapier',
      'Lute',
      "Entertainer's pack",
    ],
  },
  {
    id: 'druid',
    name: 'Druid',
    description:
      'A priest of the Old Faith, wielding the powers of nature and adopting animal forms.',
    baseStats: { HP: 8, AP: 8 },
    growthRates: { HP: 8, AP: 3 },
    primaryAttributes: ['WD', 'IT'],
    proficiencies: {
      armor: ['light', 'medium', 'shields'], // No metal
      weapons: [
        'club',
        'dagger',
        'dart',
        'javelin',
        'mace',
        'quarterstaff',
        'scimitar',
        'sickle',
        'sling',
        'spear',
      ],
      savingThrows: ['IT', 'WD'],
    },
    abilities: [
      {
        id: 'druidic',
        name: 'Druidic',
        description: 'Know the secret language of druids.',
        level: 1,
        type: 'passive',
      },
    ],
    spellcasting: {
      ability: 'WD',
      type: 'prepared',
    },
    startingEquipment: [
      'Leather armor',
      'Wooden shield',
      'Scimitar',
      'Druidic focus',
      "Explorer's pack",
    ],
  },
  {
    id: 'monk',
    name: 'Monk',
    description:
      'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
    baseStats: { HP: 8, AP: 2 }, // Ki points treated as AP? Or separate?
    growthRates: { HP: 8, AP: 1 },
    primaryAttributes: ['DX', 'WD'],
    proficiencies: {
      armor: [],
      weapons: ['simple', 'shortsword'],
      savingThrows: ['ST', 'DX'],
    },
    abilities: [
      {
        id: 'unarmored_defense',
        name: 'Unarmored Defense',
        description: 'AC = 10 + DX mod + WD mod when unarmored.',
        level: 1,
        type: 'passive',
      },
    ],
    startingEquipment: ['Shortsword', 'Dart (10)', "Explorer's pack"],
  },
  {
    id: 'sorcerer',
    name: 'Sorcerer',
    description:
      'A spellcaster who draws on inherent magic from a gift or bloodline.',
    baseStats: { HP: 6, AP: 10 },
    growthRates: { HP: 6, AP: 4 },
    primaryAttributes: ['CH', 'CO'],
    proficiencies: {
      armor: [],
      weapons: ['dagger', 'dart', 'sling', 'quarterstaff', 'light_crossbow'],
      savingThrows: ['CO', 'CH'],
    },
    abilities: [
      {
        id: 'sorcerous_origin',
        name: 'Sorcerous Origin',
        description: 'Choose the source of your magic.',
        level: 1,
        type: 'passive',
      },
    ],
    spellcasting: {
      ability: 'CH',
      type: 'known',
    },
    startingEquipment: [
      'Light crossbow',
      '20 bolts',
      'Component pouch',
      "Dungeoneer's pack",
    ],
  },
  {
    id: 'warlock',
    name: 'Warlock',
    description:
      'A wielder of magic that is derived from a bargain with an extraplanar entity.',
    baseStats: { HP: 8, AP: 8 },
    growthRates: { HP: 8, AP: 3 },
    primaryAttributes: ['CH', 'WD'],
    proficiencies: {
      armor: ['light'],
      weapons: ['simple'],
      savingThrows: ['WD', 'CH'],
    },
    abilities: [
      {
        id: 'otherworldly_patron',
        name: 'Otherworldly Patron',
        description: 'Choose who you struck a bargain with.',
        level: 1,
        type: 'passive',
      },
    ],
    spellcasting: {
      ability: 'CH',
      type: 'known',
    },
    startingEquipment: [
      'Leather armor',
      'Light crossbow',
      '20 bolts',
      'Arcane focus',
      "Scholar's pack",
    ],
  },
  {
    id: 'jester',
    name: 'Jester',
    description:
      'A wanderer and entertainer who uses wit, charm, and agility to survive.',
    baseStats: { HP: 8, AP: 0 },
    growthRates: { HP: 8, AP: 0 },
    primaryAttributes: ['IN', 'CH', 'DX'],
    proficiencies: {
      armor: ['light'],
      weapons: ['simple', 'hand_crossbow', 'rapier', 'shortsword'],
      savingThrows: ['DX', 'CH'],
    },
    abilities: [
      {
        id: 'quick_wit',
        name: 'Quick Wit',
        description: 'Use charm and deception to distract or confuse enemies.',
        level: 1,
        type: 'active',
      },
    ],
    startingEquipment: [
      'Leather armor',
      'Rapier',
      'Disguise kit',
      "Entertainer's pack",
    ],
  },
  {
    id: 'hunter',
    name: 'Hunter',
    description: 'A master of the wilderness, skilled tracker and survivalist.',
    baseStats: { HP: 10, AP: 0 },
    growthRates: { HP: 10, AP: 0 },
    primaryAttributes: ['IN', 'DX', 'AG'],
    proficiencies: {
      armor: ['light', 'medium'],
      weapons: ['simple', 'martial'],
      savingThrows: ['DX', 'IN'],
    },
    abilities: [
      {
        id: 'danger_sense',
        name: 'Danger Sense',
        description: 'Keen senses alert you to danger and traps.',
        level: 1,
        type: 'passive',
      },
    ],
    startingEquipment: [
      'Leather armor',
      'Longbow',
      '20 arrows',
      'Hunting knife',
      "Explorer's pack",
    ],
  },
  {
    id: 'magician',
    name: 'Magician',
    description:
      'A hybrid spellcaster who blends arcane magic with alchemical knowledge.',
    baseStats: { HP: 6, AP: 10 },
    growthRates: { HP: 6, AP: 4 },
    primaryAttributes: ['IN', 'DX', 'IT'],
    proficiencies: {
      armor: [],
      weapons: ['dagger', 'dart', 'sling', 'quarterstaff', 'light_crossbow'],
      savingThrows: ['IT', 'DX'],
    },
    abilities: [
      {
        id: 'alchemical_crafting',
        name: 'Alchemical Crafting',
        description: 'Create potions and alchemical items.',
        level: 1,
        type: 'passive',
      },
    ],
    spellcasting: {
      ability: 'IT',
      type: 'prepared',
    },
    startingEquipment: [
      'Quarterstaff',
      "Alchemist's supplies",
      'Component pouch',
      "Scholar's pack",
    ],
  },
];
