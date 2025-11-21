import { CharacterClass } from '../types';

export const characterClasses: CharacterClass[] = [
    {
        id: 'warrior',
        name: 'Warrior',
        description: 'A master of martial combat, skilled with a variety of weapons and armor.',
        baseStats: { HP: 10, AP: 0 },
        growthRates: { HP: 10, AP: 0 },
        primaryAttributes: ['ST', 'CO'],
        proficiencies: {
            armor: ['light', 'medium', 'heavy', 'shields'],
            weapons: ['simple', 'martial'],
            savingThrows: ['ST', 'CO']
        },
        abilities: [
            {
                id: 'second_wind',
                name: 'Second Wind',
                description: 'Regain hit points equal to 1d10 + level.',
                level: 1,
                type: 'active',
                cost: { AP: 0 } // Uses a separate resource in 5e, but we can adapt later
            }
        ]
    },
    {
        id: 'rogue',
        name: 'Rogue',
        description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
        baseStats: { HP: 8, AP: 0 },
        growthRates: { HP: 8, AP: 0 },
        primaryAttributes: ['DX', 'IT'],
        proficiencies: {
            armor: ['light'],
            weapons: ['simple', 'hand_crossbow', 'longsword', 'rapier', 'shortsword'],
            savingThrows: ['DX', 'IT']
        },
        abilities: [
            {
                id: 'sneak_attack',
                name: 'Sneak Attack',
                description: 'Deal extra damage to distracted enemies.',
                level: 1,
                type: 'passive'
            }
        ]
    },
    {
        id: 'wizard',
        name: 'Wizard',
        description: 'A scholarly magic-user capable of manipulating the structures of reality.',
        baseStats: { HP: 6, AP: 10 },
        growthRates: { HP: 6, AP: 4 }, // AP growth needs to be balanced
        primaryAttributes: ['IT', 'WD'],
        proficiencies: {
            armor: [],
            weapons: ['dagger', 'dart', 'sling', 'quarterstaff', 'light_crossbow'],
            savingThrows: ['IT', 'WD']
        },
        abilities: [
            {
                id: 'arcane_recovery',
                name: 'Arcane Recovery',
                description: 'Regain some AP on short rest.',
                level: 1,
                type: 'active'
            }
        ],
        spellcasting: {
            ability: 'IT',
            type: 'prepared'
        }
    },
    {
        id: 'cleric',
        name: 'Cleric',
        description: 'A priestly champion who wields divine magic in service of a higher power.',
        baseStats: { HP: 8, AP: 8 },
        growthRates: { HP: 8, AP: 3 },
        primaryAttributes: ['WD', 'CH'],
        proficiencies: {
            armor: ['light', 'medium', 'shields'],
            weapons: ['simple'],
            savingThrows: ['WD', 'CH']
        },
        abilities: [
            {
                id: 'divine_domain',
                name: 'Divine Domain',
                description: 'Choose a domain related to your deity.',
                level: 1,
                type: 'passive'
            }
        ],
        spellcasting: {
            ability: 'WD',
            type: 'prepared'
        }
    },
    {
        id: 'ranger',
        name: 'Ranger',
        description: 'A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.',
        baseStats: { HP: 10, AP: 4 },
        growthRates: { HP: 10, AP: 2 },
        primaryAttributes: ['DX', 'WD'],
        proficiencies: {
            armor: ['light', 'medium', 'shields'],
            weapons: ['simple', 'martial'],
            savingThrows: ['ST', 'DX']
        },
        abilities: [
            {
                id: 'favored_enemy',
                name: 'Favored Enemy',
                description: 'Advantage on tracking and recalling info about certain enemies.',
                level: 1,
                type: 'passive'
            }
        ],
        spellcasting: {
            ability: 'WD',
            type: 'known'
        }
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
            savingThrows: ['WD', 'CH']
        },
        abilities: [
            {
                id: 'divine_sense',
                name: 'Divine Sense',
                description: 'Detect celestial, fiends, or undead.',
                level: 1,
                type: 'active'
            }
        ],
        spellcasting: {
            ability: 'CH',
            type: 'prepared'
        }
    },
    {
        id: 'barbarian',
        name: 'Barbarian',
        description: 'A fierce warrior of primitive background who can enter a battle rage.',
        baseStats: { HP: 12, AP: 0 },
        growthRates: { HP: 12, AP: 0 },
        primaryAttributes: ['ST', 'CO'],
        proficiencies: {
            armor: ['light', 'medium', 'shields'],
            weapons: ['simple', 'martial'],
            savingThrows: ['ST', 'CO']
        },
        abilities: [
            {
                id: 'rage',
                name: 'Rage',
                description: 'Advantage on ST checks, bonus damage, resistance to bludgeoning/piercing/slashing.',
                level: 1,
                type: 'active'
            }
        ]
    },
    {
        id: 'bard',
        name: 'Bard',
        description: 'An inspiring magician whose power echoes the music of creation.',
        baseStats: { HP: 8, AP: 8 },
        growthRates: { HP: 8, AP: 4 },
        primaryAttributes: ['CH', 'DX'],
        proficiencies: {
            armor: ['light'],
            weapons: ['simple', 'hand_crossbow', 'longsword', 'rapier', 'shortsword'],
            savingThrows: ['DX', 'CH']
        },
        abilities: [
            {
                id: 'bardic_inspiration',
                name: 'Bardic Inspiration',
                description: 'Inspire others to succeed on checks.',
                level: 1,
                type: 'active'
            }
        ],
        spellcasting: {
            ability: 'CH',
            type: 'known'
        }
    },
    {
        id: 'druid',
        name: 'Druid',
        description: 'A priest of the Old Faith, wielding the powers of nature and adopting animal forms.',
        baseStats: { HP: 8, AP: 8 },
        growthRates: { HP: 8, AP: 3 },
        primaryAttributes: ['WD', 'IT'],
        proficiencies: {
            armor: ['light', 'medium', 'shields'], // No metal
            weapons: ['club', 'dagger', 'dart', 'javelin', 'mace', 'quarterstaff', 'scimitar', 'sickle', 'sling', 'spear'],
            savingThrows: ['IT', 'WD']
        },
        abilities: [
            {
                id: 'druidic',
                name: 'Druidic',
                description: 'Know the secret language of druids.',
                level: 1,
                type: 'passive'
            }
        ],
        spellcasting: {
            ability: 'WD',
            type: 'prepared'
        }
    },
    {
        id: 'monk',
        name: 'Monk',
        description: 'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
        baseStats: { HP: 8, AP: 2 }, // Ki points treated as AP? Or separate?
        growthRates: { HP: 8, AP: 1 },
        primaryAttributes: ['DX', 'WD'],
        proficiencies: {
            armor: [],
            weapons: ['simple', 'shortsword'],
            savingThrows: ['ST', 'DX']
        },
        abilities: [
            {
                id: 'unarmored_defense',
                name: 'Unarmored Defense',
                description: 'AC = 10 + DX mod + WD mod when unarmored.',
                level: 1,
                type: 'passive'
            }
        ]
    },
    {
        id: 'sorcerer',
        name: 'Sorcerer',
        description: 'A spellcaster who draws on inherent magic from a gift or bloodline.',
        baseStats: { HP: 6, AP: 10 },
        growthRates: { HP: 6, AP: 4 },
        primaryAttributes: ['CH', 'CO'],
        proficiencies: {
            armor: [],
            weapons: ['dagger', 'dart', 'sling', 'quarterstaff', 'light_crossbow'],
            savingThrows: ['CO', 'CH']
        },
        abilities: [
            {
                id: 'sorcerous_origin',
                name: 'Sorcerous Origin',
                description: 'Choose the source of your magic.',
                level: 1,
                type: 'passive'
            }
        ],
        spellcasting: {
            ability: 'CH',
            type: 'known'
        }
    },
    {
        id: 'warlock',
        name: 'Warlock',
        description: 'A wielder of magic that is derived from a bargain with an extraplanar entity.',
        baseStats: { HP: 8, AP: 8 },
        growthRates: { HP: 8, AP: 3 },
        primaryAttributes: ['CH', 'WD'],
        proficiencies: {
            armor: ['light'],
            weapons: ['simple'],
            savingThrows: ['WD', 'CH']
        },
        abilities: [
            {
                id: 'otherworldly_patron',
                name: 'Otherworldly Patron',
                description: 'Choose who you struck a bargain with.',
                level: 1,
                type: 'passive'
            }
        ],
        spellcasting: {
            ability: 'CH',
            type: 'known'
        }
    }
];
