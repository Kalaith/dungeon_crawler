import type { Race } from '../types';

export const races: Race[] = [
    {
        id: 'human',
        name: 'Human',
        description: 'Versatile and adaptable, humans are the most common race. They excel in any profession through sheer drive and versatility.',
        attributeModifiers: {},
        abilities: [
            {
                id: 'versatile',
                name: 'Versatile',
                description: '+5 Skill Increase Attempts (25 total base)',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 30
    },
    {
        id: 'thorwalian',
        name: 'Thorwalian',
        description: 'Hulking seafaring warriors known for good living and battle lust. Hardy fighters who thrive in harsh northern climates.',
        attributeModifiers: {
            CO: 1,
            ST: 2,
            CH: -1
        },
        abilities: [
            {
                id: 'seafaring',
                name: 'Seafaring',
                description: 'Proficiency with ships and navigation',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'battle_lust',
                name: 'Battle Lust',
                description: 'Advantage on attack rolls when below half HP',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 30
    },
    {
        id: 'dwarf',
        name: 'Dwarf',
        description: 'Excellent smiths and warriors. Known for resilience, stonework affinity, and unwavering loyalty to clan and tradition.',
        attributeModifiers: {
            DX: 1,
            ST: 2,
            CH: -1,
            AG: -1
        },
        abilities: [
            {
                id: 'dwarven_resilience',
                name: 'Dwarven Resilience',
                description: 'Resistance to poison damage and advantage on saving throws against poison',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'stonecunning',
                name: 'Stonecunning',
                description: 'Proficiency in History checks related to stonework',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 25
    },
    {
        id: 'green_elf',
        name: 'Green Elf',
        description: 'Elves with closest contact to humans. Skilled with magic and missile weapons, self-disciplined and sociable.',
        attributeModifiers: {
            IT: 2,
            AG: 1,
            ST: -1,
            CO: -1
        },
        abilities: [
            {
                id: 'keen_senses',
                name: 'Keen Senses',
                description: 'Proficiency in Perception skill',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'fey_ancestry',
                name: 'Fey Ancestry',
                description: 'Advantage on saving throws against being charmed, magic can\'t put you to sleep',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'trance',
                name: 'Trance',
                description: 'Meditate for 4 hours instead of sleeping 8',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 30
    },
    {
        id: 'ice_elf',
        name: 'Ice Elf',
        description: 'Rare elves from the frozen north with mysterious sensory magic. Remarkable endurance and keen perception.',
        attributeModifiers: {
            AG: 2,
            IN: 1,
            ST: -1,
            CH: -1
        },
        abilities: [
            {
                id: 'cold_resistance',
                name: 'Cold Resistance',
                description: 'Resistance to cold damage',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'arctic_endurance',
                name: 'Arctic Endurance',
                description: 'Advantage on Constitution saves against environmental hazards',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'fey_ancestry',
                name: 'Fey Ancestry',
                description: 'Advantage on saving throws against being charmed',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 30
    },
    {
        id: 'silvan_elf',
        name: 'Silvan Elf',
        description: 'Secluded forest dwellers, masters of archery and nature magic. Self-sufficient and perfectly adapted to forest life.',
        attributeModifiers: {
            AG: 2,
            IN: 2,
            ST: -2,
            CO: -1
        },
        abilities: [
            {
                id: 'forest_survival',
                name: 'Forest Survival',
                description: 'Proficiency in Survival and Nature skills',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'master_archer',
                name: 'Master Archer',
                description: 'Advantage on ranged weapon attacks with bows',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'fey_ancestry',
                name: 'Fey Ancestry',
                description: 'Advantage on saving throws against being charmed',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 35
    },
    {
        id: 'halfling',
        name: 'Halfling',
        description: 'Diminutive folk known for practical minds, kind hearts, and surprising courage. Naturally lucky and nimble.',
        attributeModifiers: {
            DX: 2,
            CH: 1,
            ST: -2
        },
        abilities: [
            {
                id: 'lucky',
                name: 'Lucky',
                description: 'Reroll natural 1s on attack rolls, ability checks, or saving throws',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'brave',
                name: 'Brave',
                description: 'Advantage on saving throws against being frightened',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'nimble',
                name: 'Nimble',
                description: 'Can move through spaces of larger creatures',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 25
    },
    {
        id: 'gnome',
        name: 'Gnome',
        description: 'Boundlessly energetic and curious inventors. Natural affinity for illusions and mechanical contraptions.',
        attributeModifiers: {
            IT: 2,
            DX: 1,
            ST: -2
        },
        abilities: [
            {
                id: 'gnome_cunning',
                name: 'Gnome Cunning',
                description: 'Advantage on INT, WIS, and CHA saves against magic',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'artificers_lore',
                name: 'Artificer\'s Lore',
                description: 'Proficiency in History checks related to magic items and technology',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'darkvision',
                name: 'Darkvision',
                description: 'See in dim light within 60 feet as if it were bright light',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 25
    },
    {
        id: 'dragonborn',
        name: 'Dragonborn',
        description: 'Born of dragons, combining draconic and humanoid traits. Value honor and clan, possess devastating breath weapons.',
        attributeModifiers: {
            ST: 2,
            CH: 1,
            DX: -1
        },
        abilities: [
            {
                id: 'draconic_ancestry',
                name: 'Draconic Ancestry',
                description: 'Choose a dragon type, gain resistance to associated damage type',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'breath_weapon',
                name: 'Breath Weapon',
                description: 'Exhale destructive energy based on draconic ancestry',
                unlockLevel: 1,
                target: 'enemy'
            }
        ],
        movementRate: 30
    },
    {
        id: 'tiefling',
        name: 'Tiefling',
        description: 'Bearing infernal bloodline marks. Natural command of darkness and fire, often face prejudice but not inherently evil.',
        attributeModifiers: {
            CH: 2,
            IT: 1,
            WD: -1
        },
        abilities: [
            {
                id: 'darkvision',
                name: 'Darkvision',
                description: 'See in dim light within 60 feet as if it were bright light',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'hellish_resistance',
                name: 'Hellish Resistance',
                description: 'Resistance to fire damage',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'infernal_legacy',
                name: 'Infernal Legacy',
                description: 'Know Thaumaturgy cantrip, can cast Hellish Rebuke and Darkness',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 30
    },
    {
        id: 'half_elf',
        name: 'Half-Elf',
        description: 'Walking in two worlds but belonging to neither. Combine human versatility with elven grace and fey heritage.',
        attributeModifiers: {
            CH: 2,
            AG: 1,
            ST: -1
        },
        abilities: [
            {
                id: 'fey_ancestry',
                name: 'Fey Ancestry',
                description: 'Advantage on saving throws against being charmed, magic can\'t put you to sleep',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'skill_versatility',
                name: 'Skill Versatility',
                description: 'Proficiency in two skills of your choice',
                unlockLevel: 1,
                target: 'self'
            },
            {
                id: 'darkvision',
                name: 'Darkvision',
                description: 'See in dim light within 60 feet as if it were bright light',
                unlockLevel: 1,
                target: 'self'
            }
        ],
        movementRate: 30
    }
];

